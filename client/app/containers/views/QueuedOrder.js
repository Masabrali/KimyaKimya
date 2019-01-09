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
* Import Utilities
*/
import durationFormat from '../../utilities/durationFormat';
import isEmpty from '../../utilities/isEmpty';

/**
 * Import Actions
*/
import confirmOrderDelivery from '../../actions/confirmOrderDelivery';

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
            duration: props.order.location.duration,
            durationUnits: props.order.location.durationUnits,
            cartCollapsed: true
        };

        // Bind functions to this
        this.openCart = this.openCart.bind(this);
        this.closeCart = this.closeCart.bind(this);
        this.toggleCart = this.toggleCart.bind(this);
        this.handleError = this.handleError.bind(this);
        this.calculateDuration = this.calculateDuration.bind(this);
        this.back = this.back.bind(this);
        this.messageHotpoint = this.messageHotpoint.bind(this);
        this.callHotpoint = this.callHotpoint.bind(this);
        this.confirmOrderDelivery = this.confirmOrderDelivery.bind(this);
    }

    componentWillMount() {

        this.calculateDuration();

        this.durationInterval = setInterval(this.calculateDuration, 60000);

        return this.durationInterval;
    }

    componentWillUnmount() {
        return clearInterval(this.durationInterval);
    }

    calculateDuration() {

        let duration = durationFormat(this.props.order.location._duration - Moment(new Date()).diff(Moment(this.props.order.date), 'hours', true));

        return this.setState({ duration: duration.duration, durationUnits: duration.units });
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

                        return this.back();
                    }
                }, this.handleError)
                .catch(this.handleError);
        }
    }

    render() {
        return (
            <QueuedOrderComponent
              loading={ this.state.loading }
              errors={ this.state.errors }
              cartCollapsed={ this.state.cartCollapsed }
              order={ this.props.order }
              duration={ this.state.duration }
              durationUnits={ this.state.durationUnits }
              openCart={ this.openCart }
              closeCart={ this.closeCart }
              toggleCart={ this.toggleCart }
              back={ this.back }
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
QueuedOrder.propTypes = {
    languages: PropTypes.array.isRequired,
    order: PropTypes.object.isRequired,
    confirmOrderDelivery: PropTypes.func.isRequired
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
        confirmOrderDelivery: confirmOrderDelivery
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(QueuedOrder);
