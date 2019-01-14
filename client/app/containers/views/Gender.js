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
import gender from '../../actions/gender';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import GenderComponent from '../../components/views/Gender';
import Error from '../../components/others/Error';

type Props = {};

class Gender extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            gender: props.user.gender,
            loading: false,
            done: null,
            errors: {}
        };

        // Initialize other variables
        this.androidBackListener = undefined;

        // Bind functions to this
        this.handleError = this.handleError.bind(this);
        this.gender = this.gender.bind(this);
        this.genderChanged = this.genderChanged.bind(this);
    }

    componentDidMount() {
        if (this.props.action == 'gender' && isAndroid())
            this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => true);
        else if (!isEmpty(this.androidBackListener)) this.androidBackListener.remove();
    }

    componentWillUnmount() {
        if (isAndroid() && !isEmpty(this.androidBackListener)) return this.androidBackListener.remove();
        else return 1;
    }

    genderChanged(gender) {
        this.setState( {gender: gender} );
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

    gender() {

        // Validation
        let errors = {};
        if (!this.state.gender) errors.gender = "Gender Not Selected";
        this.setState({ errors: errors });

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            const { gender } = this.state;

            this.setState({ loading: true });

            this.props.gender({ gender }).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        this.setState({ errors, loading: false });

                    } else {

                        this.setState({ loading: false, done: true });

                        if (isAndroid() && !isEmpty(this.androidBackListener))
                            this.androidBackListener.remove();

                        return ( (this.props.action == 'edit')? Actions.pop() : Actions.birth({ action: 'gender' }) );
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <GenderComponent
              hideNavBar={ this.props.hideNavBar }
              action={ this.props.action }
              gender={ this.gender }
              genderChanged={ this.genderChanged }
              _gender={ this.state.gender }
              loading={ this.state.loading }
              errors={ this.state.errors }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Gender.propTypes = {
    languages: PropTypes.array.isRequired,
    action: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    gender: PropTypes.func.isRequired,
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
        gender: gender,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Gender);
