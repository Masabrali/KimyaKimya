/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { ListView } from 'react-native'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';

/**
 * Import Actions
*/
import draftOrder from '../../actions/draftOrder';
import removeProductFromOrder from '../../actions/removeProductFromOrder';

/**
 * Import Components
*/
import OrderComponent from '../../components/views/Order';
import Error from '../../components/others/Error';

type Props = {};

class Order extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            errors: {},
            order: props.order
        };

        // Initialize Class Members
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        // Bind functions to this
        this.back = this.back.bind(this);
        this.draft = this.draft.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.remove = this.remove.bind(this);
        this.checkout = this.checkout.bind(this);
        this.back = this.back.bind(this);
    }

    componentWillReceiveProps(props) {
        return this.setState({ order: props.order });
    }

    back() {
        return Actions.pop();
    }

    draft() {
        if (this.props.draftOrder(this.state.order)) return Actions.pop();
    }

    editProduct(product, secId, rowId, rowMap) {

        /**
        * Close the Row on the View
        */
        rowMap[`${secId}${rowId}`].props.closeRow();

        /**
        * Move to the EditProduct View
        */
        return Actions.editProduct({ product: product });
    }

    remove(product, secId, rowId, rowMap) {

        /**
        * Close the Row on the View
        */
        rowMap[`${secId}${rowId}`].props.closeRow();

        /**
        * Update Order Global State by removing the Product
        */
        this.props.removeProductFromOrder(product);

        /**
        * Check to see if there are any products left
        */
        if (isEmpty(this.state.order.products)) return this.back();
        else return 1;
    }

    shop() {
        return Actions.shop();
    }

    checkout() {

        // Validation
        let errors = {};
        if (isEmpty(this.state.order.products)) errors.products = "Cart is Empty";
        if (!this.state.order.quantity) errors.quantity = "Cart is Empty";
        if (!this.state.order.amount) errors.amount = "Cart is Empty";
        this.setState({ errors: errors });

        // Handle Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else return Actions.location();

    }

    back() {
        return Actions.pop();
    }

    render() {
        return (
            <OrderComponent
              dataSource={ this.dataSource }
              order={ this.state.order }
              previous={ this.props.previous }
              draft={ this.draft }
              editProduct={ this.editProduct }
              remove={ this.remove }
              shop={ this.shop }
              checkout={ this.checkout }
              back={ this.back }
              errors={ this.state.errors }
            />
        )
    }
}

/**
 * Container PropTypes
*/
Order.propTypes = {
    languages: PropTypes.array.isRequired,
    order: PropTypes.object.isRequired,
    draftOrder: PropTypes.func.isRequired,
    removeProductFromOrder: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        order: state.order
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        draftOrder: draftOrder,
        removeProductFromOrder: removeProductFromOrder
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Order);
