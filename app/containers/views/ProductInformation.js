/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';

/**
 * Import Actions
*/

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
            cover: {
                condoms: require('../../assets/condoms_cover.png'),
                pills: require('../../assets/pills_cover.png'),
                emergency: require('../../assets/emergency_cover.png')
            }
        };

        // Bind functions to this
        this.back = this.back.bind(this);
    }

    back() {
        return Actions.pop();
    }

    render() {
        return (
            <ProductInformationComponent
              product={ this.props.product }
              cover={ this.state.cover[this.props.product.category] }
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
    products: PropTypes.object.isRequired
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
    return bindActionCreators({}, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(ProductInformation);
