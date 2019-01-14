/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { BackHandler } from 'react-native'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import Actions
*/
import birth from '../../actions/birth';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import BirthComponent from '../../components/views/Birth';
import Error from '../../components/others/Error';

type Props = {};

class Birth extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            isBirthPickerVisible: false,
            birth: props.user.birth,
            loading: false,
            done: null,
            errors: {}
        };

        // Initialize other variables
        this.androidBackListener= undefined;

        // Bind functions to this
        this.handleError = this.handleError.bind(this);
        this.birth = this.birth.bind(this);
        this.toggleBirthPicker = this.toggleBirthPicker.bind(this);
        this.birthChanged = this.birthChanged.bind(this);
    }

    componentDidMount() {

        if (isAndroid() && (this.props.action == 'gender' || this.props.action == 'birth'))
            this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => {

                if (Actions.currentScene != 'gender') Actions.pop();

                return true;
            });
        else if (!isEmpty(this.androidBackListener)) this.androidBackListener.remove();
    }

    componentWillUnmount() {
        if (isAndroid() && !isEmpty(this.androidBackListener)) return this.androidBackListener.remove();
        else return 1;
    }

    toggleBirthPicker() {
        this.setState( { isBirthPickerVisible: !this.state.isBirthPickerVisible } );
    }

    birthChanged(birth) {

        this.setState({ birth: birth });

        this.toggleBirthPicker();
    }

    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status:error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false });
    }

    birth() {

        // Validation
        let errors = {};
        if (!this.state.birth) errors.birth = "Birthday not Provided";
        this.setState({ errors: errors });

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) {

            Error(errors[Object.keys(errors)[0]]);

            if (errors.birth) return this.setState({ isBirthPickerVisible: true });
            else return;

        } else {

            const { birth } = this.state;

            this.setState({ loading: true });

            this.props.birth({ birth }).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        if (errors.birth) this.setState({ isBirthPickerVisible: true });

                        return this.setState({ errors, loading: false });

                    } else {

                        this.setState({ loading: false, done: true });

                        if (isAndroid() && !isEmpty(this.androidBackListener))
                            this.androidBackListener.remove();

                        return ( (this.props.action == 'edit')? Actions.pop() : Actions.reset('app') );
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <BirthComponent
              action={ this.props.action }
              _birth={ this.state.birth }
              gender={ this.props.user.gender }
              birth={ this.birth }
              toggleBirthPicker={ this.toggleBirthPicker }
              isBirthPickerVisible={ this.state.isBirthPickerVisible }
              birthChanged={ this.birthChanged }
              loading={ this.state.loading }
              errors={ this.state.errors }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Birth.propTypes = {
    languages: PropTypes.array.isRequired,
    action: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    months: PropTypes.array.isRequired,
    birth: PropTypes.func.isRequired,
    logScreen: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        months: state.months
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        birth: birth,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Birth);
