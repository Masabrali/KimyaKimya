/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { ListView } from 'react-native';
import moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';

/**
 * Import Actions
*/
import draftOrder from '../../actions/draftOrder';
import removeProductFromOrder from '../../actions/removeProductFromOrder';
import logScreen from '../../actions/logScreen';

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
            loading: false,
            done: false,
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

    componentDidMount() {
        return this.props.logScreen('Order', 'Order', { gender: this.props.user.gender, age: parseInt(Math.floor(moment.duration(moment(new Date()).diff(moment(this.props.user.birth))).asYears())) });
    }

    componentWillReceiveProps(props) {
        return this.setState({ order: props.order });
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

        return this.setState({ errors, loading: false, done: false });
    }

    draft() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            return this.props.draftOrder(this.state.order).then(
                (data) => {

                    if (!isEmpty(data.errors)) return this.handleError(data.errors);
                    else {

                        this.setState({ loading: false, done: true, errors: {} });

                        return Actions.pop();
                    }
                }, this.handleError
            ).catch(this.handleError);
        }
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
              loading={ this.state.loading }
              errors={ this.state.errors }
              gender={ this.props.user.gender }
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
    user: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    draftOrder: PropTypes.func.isRequired,
    removeProductFromOrder: PropTypes.func.isRequired,
    logScreen: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        order: state.order
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        draftOrder: draftOrder,
        removeProductFromOrder: removeProductFromOrder,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Order);
