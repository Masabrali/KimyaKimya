/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase'; // Version can be specified in package.json


/**
* Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import isFunction from '../../utilities/isFunction';

/**
 * Import Actions
*/
import fetchCountries from '../../actions/countries';
import fetchCountry from '../../actions/country';
import fetchUser from '../../actions/user';
import fetchRate from '../../actions/rate';
import fetchSpeed from '../../actions/speed';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import WelcomeComponent from '../../components/views/Welcome';
import Error from '../../components/others/Error';

type Props = {};

class Welcome extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            currentUser: firebase.auth().currentUser,
            loading: false,
            done: null,
            errors: {}
        };

        // Bind functions to this
        this.handleError = this.handleError.bind(this);
        this.fetchCountries = this.fetchCountries.bind(this);
        this.fetchRate = this.fetchRate.bind(this);
        this.fetchSpeed = this.fetchSpeed.bind(this);
        this.login = this.login.bind(this);
    }

    componentWillMount() {
        if (!isEmpty(this.state.currentUser)) return this.login();
    }

    componentDidMount() {

        this.props.logScreen('Welcome', 'Welcome');

        return SplashScreen.hide();
    }

    handleError(error) {

        const errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status:error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false });
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

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ errors: {}, loading: false, done: true });

                        return ( (isFunction(callback))? callback(data) : data );
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    fetchCountries(callback) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            this.setState({ loading: true });

            return this.props.fetchCountries().then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        const errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ errors: {}, loading: false, done: true });

                        return ( (isFunction(callback))? callback(data) : data );
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    fetchRate(callback) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            return this.props.fetchRate().then(
                (data) => {

                    if (data.errors !== undefined) return this.handleError(data.errors)
                    else {

                        this.setState({ loading: false, done: true, errors: {} });

                        return ( (isFunction(callback))? callback(data) : data );
                    }
                },
                this.handleError
            ).catch(this.handleError);
        }
    }

    fetchSpeed(silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            return this.props.fetchSpeed().then(
                (data) => {

                    if (data.errors !== undefined) return this.handleError(data.errors)
                    else {

                        this.setState({ loading: false, done: true, errors: {} });

                        return ( (isFunction(callback))? callback(data) : data );
                    }
                },
                this.handleError
            ).catch(this.handleError);
        }
    }

    async login() {

        // Validation
        let errors = {};
        let key;

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            try {

                if (isEmpty(this.props.user) || !this.props.user.gender || !this.props.user.birth)
                    errors.user = await this.fetchUser();

                if (!this.props.country) errors.country = await this.props.fetchCountry();

                if (isEmpty(this.props.countries)) errors.countries = await this.fetchCountries();

                if (!this.props.rate) errors.rate = await this.props.fetchRate();

                if (!this.props.speed) errors.speed = await this.props.fetchSpeed();

                for (key in errors)
                    if (!isEmpty(errors[key].errors) || !isEmpty(errors[key].error))
                        return this.handleError(errors[key].errors);

                return setTimeout( () => {

                    if (!isEmpty(this.state.currentUser)) {
                        if (isEmpty(this.props.user.gender))
                            return Actions.replace('gender', { action: 'gender' });
                        else if (isEmpty(this.props.user.birth))
                            return Actions.replace('birth', { action: 'birth' });
                        else return Actions.reset('app');
                    } else return Actions.login();
                } );

            } catch (error) {
                return this.handleError(error);
            }
        }
    }

    render() {
        return (
            <WelcomeComponent
              currentUser={ this.state.currentUser }
              gender={ this.props.user.gender }
              login={ this.login }
              loading={ this.state.loading }
              errors={ this.state.errors }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Welcome.propTypes = {
    languages: PropTypes.array.isRequired,
    countries: PropTypes.object.isRequired,
    country: PropTypes.string,
    user: PropTypes.object.isRequired,
    rate: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    fetchCountries: PropTypes.func.isRequired,
    fetchCountry: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    logScreen: PropTypes.func.isRequired,
    logScreen: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        countries: state.countries,
        country: state.country,
        user: state.user,
        rate: state.rate,
        speed: state.speed
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchCountries: fetchCountries,
        fetchCountry: fetchCountry,
        fetchUser: fetchUser,
        fetchRate: fetchRate,
        fetchSpeed: fetchSpeed,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Welcome);
