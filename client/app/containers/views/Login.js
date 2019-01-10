/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { Alert, BackHandler, PermissionsAndroid } from 'react-native'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import toArray from '../../utilities/toArray';
import titleCase from '../../utilities/titleCase';
import isEmpty from '../../utilities/isEmpty';
import isFunction from '../../utilities/isFunction';
import isIOS from '../../utilities/isIOS';
import isAndroid from '../../utilities/isAndroid';

/**
* Import Conditional Libraries
*/
const KeyboardEvents = (isIOS())? require('react-native-keyboardevents') : undefined; // Version can be specified in package.json

/**
 * Import Actions
*/
import fetchCountries from '../../actions/countries';
import fetchCountry from '../../actions/country';
import login from '../../actions/login';
import phone from '../../actions/phone';

/**
 * Other variables and constants
*/
import Styles from '../../components/styles';

/**
 * Import Components
*/
import LoginComponent from '../../components/views/Login';
import Error from '../../components/others/Error';

type Props = {};

class Login extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            countries: toArray(props.countries).map( (country) => (
                (!country)? { key: '', label: '' } : { key: '+' + country.code, label: titleCase(country.name), searchKey: '' }
            ) ),
            _country: props.country,
            country: (props.action != 'login')? props.user.country : (!!props.countries[props.country])? props.countries[props.country].name : undefined,
            countryCode: (props.action != 'login')? props.user.countryCode : (!!props.countries[props.country])? '+' + props.countries[props.country].code : undefined,
            countryCodePickerVisible: false,
            phone: undefined,
            loading: false,
            done: undefined,
            errors: {},
            keyboardHidden: true
        };

        // Initialize other variables
        this.androidBackListener = undefined;
        this.content = undefined;

        // Bind functions to this
        this.handleError = this.handleError.bind(this);
        this.fetchCountries = this.fetchCountries.bind(this);
        this.fetchCountry = this.fetchCountry.bind(this);
        this.toggleCountryCodePicker = this.toggleCountryCodePicker.bind(this);
        this.countryCodeChanged = this.countryCodeChanged.bind(this);
        this.phoneFocused = this.phoneFocused.bind(this);
        this.phoneChanged = this.phoneChanged.bind(this);
        this.changePhone = this.changePhone.bind(this);
        this.confirmPhone = this.confirmPhone.bind(this);
        this.login = this.login.bind(this);
        this.terms = this.terms.bind(this);
    }

    componentWillMount() {

        let fetchCountries = (country) => {

            if (isEmpty(this.props.countries) || isEmpty(this.props.countries.TZ))
                return this.fetchCountries();
            else
                return this.props.countries;
        };

        if (!this.props.country) return this.fetchCountry( (country) => fetchCountries(country) );
        else return fetchCountries();
    }

    componentDidMount() {

        if (isAndroid() && this.props.action == 'login')
            this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => {
                if (Actions.currentScene == 'loginTerms') return false;
                else return true;
            });
        else if (!isEmpty(this.androidBackListener)) this.androidBackListener.remove();

        if (isIOS()) {

            KeyboardEvents.Emitter.on(KeyboardEvents.KeyboardDidShowEvent, () => {

                this.setState({ keyboardHidden: false });

                return this.phoneFocused(this.content);
            });

            KeyboardEvents.Emitter.on(KeyboardEvents.KeyboardWillHideEvent, () => this.setState({ keyboardHidden: true }));
        }
    }

    componentWillReceiveProps(props) {
        return this.setState({
            countries: toArray(props.countries).map( (country) => (
                (!country)? { key: '', label: '' } : { key: '+' + country.code, label: titleCase(country.name), searchKey: '' }
            ) )
        });
    }

    componentWillUnmount() {

        if (isAndroid() && !isEmpty(this.androidBackListener)) this.androidBackListener.remove();

        if (isIOS()) {

            KeyboardEvents.Emitter.off(KeyboardEvents.KeyboardDidShowEvent, () => this.setState({ keyboardHidden: false }));

            KeyboardEvents.Emitter.off(KeyboardEvents.KeyboardWillHideEvent, () => this.setState({ keyboardHidden: true }));
        }
    }

    fetchCountry(callback) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            this.setState({ loading: true });

            return this.props.fetchCountry().then(
                (country) => {

                    this.setState({ errors: {}, loading: false, done: true });

                    if (isFunction(callback)) return callback(country);
                    else return country;

                }, this.handleError)
                .catch(this.handleError);
        }
    }

    fetchCountries() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            this.setState({ loading: true });

            return this.props.fetchCountries().then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false });

                    } else
                        return this.setState({ loading: false, done: true });
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    toggleCountryCodePicker() {
        return this.setState({ countryCodePickerVisible: !this.state.countryCodePickerVisible });
    }

    countryCodeChanged(countryCode) {

        let country = this.state.countries.find( (country) => ( (country.key) === (countryCode) ) );

        if (!!country)
            country = titleCase( (!!country.label)? country.label : country.name);
        else country = '';

        this.setState({
            countryCode: countryCode,
            country: country
        });

        return this.toggleCountryCodePicker();
    }

    phoneFocused(content) {

        if (!isEmpty(content) && !isEmpty(content._root)) {

            if (isEmpty(this.content) || isEmpty(this.content._root)) this.content = content;

            setTimeout( () => ( this.content._root.scrollToEnd({ animated: true }) ) );

        } else return 1;
    }

    phoneChanged(phone) {
        return this.setState({ phone: (phone.replace(/^0+/, '')).replace(/[^0-9]/g, '') });
    }

    validatePhone(phone) {
        return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im).test(phone);
    }

    /**
    * Change Phone
    */
    changePhone(phoneInput) {

        // Validation
        let errors = {};
        if (!this.state.countryCode) errors.countryCode = "Country Code not selected";
        if (this.state.countryCode != this.props.user.countryCode)
            errors.countryCode = "Incorrect Country Code selected";

        if (!this.state.phone) errors.phone = "Phone Number not entered";
        if (this.state.phone != this.props.user.phone)
            errors.phone = "Incorrect Phone Number entered";
        if (!this.validatePhone(this.state.countryCode + this.state.phone))
            errors.phone = "Invalid Phone Number entered";

        this.setState({ errors: errors });

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) {

            Error(errors[Object.keys(errors)[0]]);

            if (errors.phone) return phoneInput._root.focus();
            else return;

        } else return Actions.editPhone();
    }

    /**
    * Confirm Phone
    */
    confirmPhone(phoneInput) {

        // Validation
        let errors = {};
        if (!this.state.countryCode) errors.countryCode = "Country Code not selected";
        if (!this.state.phone) errors.phone = "Phone Number not entered";
        if (!this.validatePhone(this.state.countryCode + this.state.phone)) errors.phone = "Invalid Phone Number entered";
        this.setState({ errors: errors });

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) {

            Error(errors[Object.keys(errors)[0]]);

            if (errors.phone) return phoneInput._root.focus();
            else return;

        } else {

            return Alert.alert(
                'NUMBER CONFIRMATION',
                "Is your phone number (" + this.state.countryCode + " " + this.state.phone + ") correct?",
                [
                  { text: 'Edit', onPress: () => { return; }, style: 'cancel' },
                  { text: 'Yes', onPress: () => { this.login(phoneInput); } },
                ],
                { cancelable: false }
            );
        }
    }

    /**
    * HandleError
    */
    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status:error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, done: false });
    }

    /**
    * Login
    */
    login(phoneInput) {

        // Validation
        let errors = {};
        if (!this.state.countryCode && !this.state.country)
            errors.countryCode = "Country Code not selected";
        if (!this.state.phone) errors.phone = "Phone number not entered";
        if (!this.validatePhone(this.state.countryCode + this.state.phone)) errors.phone = "Invalid phone number entered";
        this.setState({ errors: errors });

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) {

            Error(errors[Object.keys(errors)[0]]);

            if (errors.phone) return phoneInput._root.focus();
            else return;

        } else {

            /**
            * Get the Country Code and Phone from State
            */
            const { country, countryCode, phone } = this.state;

            /**
            * Set the loading state to true
            */
            this.setState({ loading: true });

            /**
            * Send a login request to the server
            */
            let login = this.props[(this.props.action == 'edit' || this.props.action == 'phone')? 'phone' : 'login']({ country, countryCode, phone }).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        this.handleError(data.errors[Object.keys(data.errors)[0]]);

                        if (errors.phone) phoneInput._root.focus();

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ loading: false, errors: {}, done: true });

                        if (isAndroid() && !isEmpty(this.androidBackListener))
                            this.androidBackListener.remove();

                        if (this.props.action == 'edit' || this.props.action == 'phone')
                            return Actions.verifyPhone({ action: this.props.action, phoneVerification: data.phoneVerification, _user: data.user });
                        else
                            return Actions.verify({ action: this.props.action, confirmResults: data.confirmResults, _user: data.user });
                    }
                }, this.handleError)
                .catch(this.handleError);

            /**
            * Ask for the Permission to receive a Verirication SMS
            */
            if (isAndroid()) {

                try {

                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS).then( (permission) => {

                        if (permission != PermissionsAndroid.RESULTS.GRANTED)
                            return this.handleError({ message: 'Permission to access Incomming Validation SMS denied' })
                        else return permission;

                    }, this.handleError)
                    .catch(this.handleError);

                } catch(error) {

                    this.handleError(error);

                    throw error;
                }
            }

            return login;

        }
    }

    terms() {
        return Actions.loginTerms({ action: this.props.action });
    }

    render() {

        return (
            <LoginComponent
              action={ this.props.action }
              gender={ this.props.user.gender }
              countries={ this.state.countries }
              country={ this.state.country }
              confirmPhone={ this.confirmPhone }
              changePhone={ this.changePhone }
              countryCode={ this.state.countryCode }
              phone={ this.state.phone }
              countryCodePickerVisible={ this.state.countryCodePickerVisible }
              toggleCountryCodePicker={ this.toggleCountryCodePicker }
              countryCodeChanged={ this.countryCodeChanged }
              phoneFocused={ this.phoneFocused }
              phoneChanged={ this.phoneChanged }
              terms={ this.terms }
              titleCase={ this.titleCase }
              loading={ this.state.loading }
              errors={ this.state.errors }
              keyboardHidden={ this.state.keyboardHidden }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Login.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    countries: PropTypes.object.isRequired,
    country: PropTypes.string.isRequired,
    fetchCountries: PropTypes.func.isRequired,
    fetchCountry: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    phone: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state, props) {
    return {
        languages: state.languages,
        user: state.user,
        countries: state.countries,
        country: state.country
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchCountries: fetchCountries,
        fetchCountry: fetchCountry,
        login: login,
        phone: phone
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Login);
