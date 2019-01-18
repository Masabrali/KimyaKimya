/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { BackHandler, PermissionsAndroid } from 'react-native';
import firebase from 'react-native-firebase';
import moment from 'moment';
import momentTimer from 'moment-timer'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import isFunction from '../../utilities/isFunction';
import isIOS from '../../utilities/isIOS';
import isAndroid from '../../utilities/isAndroid';

/**
* Import Conditional Libraries
*/
const KeyboardEvents = (isIOS())? require('react-native-keyboardevents') : undefined;
const SmsListener = (isAndroid())? require('react-native-android-sms-listener').default : undefined; // Version can be specified in package.json

/**
 * Import Actions
*/
import verify from '../../actions/verify';
import resend from '../../actions/resend';
import fetchUser from '../../actions/user';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import VerifyComponent from '../../components/views/Verify';
import Error from '../../components/others/Error';

type Props = {};

class Verify extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            autoVerified: false,
            currentUser: firebase.auth().currentUser,
            verificationCode: null,
            smsWaitTime: 5,
            loading: false,
            verifying: false,
            resending: false,
            done: null,
            errors: {},
            keyboardHidden: true,
            phoneVerification: props.phoneVerification,
            phoneAuthSnapshot: undefined
        };

        // Initialize other variables
        this.unsubscribeFirebaseAuthentication = null;
        this.smsSubscription = undefined;
        this.codeInput = undefined;
        this.content = undefined;
        this.androidBackListener = undefined;
        this.smsWaitTimer = undefined;

        // Bind functions to this
        this.handleError = this.handleError.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.verify = this.verify.bind(this);
        this.resend = this.resend.bind(this);
        this.verificationCodeFocused = this.verificationCodeFocused.bind(this);
        this.verificationCodeChanged = this.verificationCodeChanged.bind(this);
    }

    componentWillMount() {

        try {

            if (isAndroid()) {
                /**
                * Listen to Incomming SMS for a Validation SMS
                */
                this.smsSubscription = SmsListener.addListener( (message) => {

                    if (!this.state.autoVerified) {

                        const verificationCodeRegex = /([\d]{6})/

                        const verificationCode = message.body.substr(0, 6);

                        if (verificationCodeRegex.test(verificationCode)) {

                            if (message.originatingAddress.indexOf('SMS') != -1 || message.originatingAddress.indexOf('Phone Code') != -1) {

                                this.setState({ verificationCode: verificationCode });

                                if (!this.state.verifying) return this.verify();
                                else return;
                            }
                        }
                    }
                } );

                /**
                * Firebase Authentication or PhoneNumber Verification
                */
                if (isEmpty(this.props.phoneVerification))
                      this.unsubscribeFirebaseAuthentication = firebase.auth().onAuthStateChanged( (user) => {

                          if (!isEmpty(user)) {

                              if (this.smsWaitTimer) this.smsWaitTimer.stop();

                              this.setState({
                                  autoVerified: true,
                                  currentUser: this.state.currentUser || user,
                                  smsWaitTime: 0
                              });

                              if (isAndroid() && !isEmpty(this.smsSubscription))
                                  this.smsSubscription.remove();

                              if (!this.state.verifying) return this.verify(this.codeInput, true);
                              else return;
                          }
                      } );

            }

            if (this.state.phoneVerification)
                this.state.phoneVerification.on('state_changed', (phoneAuthSnapshot) => {

                    this.setState({ phoneAuthSnapshot: phoneAuthSnapshot });

                    if (phoneAuthSnapshot.state === 'verified') {

                        if (this.smsWaitTimer) this.smsWaitTimer.stop();

                        this.setState({
                            autoVerified: true,
                            verificationCode: phoneAuthSnapshot.code,
                            smsWaitTime: 0
                        });

                        if (isAndroid() && !isEmpty(this.smsSubscription)) this.smsSubscription.remove();

                        if (!this.state.verifying) return this.verify(this.codeInput, true);
                        else return;
                    }
                },
                this.handleError,
                (phoneAuthSnapshot) => {

                    if (this.smsWaitTimer) this.smsWaitTimer.stop();

                    this.setState({
                        verificationCode: phoneAuthSnapshot.code,
                        phoneAuthSnapshot: phoneAuthSnapshot,
                        smsWaitTime: 0
                    })
                } );

        } catch(error) {

            this.handleError(error);

            throw error;
        }

        return 1;
    }

    componentDidMount() {

        /**
        * Back Hardware Button Handler
        */
        if (isAndroid() && this.props.action == 'login')
            this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => {

                if (Actions.currentScene != 'login') Actions.pop();

                return true;
            });
        else if (!isEmpty(this.androidBackListener)) this.androidBackListener.remove();

        /**
        * Change Keyboard Show/Hide State
        */
        if (isIOS()) {

            KeyboardEvents.Emitter.on(KeyboardEvents.KeyboardDidShowEvent, () => {

                this.setState({ keyboardHidden: false });

                return this.verificationCodeFocused(this.content);
            });

            KeyboardEvents.Emitter.on(KeyboardEvents.KeyboardWillHideEvent, () => this.setState({ keyboardHidden: true }));
        }

        /**
        * SMS Waiting
        */
        this.smsWaitTimer = moment.duration(1000).timer({ start: true, loop: true }, () => {

            const smsWaitTime = this.state.smsWaitTime - 1;

            if (smsWaitTime <= 0) {

                if (this.smsWaitTimer) this.smsWaitTimer.stop();

                return this.setState({ smsWaitTime: 0 });

            } else return this.setState({ smsWaitTime: smsWaitTime });
        });

        /**
        * Log Current Screen to Firebase Analytics
        */
        return this.props.logScreen((this.props.action == 'phone' || this.props.action == 'edit')? 'Verify Phone Number' : 'Verify Login', (this.props.action == 'phone' || this.props.action == 'edit')? 'VerifyPhone' : 'Verify', { gender: this.props.user.gender, age: (this.props.user.birth)? parseInt(Math.floor(moment.duration(moment(new Date()).diff(moment(this.props.user.birth))).asYears())) : undefined });
    }

    componentWillUnmount() {

        if (isAndroid()) {

            /**
            * Unsubsribe to the onFirebaseAuthenication change and PhoneNumber Verifiation Events
            */
            if (this.unsubscribeFirebaseAuthentication) this.unsubscribeFirebaseAuthentication();

            /**
            * Unsubscribe to the Android Back Button Hardware Press Event
            */
            if (!isEmpty(this.androidBackListener)) this.androidBackListener.remove();
        }

        /**
        * Unsubscribe to the Keyboard Show/Hide Events
        */
        if (isIOS()) {

            KeyboardEvents.Emitter.off(KeyboardEvents.KeyboardDidShowEvent, () => this.setState({ keyboardHidden: false }));

            KeyboardEvents.Emitter.off(KeyboardEvents.KeyboardWillHideEvent, () => this.setState({ keyboardHidden: true }));
        }

        /**
        * Unsubscribe to the Android SMS Listener
        */
        if (isAndroid() && !isEmpty(this.smsSubscription)) this.smsSubscription.remove();

        return 1;
    }

    verificationCodeFocused(content) {

        if (!isEmpty(content) && !isEmpty(content._root)) {

            if (isEmpty(this.content) || isEmpty(this.content._root)) this.content = content;

            return ( setTimeout( () => {
                if (!isEmpty(content) && !isEmpty(content._root))
                    content._root.scrollToEnd({ animated: true })
            }, 1) );

        } else return 1;
    }

    verificationCodeChanged(verificationCode) {
        return this.setState( {verificationCode: verificationCode} );
    }

    handleError(error) {

        const errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status:error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, resending: false, done: false });
    }

    fetchUser(callback) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            this.setState({ loading: true });

            return this.props.fetchUser().then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        const errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ errors: {}, loading: false, done: true });

                        if (isFunction(callback)) return callback(data);
                        else return data;
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    resend(codeInput) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            try {

                /**
                * Ask for the Permission to receive a Verirication SMS(for android only)
                */
                if (isAndroid()) {

                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS).then( (permission) => {

                        if (permission != PermissionsAndroid.RESULTS.GRANTED)
                            return this.handleError({ message: 'Permission to access Incomming Validation SMS denied' });
                        else return permission;

                    }, this.handleError)
                    .catch(this.handleError);
                }

                if (!this.state.resending) {

                    this.setState({ resending: true, smsWaitTime: 120 });

                    this.smsWaitTimer.start();
                }
                // this.props._user
                return this.props.resend({ countryCode: '+255', phone: '757543371' }).then(
                    (data) => {

                        if (!isEmpty(data.errors)) {

                            const errors = data.errors;

                            Error(errors[Object.keys(errors)[0]], 5000);

                            if (this.smsWaitTimer) this.smsWaitTimer.stop();

                            return this.setState({
                                errors,
                                resending: false,
                                done: false,
                                smsWaitTime: 0
                            });

                        } else {

                            if (!isEmpty(codeInput)) {

                                codeInput.clear();

                                codeInput.focus();
                            }

                            data.phoneVerification.on('state_changed', (phoneAuthSnapshot) => {

                                this.setState({ phoneAuthSnapshot: phoneAuthSnapshot });

                                if (phoneAuthSnapshot.state === 'verified') {

                                    if (this.smsWaitTimer) this.smsWaitTimer.stop();

                                    this.setState({
                                        autoVerified: true,
                                        verificationCode: phoneAuthSnapshot.code,
                                        smsWaitTime: 0
                                    });

                                    if (isAndroid() && !isEmpty(this.smsSubscription))
                                        this.smsSubscription.remove();

                                    if (!this.state.verifying)
                                        return this.verify(this.codeInput, true);
                                    else return;
                                }
                            },
                            this.handleError,
                            (phoneAuthSnapshot) => {

                                if (this.smsWaitTimer) this.smsWaitTimer.stop();

                                return this.setState({
                                    verificationCode: phoneAuthSnapshot.code,
                                    phoneAuthSnapshot: phoneAuthSnapshot,
                                    smsWaitTime: 0
                                })
                            } );

                            return (
                                this.setState({
                                    resending: false,
                                    done: true,
                                    errors: {},
                                    phoneVerification: data.phoneVerification
                                })
                            );
                        }
                    }, this.handleError)
                    .catch(this.handleError);

            } catch(error) {

                this.handleError(error);

                throw error;
            }
        }
    }

    verify(codeInput, autoVerified) {

        // Validation
        let errors = {};
        if (!autoVerified && !this.state.autoVerified) {
            if (!this.state.verificationCode) errors.verificationCode = "Verification Code Not Provided";
            // else {
            //     if (this.state.verificationCode != this.props.user.verificationCode)
            //         errors.verificationCode = "Incorrect Verification Code Provided";
            // }
            this.setState({ errors: errors });
        }

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) {

            Error(errors[Object.keys(errors)[0]]);

            if (errors.verificationCode) {
                if (!isEmpty(codeInput)) return codeInput.focus();
                else return;
            } else return;

        } else {

            const { verificationCode } = this.state;

            this.setState({ loading: true, verifying: true });

            this.props.verify({
                verificationCode,
                confirmResults: this.props.confirmResults,
                phoneVerification: this.state.phoneVerification,
                phoneAuthSnapshot: this.state.phoneAuthSnapshot,
                user: this.props._user,
                autoVerified: autoVerified || this.state.autoVerified,
                currentUser: this.state.currentUser,
                action: this.props.action
            }).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        const errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        if (errors.verificationCode) {

                            if (!isEmpty(codeInput)) {

                                codeInput.clear();

                                codeInput.focus();
                            }
                        }

                        return this.setState({ errors, loading: false, verifying: false });

                    } else {

                        if (isAndroid()) {

                            if (!isEmpty(this.androidBackListener)) this.androidBackListener.remove();

                            if (!isEmpty(this.smsSubscription)) this.smsSubscription.remove();

                            if (this.unsubscribeFirebaseAuthentication)
                                this.unsubscribeFirebaseAuthentication();
                        }

                        const next = (user) => {

                            this.setState({ loading: false, verifying: false, done: true });

                            return ( (this.props.action == 'edit' || this.props.action == 'phone')? Actions.popTo('account') : Actions.gender() );
                        };

                        if (isEmpty(this.props.user) || isEmpty(this.props.user.gender) || isEmpty(this.props.birth))
                            return this.fetchUser(next);
                        else {

                            this.setState({ loading: false, verifying: false, done: true });

                            return next();
                        }
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <VerifyComponent
              action={ this.props.action }
              gender={ this.props.user.gender }
              resend={ this.resend }
              verify={ this.verify }
              verificationCodeFocused={ this.verificationCodeFocused }
              verificationCodeChanged={ this.verificationCodeChanged }
              countryCode={ this.props.user.countryCode }
              phone={ this.props.user.phone }
              verificationCode={ this.props.user.verificationCode }
              _verificationCode={ this.state.verificationCode }
              smsWaitTime={ this.state.smsWaitTime }
              loading={ this.state.loading }
              resending={ this.state.resending }
              errors={ this.state.errors }
              keyboardHidden={ this.state.keyboardHidden }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Verify.propTypes = {
    languages: PropTypes.array.isRequired,
    action: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    verify: PropTypes.func.isRequired,
    resend: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    logScreen: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        verify: verify,
        resend: resend,
        fetchUser: fetchUser,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Verify);
