/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import isString from '../../utilities/isString';
import isIOS from '../../utilities/isIOS';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import Actions
*/
import contactUs from '../../actions/contactUs';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import ContactUsComponent from '../../components/views/ContactUs';
import Error from '../../components/others/Error';

/**
* Import Conditional Libraries
*/
const KeyboardEvents = (isIOS())? require('react-native-keyboardevents') : undefined; // Version can be specified in package.json
const AndroidKeyboardAdjust = (isAndroid())? require('react-native-android-keyboard-adjust') : undefined; // Version can be specified in package.json

type Props = {};

class ContactUs extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            done: undefined,
            errors: {},
            imageLoading: false,
            message: undefined,
            screenshot: undefined,
            keyboardHidden: true
        };

        // Class Members
        this.messageInput = undefined;
        this.content = undefined;

        // Bind functions to this
        this.back = this.back.bind(this);
        this.handleError = this.handleError.bind(this);
        this.messageFocused = this.messageFocused.bind(this);
        this.messageChanged = this.messageChanged.bind(this);
        this.pickImage = this.pickImage.bind(this);
        this.imageLoadStarted = this.imageLoadStarted.bind(this);
        this.imageLoadEnded = this.imageLoadEnded.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.contactUs = this.contactUs.bind(this);
    }

    componentWillMount() {

        if (isIOS()) {

            KeyboardEvents.Emitter.on(KeyboardEvents.KeyboardDidShowEvent, () => this.setState({ keyboardHidden: false }));

            KeyboardEvents.Emitter.on(KeyboardEvents.KeyboardWillHideEvent, () => this.setState({ keyboardHidden: true }));
        }

        return ( (isAndroid())? AndroidKeyboardAdjust.setAdjustResize() : 1 );
    }

    componentDidMount() {
        return this.props.logScreen('Contact Us', 'ContactUs', { gender: this.props.user.gender, age: parseInt(Math.floor(moment.duration(moment(new Date()).diff(moment(this.props.user.birth))).asYears())) });
    }

    componentWillUnmount() {

        if (isIOS()) {

            KeyboardEvents.Emitter.off(KeyboardEvents.KeyboardDidShowEvent, () => this.setState({ keyboardHidden: false }));

            KeyboardEvents.Emitter.off(KeyboardEvents.KeyboardWillHideEvent, () => this.setState({ keyboardHidden: true }));
        }

        return ( (isAndroid())? AndroidKeyboardAdjust.setAdjustPan() : 1 );
    }

    back() {
        return Actions.pop();
    }

    handleError(error) {

        const errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status : error.name,
            message: (error.response)? error.response.statusText : (isString(error))? error : error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, done: false });
    }

    messageFocused(messageInput, content) {

        if (isEmpty(this.messageInput)) this.messageInput = messageInput;

        if (isEmpty(this.content)) this.content = content;

        return 1;
    }

    messageChanged(message) {
        return this.setState({ message: message });
    }

    pickImage() {

        return (
            ImagePicker.showImagePicker({
                title: 'Select Screenshot'
            }, (response) => {

                if (response.error) return this.handleError(response.error)
                else {

                    if (!response.didCancel && !response.customButton)
                        return this.setState({
                            screenshot: {
                                uri: response.uri,
                                name: response.fileName,
                                mime: response.type,
                                type: response.type,
                                size: response.fileSize,
                                width: response.width,
                                height: response.height,
                                data: response.data
                            },
                            imageLoading: true
                        });
                }
            })
        );
    }

    imageLoadStarted() {
        return this.setState({ imageLoading: true });
    }

    imageLoadEnded() {
        return this.setState({ imageLoading: false });
    }

    removeImage() {
        return this.setState({ screenshot: undefined, imageLoading: false });
    }

    contactUs(messageInput) {

        // Validation
        let errors = {};
        if (!this.state.message || this.state.message == '') errors.message = "Message not Typed";

        this.setState({ errors: errors });

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) {

            Error(errors[Object.keys(errors)[0]]);

            if (!isEmpty(this.content) && !isEmpty(this.content._root))
                this.content._root.scrollToPosition(0, 0);

            if (errors.message) return messageInput._root.focus();
            else return;

        } else {

            const { message, screenshot } = this.state;

            this.setState({ loading: true });

            this.props.contactUs({ message, screenshot }).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        this.handleError(data.errors[Object.keys(data.errors)[0]]);

                        if (errors.message) messageInput._root.focus();

                        if (!isEmpty(this.content) && !isEmpty(this.content._root))
                            this.content._root.scrollToPosition(0, 0);

                        return this.setState({ errors, loading: false, imageLoading: false, done: false });

                    } else {

                        this.setState({ loading: false, imageLoading: false, errors: {}, done: true });

                        return Actions.pop();
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <ContactUsComponent
                gender={ this.props.user.gender }
                back={ this.back }
                screenshot={ this.state.screenshot }
                messageFocused={ this.messageFocused }
                messageChanged={ this.messageChanged }
                pickImage={ this.pickImage }
                imageLoadStarted={ this.imageLoadStarted }
                imageLoadEnded={ this.imageLoadEnded }
                removeImage={ this.removeImage }
                contactUs={ this.contactUs }
                loading={ this.state.loading }
                errors={ this.state.errors }
                imageLoading={ this.state.imageLoading }
                keyboardHidden={ this.state.keyboardHidden }
            />
        );
    }
}

/**
 * Container PropTypes
*/
ContactUs.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    contactUs: PropTypes.func.isRequired,
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
        contactUs: contactUs,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(ContactUs);
