/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux'; // Version can be specified in package.json

/**
 * Import Actions
*/
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import SettingsComponent from '../../components/views/Settings';

type Props = {};

class Settings extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {};

        // Bind functions to this
        this.account = this.account.bind(this);
        this.notifications = this.notifications.bind(this);
        this.help = this.help.bind(this);
        this.invite = this.invite.bind(this);
    }

    account() {
        return Actions.account();
    }

    notifications() {}

    help() {
        return Actions.help();
    }

    invite(method) {
        return Actions.invite();
    }

    render() {
        return (
            <SettingsComponent
              account={ this.account }
              notifications={ this.notifications }
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
    logScreen: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Settings);
