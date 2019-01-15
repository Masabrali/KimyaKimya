/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';

/**
 * Import Actions
*/
import fetchUser from '../../actions/user';
import logout from '../../actions/logout';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import AccountComponent from '../../components/views/Account';
import Error from '../../components/others/Error';

type Props = {};

class Account extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            user: props.user,
            loading: false,
            refreshing: false,
            errors: {}
        };

        // Bind functions to this
        this.back = this.back.bind(this);
        this.handleError = this.handleError.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.changePhone = this.changePhone.bind(this);
        this.editGender = this.editGender.bind(this);
        this.editBirth = this.editBirth.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        if (isEmpty(this.props.user)) return this.fetchUser();
        else return;
    }

    componentDidMount() {
        return this.props.logScreen('Account', 'Account', { gender: this.props.user.gender, age: parseInt(Math.floor(moment.duration(moment(new Date()).diff(moment(this.props.user.birth))).asYears())) });
    }

    componentWillReceiveProps(props) {
        return this.setState({ user: props.user });
    }

    back() {
        return Actions.pop();
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

    fetchUser() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading && !this.state.refreshing) this.setState({ loading: true });

            return this.props.fetchUser({}).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false, done: false });

                    } else
                        return this.setState({ loading: false, refreshing: false, done: true, errors: {} });

                }, this.handleError)
                .catch(this.handleError);
        }
    }

    changePhone() {
        return Actions.changePhone();
    }

    editGender() {
        return Actions.editGender();
    }

    editBirth() {
        return Actions.editBirth();
    }

    logout() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            return this.props.logout().then(
                (data) => {

                    if (!isEmpty(data) && !isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ loading: false, refreshing: false, done: true, errors: {} });

                        return  Actions.reset('root');
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <AccountComponent
              user={ this.state.user }
              back={ this.back }
              loading={ this.state.loading }
              errors={ this.errors }
              refreshing={ this.state.refreshing }
              fetchUser={ this.fetchUser }
              changePhone={ this.changePhone }
              editGender={ this.editGender }
              editBirth={ this.editBirth }
              logout={ this.logout }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Account.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
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
        fetchUser: fetchUser,
        logout: logout,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Account);
