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
import reOrder from '../../actions/reOrder';
import deleteOrder from '../../actions/deleteOrder';

/**
 * Import Components
*/
import ReOrderComponent from '../../components/views/ReOrder';

type Props = {};

class ReOrder extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            done: false,
            errors: {},
            cartCollapsed: true
        };

        // Bind functions to this
        this.handleError = this.handleError.bind(this);
        this.openCart = this.openCart.bind(this);
        this.closeCart = this.closeCart.bind(this);
        this.toggleCart = this.toggleCart.bind(this);
        this.reOrder = this.reOrder.bind(this);
        this.back = this.back.bind(this);
        this.delete = this.delete.bind(this);
    }

    back() {
        return Actions.pop();
    }

    openCart() {
        return this.setState({ cartCollapsed: false });
    }

    closeCart() {
        return this.setState({ cartCollapsed: true });
    }

    toggleCart() {
        return this.setState({ cartCollapsed: !this.state.cartCollapsed });
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

    delete() {

        if (this.props.order.draft) {
            if (this.props.deleteOrder(this.props.order)) return Actions.pop();
        } else {

            // Validation
            let errors = {};

            // Hand;e Data Submission to server
            if (isEmpty(errors)) {

                if (!this.state.loading) this.setState({ loading: true });

                return this.props.deleteOrder(this.props.order).then(
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

        if (this.props.deleteOrder(this.props.order)) return Actions.pop();
    }

    reOrder(order) {

        // Validation
        let errors = {};
        if (this.props._order.products.length !== 0) errors.cart = "Another Order in Process";

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {
            if (this.props.reOrder(order, this.props.products)) return Actions.pop();
        }
    }

    render() {
        return (
            <ReOrderComponent
              loading={ this.state.loading }
              errors={ this.state.errors }
              cartCollapsed={ this.state.cartCollapsed }
              order={ this.props.order }
              _order={ this.props._order }
              months={ this.props.months }
              openCart={ this.openCart }
              closeCart={ this.closeCart }
              toggleCart={ this.toggleCart }
              reOrder={ this.reOrder }
              back={ this.back }
              delete={ this.delete }
            />
        )
    }
}

/**
 * Container PropTypes
*/
ReOrder.propTypes = {
    languages: PropTypes.array.isRequired,
    months: PropTypes.array.isRequired,
    products: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    _order: PropTypes.object.isRequired,
    reOrder: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        months: state.months,
        products: state.products,
        _order: state.order
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        reOrder: reOrder,
        deleteOrder: deleteOrder
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(ReOrder);
