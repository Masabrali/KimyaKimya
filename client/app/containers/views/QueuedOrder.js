/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import Moment from 'moment';
import { phonecall, textWithoutEncoding } from 'react-native-communications'; // Version can be specified in package.json

/**
* Import Configurations
*/
import { GOOGLE_API_KEY } from '../../config';

/**
* Import Utilities
*/
import durationFormat from '../../utilities/durationFormat';
import isEmpty from '../../utilities/isEmpty';

/**
 * Import Actions
*/
import fetchHotpoints from '../../actions/hotpoints';
import confirmOrder from '../../actions/confirmOrder';

/**
 * Import Components
*/
import QueuedOrderComponent from '../../components/views/QueuedOrder';
import Error from '../../components/others/Error';

type Props = {};

class QueuedOrder extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            errors: {},
            mapLoading: false,
            mapReady: false,
            duration: props.order.location.duration,
            _duration: props.order.location._duration,
            durationUnits: props.order.location.durationUnits,
            timestamp: props.order.queuedDate,
            hotpoint: props.hotpoints[props.order.hotpoint.key] || props.order.hotpoint,
            cartCollapsed: true
        };

        // Initialize other variables
        this.map = undefined;
        this.marker = undefined;
        this.hotpoint_markers = undefined;
        this.map_direction = undefined;

        // Bind functions to this
        this.openCart = this.openCart.bind(this);
        this.closeCart = this.closeCart.bind(this);
        this.toggleCart = this.toggleCart.bind(this);
        this.handleError = this.handleError.bind(this);
        this.mapReady = this.mapReady.bind(this);
        this.mapDirectionsLoading = this.mapDirectionsLoading.bind(this);
        this.mapDirectionsReady = this.mapDirectionsReady.bind(this);
        this.fetchHotpoints = this.fetchHotpoints.bind(this);
        this.calculateDuration = this.calculateDuration.bind(this);
        this.back = this.back.bind(this);
        this.messageHotpoint = this.messageHotpoint.bind(this);
        this.callHotpoint = this.callHotpoint.bind(this);
        this.confirmOrder = this.confirmOrder.bind(this);
    }

    componentWillMount() {

        (isEmpty(this.props.hotpoints))? this.fetchHotpoints() : this.fetchHotpoints(true);

        this.calculateDuration();

        this.durationInterval = setInterval(this.calculateDuration, 60000);

        return this.durationInterval;
    }

    componentWillReceiveProps(props) {
        if (!isEmpty(props.hotpoints))
            return this.handleHotpoint(props.hotpoints[this.props.order.hotpoint.key]);
    }

    componentWillUnmount() {
        return clearInterval(this.durationInterval);
    }

    mapReady(map, marker, hotpoint_marker, directions) {

        this.map = map;
        this.map.animateToRegion(this.props.order.location);
        this.map.fitToCoordinates([this.props.order.location, this.state.hotpoint.location]);

        this.marker = marker;
        this.marker.animateMarkerToCoordinate(this.props.order.location);

        this.hotpoint_marker = hotpoint_marker;
        this.hotpoint_marker.animateMarkerToCoordinate(this.state.hotpoint.location);

        this.map_directions = directions;

        return this.setState({ mapReady: true, mapLoading: false });
    }

    handleHotpoint(hotpoint) {

        if (this.state.mapReady && !isEmpty(this.map) && !isEmpty(this.hotpoint_marker) && !isEmpty(this.map_directions)) {

            this.hotpoint_marker.animateMarkerToCoordinate(hotpoint.location);

            this.map.fitToCoordinates([this.props.order.location, hotpoint.location]);
        }

        return this.setState({ hotpoint: hotpoint || this.state.hotpoint });
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

    fetchHotpoints(silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!silent && !this.state.loading) this.setState({ loading: true });

            return this.props.fetchHotpoints({ silent: silent }).then(
                (data) => {

                    if (!isEmpty(data) && !isEmpty(data.errors))
                        return this.handleError(data.errors[0]);
                    else
                        return this.setState({ loading: false, done: true, errors: {} });
                },
                this.handleError
            ).catch(this.handleError);
        }
    }

    calculateDuration(_duration) {

        let duration = durationFormat(this.state._duration - Moment(new Date()).diff(Moment(this.state.timestamp), 'hours', true));

        return this.setState({ duration: (duration.duration < 1)? 0 : duration.duration, durationUnits: duration.units });
    }

    mapDirectionsLoading(directions) {
        return this.setState({ mapLoading: true });
    }

    mapDirectionsReady(directions) {

        let duration = durationFormat(directions.duration / 60);

        if (!isEmpty(this.map)) this.map.fitToCoordinates(directions.coordinates);

        return this.setState({ duration: duration.duration, _duration: duration.duration, durationUnits: duration.units, timestamp: (new Date()).getTime() });
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

    messageHotpoint() {
        return textWithoutEncoding(this.props.order.hotpoint.phone, 'Hello KimyaKimya, kindly revert back to me with information concerning the delivery status of my order. My OrderID is: ' + this.props.order.orderID + '. Regards.');
    }

    callHotpoint() {
        return phonecall(this.props.order.hotpoint.phone, true);
    }

    confirmOrder() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            this.setState({ loading: true });

            return this.props.confirmOrder(this.props.order).then(
                (data) => {

                    if (!isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ errors, loading: false, done: false });

                    } else {

                        this.setState({ loading: false, errors: {}, done: true });

                        return this.back();
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <QueuedOrderComponent
              gender={ this.props.user.gender }
              GOOGLE_API_KEY={ GOOGLE_API_KEY }
              loading={ this.state.loading }
              mapLoading={ this.state.mapLoading }
              errors={ this.state.errors }
              cartCollapsed={ this.state.cartCollapsed }
              order={ this.props.order }
              hotpoint={ this.state.hotpoint }
              duration={ this.state.duration }
              durationUnits={ this.state.durationUnits }
              handleError={ this.handleError }
              mapReady={ this.mapReady }
              mapDirectionsLoading={ this.mapDirectionsLoading }
              mapDirectionsReady={ this.mapDirectionsReady }
              openCart={ this.openCart }
              closeCart={ this.closeCart }
              toggleCart={ this.toggleCart }
              back={ this.back }
              messageHotpoint={ this.messageHotpoint }
              callHotpoint={ this.callHotpoint }
              confirmOrder={ this.confirmOrder }
            />
        )
    }
}

/**
 * Container PropTypes
*/
QueuedOrder.propTypes = {
    languages: PropTypes.array.isRequired,
    order: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    confirmOrder: PropTypes.func.isRequired,
    fetchHotpoints: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        hotpoints: state.hotpoints
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        confirmOrder: confirmOrder,
        fetchHotpoints: fetchHotpoints
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(QueuedOrder);
