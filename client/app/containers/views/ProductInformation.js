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
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import ProductInformationComponent from '../../components/views/ProductInformation';
import Error from '../../components/others/Error';

type Props = {};

class ProductInformation extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: true,
            thumbnail: {
                condoms: require('../../assets/condoms_thumbnail.png'),
                pills: require('../../assets/pills_thumbnail.png'),
                emergency: require('../../assets/emergency_thumbnail.png')
            }
        };

        // Bind functions to this
        this.stopLoading = this.stopLoading.bind(this);
        this.handleError = this.handleError.bind(this);
        this.back = this.back.bind(this);
    }

    componentDidMount() {
        return this.props.logScreen('Product Information', 'ProductInformation', { gender: this.props.user.gender, age: parseInt(Math.floor(moment.duration(moment(new Date()).diff(moment(this.props.user.birth))).asYears())) });
    }

    stopLoading() {
        return this.setState({ loading: false });
    }

    handleError(error) {
        return Error(error.description, 5000);
    }

    back() {
        return Actions.pop();
    }

    render() {
        return (
            <ProductInformationComponent
              gender={ this.props.user.gender }
              product={ this.props.product }
              thumbnail={ this.state.thumbnail[this.props.product.category] }
              loading={ this.state.loading }
              stopLoading={ this.stopLoading }
              handleError={ this.handleError }
              back={ this.back }
            />
        )
    }
}

/**
 * Container PropTypes
*/
ProductInformation.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
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
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(ProductInformation);
