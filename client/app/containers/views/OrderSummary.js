/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux'; // Version can be specified in package.json

/**
* Import Configurations
*/
import { GOOGLE_API_KEY } from '../../config';

/**
* Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import durationFormat from '../../utilities/durationFormat';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import Actions
*/
import submitOrder from '../../actions/order';

/**
 * Import Components
*/
import OrderSummaryComponent from '../../components/views/OrderSummary';
import Error from '../../components/others/Error';

type Props = {};

class OrderSummary extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            errors: {},
            done: false,
            cartCollapsed: true,
            order: props.order,
            mapLoading: false,
            mapReady: false
        };

        // Initialize other variables
        this.androidBackListener = undefined;
        this.map = undefined;
        this.marker = undefined;
        this.hotpoint_marker = undefined;
        this.map_direction = undefined;

        // Bind functions to this
        this.mapReady = this.mapReady.bind(this);
        this.mapDirectionsLoading = this.mapDirectionsLoading.bind(this);
        this.mapDirectionsReady = this.mapDirectionsReady.bind(this);
        this.handleError = this.handleError.bind(this);
        this.openCart = this.openCart.bind(this);
        this.closeCart = this.closeCart.bind(this);
        this.toggleCart = this.toggleCart.bind(this);
        this.checkout = this.checkout.bind(this);
        this.back = this.back.bind(this);
    }

    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status : error.name,
            message: (error.response)? error.response.statusText : (error.message)? error.message : error
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, mapLoading: false });
    }

    mapReady(map, marker, hotpoint_marker, directions) {

        this.map = map;
        this.map.animateToRegion(this.state.order.location);
        this.map.fitToCoordinates([this.state.order.location, this.state.order.hotpoint.location]);

        this.marker = marker;
        this.marker.animateMarkerToCoordinate(this.state.order.location);

        this.hotpoint_marker = hotpoint_marker;
        this.hotpoint_marker.animateMarkerToCoordinate(this.state.order.hotpoint.location);

        this.map_directions = directions;

        return this.setState({ mapReady: true, mapLoading: false });
    }

    mapDirectionsLoading(directions) {
        return this.setState({ mapLoading: true });
    }

    mapDirectionsReady(directions) {

        let order = this.state.order;
        let duration = durationFormat(directions.duration / 60);

        order.location._duration = duration.duration;
        order.location.duration = duration.duration;
        order.location.durationUnits = duration.units;

        order.location.distance = directions.distance;

        if (!isEmpty(this.map)) this.map.fitToCoordinates(directions.coordinates);

        return this.setState({ order: order });
    }

    checkout() {

        // Validation
        let errors = {};
        if (isEmpty(this.state.order.products)) errors.products = "Cart is Empty";
        if (!this.state.order.quantity) errors.quantity = "Cart is Empty";
        if (!this.state.order.amount) errors.amount = "Cart is Empty";
        if (isEmpty(this.state.order.location)) errors.location = "Location not Specified";
        if (!this.state.order.delivery) errors.delivery = "Location not Specified";
        this.setState({ errors: errors });

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) return Error(errors[Object.keys(errors)[0]]);
        else {

            /**
            * Set Loading State to true
            */
            if (!this.state.loading) this.setState({ loading: true });

            /**
            * Submit the Order
            */
            return this.props.submitOrder(this.state.order).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ loading: false, done: true, errors: {} });

                        return Actions.orderStatus({ order: data[Object.keys(data)[0]] });
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
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

    render() {
        return (
            <OrderSummaryComponent
              gender={ this.props.user.gender }
              GOOGLE_API_KEY={ GOOGLE_API_KEY }
              loading={ this.state.loading }
              mapLoading={ this.state.mapLoading }
              errors={ this.state.errors }
              cartCollapsed={ this.state.cartCollapsed }
              handleError={ this.handleError }
              mapReady={ this.mapReady }
              mapDirectionsLoading={ this.mapDirectionsLoading }
              mapDirectionsReady={ this.mapDirectionsReady }
              order={ this.state.order }
              openCart={ this.openCart }
              closeCart={ this.closeCart }
              toggleCart={ this.toggleCart }
              checkout={ this.checkout }
              back={ this.back }
            />
        )
    }
}

/**
 * Container PropTypes
*/
OrderSummary.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    submitOrder: PropTypes.func.isRequired
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
        submitOrder: submitOrder
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(OrderSummary);
