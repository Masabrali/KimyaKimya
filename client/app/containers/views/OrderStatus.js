/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { phonecall, textWithoutEncoding } from 'react-native-communications';
import Moment from 'moment';
import { BackHandler } from 'react-native'; // Version can be specified in package.json

/**
* Import Utilities
*/
import durationFormat from '../../utilities/durationFormat';
import isEmpty from '../../utilities/isEmpty';

/**
 * Import Actions
*/
import fetchHotpoints from '../../actions/hotpoints';
import confirmOrderDelivery from '../../actions/confirmOrderDelivery';

/**
 * Import Components
*/
import OrderStatusComponent from '../../components/views/OrderStatus';
import Error from '../../components/others/Error';

type Props = {};

class OrderStatus extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            errors: {},
            mapReady: false,
            hotpoint: props.hotpoints[props.order.hotpoint.key] || props.order.hotpoint,
            duration: props.order.location.duration,
            durationUnits: props.order.location.durationUnits,
        };

        // Initialize other variables
        this.androidBackListener = undefined;
        this.map = undefined;
        this.marker = undefined;
        this.hotpoint_markers = undefined;
        this.map_directions = undefined;

        // Bind functions to this
        this.handleError = this.handleError.bind(this);
        this.mapReady = this.mapReady.bind(this);
        this.calculateDuration = this.calculateDuration.bind(this);
        this.shop = this.shop.bind(this);
        this.orders = this.orders.bind(this);
        this.forward = this.forward.bind(this);
        this.messageHotpoint = this.messageHotpoint.bind(this);
        this.callHotpoint = this.callHotpoint.bind(this);
        this.confirmOrderDelivery = this.confirmOrderDelivery.bind(this);
    }

    componentWillMount() {

        this.calculateDuration();

        this.durationInterval = setInterval(this.calculateDuration, 60000);

        return this.durationInterval;
    }

    componentDidMount() {
        this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => true);
    }

    componentWillUnmount() {
        return clearInterval(this.durationInterval);
    }

    componentWillReceiveProps(props) {
        return this.setState({ orders: props.orders });
    }

    mapReady(map, marker, hotpoint_marker, directions) {

        this.map = map;

        this.marker = marker;

        this.hotpoint_marker = marker;

        this.map_directions = directions;

        return this.setState({ mapReady: true });
    }

    handleHotpoint(hotpoint) {

        if (this.state.mapReady && !isEmpty(this.map) && !isEmpty(this.hotpoint_marker) && !isEmpty(this.map_directions)) {

            this.hotpoint_marker.animateMarkerToCoordinate(hotpoints.location);

            this.map_directions.
        }

        return this.setState({ hotpoint: hotpoint || this.state.hotpoint });
    }

    calculateDuration() {

        let duration = durationFormat(this.props.order.location._duration - Moment(new Date()).diff(Moment(this.props.order.date), 'hours', true));

        return this.setState({ duration: duration.duration, durationUnits: duration.units });
    }

    shop() {
        return Actions.shop();
    }

    orders() {
        return Actions.orders();
    }

    forward() {
        if (isEmpty(this.props.orders.queued)) return this.shop();
        else return this.orders();
    }

    messageHotpoint() {
        return textWithoutEncoding(this.props.order.hotpoint.phone, 'Hello KimyaKimya, kindly revert back to me with information concerning the delivery status of my order. My OrderID is: ' + this.props.order.orderID + '. Regards.');
    }

    callHotpoint() {
        return phonecall(this.props.order.hotpoint.phone, true);
    }

    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status:error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false });
    };

    confirmOrderDelivery() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            this.setState({ loading: true });

            return this.props.confirmOrderDelivery(this.props.order).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ loading: false, errors: {}, done: true });

                        return this.forward();
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <OrderStatusComponent
              user={ this.props.user.gender }
              loading={ this.state.loading }
              errors={ this.state.errors }
              order={ this.props.order }
              duration={ this.state.duration }
              durationUnits={ this.state.durationUnits }
              forward={ this.forward }
              messageHotpoint={ this.messageHotpoint }
              callHotpoint={ this.callHotpoint }
              confirmOrderDelivery={ this.confirmOrderDelivery }
            />
        )
    }
}

/**
 * Container PropTypes
*/
OrderStatus.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    orders: PropTypes.object.isRequired,
    confirmOrderDelivery: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        orders: state.orders
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        confirmOrderDelivery: confirmOrderDelivery
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(OrderStatus);
