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
* Import Utiities
*/
import isEmpty from '../../utilities/isEmpty';

/**
 * Import Actions
*/
import invite from '../../actions/invite';
import fetchInvitation from '../../actions/invitation';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import SettingsComponent from '../../components/views/Settings';
import Error from '../../components/others/Error';

type Props = {};

class Settings extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            done: false,
            errors: {},
            invitation: props.invitation
        };

        // Bind functions to this
        this.account = this.account.bind(this);
        this.help = this.help.bind(this);
        this.handleError = this.handleError.bind(this);
        this.fetchInvitation = this.fetchInvitation.bind(this);
        this.invite = this.invite.bind(this);
    }

    componentDidMount() {

        if (isEmpty(this.props.invitation) || (!this.props.invitation.title && !this.props.invitation.message && !this.props.invitation.callToAction))
            this.fetchInvitation();
        else this.fetchInvitation(true);

        return this.props.logScreen('Settings', 'Settings', { gender: this.props.user.gender, age: parseInt(Math.floor(moment.duration(moment(new Date()).diff(moment(this.props.user.birth))).asYears())) });
    }

    componentWillReceiveProps(props) {
        return this.setState({ invitation: props.invitation });
    }

    account() {
        return Actions.account();
    }

    help() {
        return Actions.help();
    }

    handleError(error) {

        const errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status:error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, done: false });
    }

    fetchInvitation(silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!silent && !this.state.loading) this.setState({ loading: true });

            return this.props.fetchInvitation({ silent }).then(
                (data) => {

                    if (!isEmpty(data) && !isEmpty(data.errors)) {

                        const errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        this.setState({ errors, loading: false, done: false });

                    } else return this.setState({ errors: {}, loading: false, refreshing: false, done: true });

                }, this.handleError)
                .catch(this.handleError);
        }
    }

    invite() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            return this.props.invite(this.state.invitation).then(
                (data) => (
                    (!isEmpty(data) && !isEmpty(data.errors))? this.handleError(data.errors[0]) : this.setState({ loading: false, done: true, errors: {} })
                ), this.handleError
            ).catch(this.handleError);
        }
    }

    render() {
        return (
            <SettingsComponent
              loading={ this.state.loading }
              errors={ this.state.errors }
              gender={ this.props.user.gender }
              account={ this.account }
              help={ this.help }
              invite={ this.invite }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Settings.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    invite: PropTypes.func.isRequired,
    fetchInvitation: PropTypes.func.isRequired,
    logScreen: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        invitation: state.invitation
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        invite: invite,
        fetchInvitation: fetchInvitation,
        logScreen: logScreen,
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Settings);
