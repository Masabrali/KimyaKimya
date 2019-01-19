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
import editProductInOrder from '../../actions/editProductInOrder';

/**
 * Import Components
*/
import EditProductComponent from '../../components/views/EditProduct';
import Error from '../../components/others/Error';

type Props = {};

class EditProduct extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            type: (props.product.types)? props.product.types[0]:null,
            quantity: props.product.quantity,
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

    render() {
        return (
            <EditProductComponent
              product={ this.props.product }
              type={ this.state.type }
              quantity={ this.state.quantity }
              typeChanged={ this.typeChanged }
              quantityChanged={ this.quantityChanged }
              increaseQuantity={ this.increaseQuantity }
              decreaseQuantity={ this.decreaseQuantity }
              back={ this.back }
              productInformation={ this.productInformation }
              edit={ this.edit }
              errors={ this.state.errors }
            />
        )
    }
}

/**
 * Container PropTypes
*/
EditProduct.propTypes = {
    languages: PropTypes.array.isRequired,
    product: PropTypes.object.isRequired,
    editProductInOrder: PropTypes.func.isRequired
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
        editProductInOrder: editProductInOrder
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(EditProduct);
