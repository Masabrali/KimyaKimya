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
        this.login = this.login.bind(this);
    }

    componentWillMount() {

        if (!isEmpty(this.state.currentUser)) {

            if (isEmpty(this.props.user) || !this.props.user.gender || !this.props.user.birth)
                return this.fetchUser(this.login);
            else return this.login();
        }
    }

    componentDidMount() {
        return SplashScreen.hide();
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

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ errors: {}, loading: false, done: true });

                        if (isFunction(callback)) return callback(data);
                        else return data;
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

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ errors: {}, loading: false, done: true });

                        if (isFunction(callback)) return callback(data);
                        else return data;
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    login() {

        let login = () => {

            let _login = () => {

                return setTimeout( () => {

                    if (!isEmpty(this.state.currentUser)) {
                        if (isEmpty(this.props.user.gender))
                            return Actions.replace('gender', { action: 'gender' });
                        else if (isEmpty(this.props.user.birth))
                            return Actions.replace('birth', { action: 'birth' });
                        else return Actions.reset('app');
                    } else return Actions.login();
                } );
            };

            if (!isEmpty(this.props.countries)) return _login();
            else return this.fetchCountries(_login);
        };

        if (this.props.country) return login();
        else {

            this.setState({ loading: true });

            return this.props.fetchCountry().then(
                (country) => {

                    this.setState({ errors: {}, loading: false, done: true });

                    return login();

                }, this.handleError )
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <WelcomeComponent
              currentUser={ this.state.currentUser }
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
    // country: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    fetchCountries: PropTypes.func.isRequired,
    fetchCountry: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        countries: state.countries,
        country: state.country,
        user: state.user
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchCountries: fetchCountries,
        fetchCountry: fetchCountry,
        fetchUser: fetchUser
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Welcome);
