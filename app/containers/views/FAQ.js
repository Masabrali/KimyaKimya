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


/**
 * Import Components
*/
import FAQComponent from '../../components/views/FAQ';
import Error from '../../components/others/Error';

type Props = {};

class FAQ extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {};

        // Bind functions to this
        this.stopLoading = this.stopLoading.bind(this);
        this.handleError = this.handleError.bind(this);
        this.reload = this.reload.bind(this);
    }

    stopLoading() {
        return this.setState({ loading: false });
    }

    handleError(error) {
        return Error(error.description, 5000);
    }

    reload(webview) {
        return webview.reload();
    }

    render() {
        return (
            <FAQComponent
              gender={ this.props.user.gender }
              link={ this.props.links.faq }
              loading={ this.state.loading }
              stopLoading={ this.stopLoading }
              handleError={ this.handleError }
              reload={ this.reload }
            />
        );
    }
}

/**
 * Container PropTypes
*/
FAQ.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    links: PropTypes.object.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        links: state.links
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(FAQ);
