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
import addProductToOrder from '../../actions/addProductToOrder';
import editProductInOrder from '../../actions/editProductInOrder';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import ProductComponent from '../../components/views/Product';
import Error from '../../components/others/Error';

type Props = {};

class Product extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            cover: {
                condoms: require('../../assets/condoms_cover.png'),
                pills: require('../../assets/pills_cover.png'),
                emergency: require('../../assets/emergency_cover.png')
            },
            type: (!isEmpty(props.product.types))? { ...props.product.types[0] } : null,
            quantity: (props.action == 'edit')? props.product.quantity : 1,
            errors: {}
        };

        // Bind functions to this
        this.back = this.back.bind(this);
        this.productInformation = this.productInformation.bind(this);
        this.typeChanged = this.typeChanged.bind(this);
        this.quantityChanged = this.quantityChanged.bind(this);
        this.increaseQuantity = this.increaseQuantity.bind(this);
        this.decreaseQuantity = this.decreaseQuantity.bind(this);
        this.edit = this.edit.bind(this);
        this.order = this.order.bind(this);
    }

    back() {
        return Actions.pop();
    }

    productInformation() {
        return Actions.productInformation({ product: this.props.product });
    }

    typeChanged(type) {
        return this.setState({ type: type });
    }

    quantityChanged(quantity) {

        if (quantity === undefined || quantity == '' || typeof(quantity) === 'object') quantity = 1;

        if (this.state.quantity !== parseInt(quantity))
            return this.setState({ quantity: parseInt(quantity) });
        else return;
    }

    increaseQuantity() {
        return this.setState({ quantity: this.state.quantity + 1 })
    }

    decreaseQuantity() {

        let quantity = this.state.quantity - 1;

        if (quantity < 1) quantity = 1;

        return this.setState({ quantity: quantity });
    }

    edit() {

        // Validation
        let errors = {};
        if (this.state.quantity.toString() === '') errors.quantity = "Quantity not Specified";
        this.setState({ errors: errors });

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            const product = this.props.product;

            if (this.state.type != undefined) product.type = this.state.type;

            product.quantity = this.state.quantity;
            product.amount = product.price * this.state.quantity;

            if (this.props.editProductInOrder(product)) return Actions.pop();
        }
    }

    order() {

        // Validation
        let errors = {};
        if (this.state.quantity.toString() === '') errors.quantity = "Quantity not Specified";
        this.setState({ errors: errors });

        // Handle Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            const product = { ...this.props.product };

            if (this.state.type != undefined) product.type = this.state.type;

            product.quantity = this.state.quantity;
            product.amount = product.price * this.state.quantity;

            if (this.props.addProductToOrder(product)) return Actions.pop();
        }
    }

    render() {
        return (
            <ProductComponent
              product={ this.props.product }
              cover={ this.state.cover[this.props.product.category] }
              type={ this.state.type }
              quantity={ this.state.quantity }
              typeChanged={ this.typeChanged }
              quantityChanged={ this.quantityChanged }
              increaseQuantity={ this.increaseQuantity }
              decreaseQuantity={ this.decreaseQuantity }
              back={ this.back }
              productInformation={ this.productInformation }
              _action={ this.props.action }
              action={ (this.props.action == 'edit')? this.edit : this.order }
              errors={ this.state.errors }
            />
        )
    }
}

/**
 * Container PropTypes
*/
Product.propTypes = {
    languages: PropTypes.array.isRequired,
    product: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    addProductToOrder: PropTypes.func.isRequired,
    editProductInOrder: PropTypes.func.isRequired,
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
        addProductToOrder: addProductToOrder,
        editProductInOrder: editProductInOrder,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Product);
