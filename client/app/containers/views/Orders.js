/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { ListView, BackHandler, Vibration } from 'react-native';
import Moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import isNumber from '../../utilities/isNumber';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import Actions
*/
import fetchOrders from '../../actions/orders';
import reOrder from '../../actions/reOrder';
import deleteOrder from '../../actions/deleteOrder';
import deleteOrders from '../../actions/deleteOrders';
import readQueuedOrder from '../../actions/readQueuedOrder';

/**
 * Import Components
*/
import OrdersComponent from '../../components/views/Orders';
import Error from '../../components/others/Error';

/**
* Import Conditional Libraries
*/
const AndroidKeyboardAdjust = (isAndroid())? require('react-native-android-keyboard-adjust') : undefined; // Version can be specified in package.json

type Props = {};

class Orders extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            refreshing: false,
            done: false,
            errors: {},
            cartSize: props.order.quantity,
            orders: props.orders,
            selected: {},
            segment: (props.orders.newOrderQueued && !isEmpty(props.orders.queued))? 'queued' : 'previous',
            searchFocused: false,
            searchKey: undefined
        };

        // Initialize Class Members
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.searchInput = undefined;

        // Bind functions to this
        this.handleError = this.handleError.bind(this);
        this.focusSearch = this.focusSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.blurSearch = this.blurSearch.bind(this);
        this.search = this.search.bind(this);
        this.changeSegment = this.changeSegment.bind(this);
        this.toggleOrderSelection = this.toggleOrderSelection.bind(this);
        this.selectAllOrders = this.selectAllOrders.bind(this);
        this.exitOrderSelection = this.exitOrderSelection.bind(this);
        this.reOrder = this.reOrder.bind(this);
        this.queuedOrder = this.queuedOrder.bind(this);
        this.quickReOrder = this.quickReOrder.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteOrders = this.deleteOrders.bind(this);
        this.refresh = this.refresh.bind(this);
        this.shop = this.shop.bind(this);
        this.checkout = this.checkout.bind(this);
    }

    componentDidMount() {

        if (isEmpty(this.props.orders.previous) && isEmpty(this.props.orders.drafts) && isEmpty(this.props.orders.queued)) this.refresh();
        else this.refresh(true);

        if (this.props.orders.newOrderQueued) this.props.readQueuedOrder();

        return 1;
    }

    componentWillReceiveProps(props) {

        this.setState({ cartSize: props.order.quantity, orders: props.orders });

        if (this.state.searchKey) this.search(this.state.searchKey);

        return 1;
    }

    componentWillUnmount() {
        if (isAndroid()) return AndroidKeyboardAdjust.setAdjustResize();
    }

    focusSearch(search) {

        if (!isEmpty(search) && !isEmpty(search._root))
            if (!this.searchInput) this.searchInput = search;

        if (isAndroid()) {

            this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => {

                if (this.state.searchFocused) {

                    this.blurSearch(this.searchInput);

                    return true;
                }

                return false;
            });

            AndroidKeyboardAdjust.setAdjustPan();
        }

        return this.setState({ searchFocused: true });
    }

    clearSearch(search) {

        if (!isEmpty(search) && !isEmpty(search._root)) {

            if (!this.searchInput) this.searchInput = search;

            search._root.clear();

            this.search();

            return this.setState({ searchKey: undefined });
        }
    }

    blurSearch(search) {

        if (this.state.searchKey) this.search();

        if (!isEmpty(search) && !isEmpty(search._root)) {

            search._root.clear();

            search._root.blur();

            if (!this.searchInput) this.searchInput = search;
        }

        return this.setState({ searchFocused: false, searchKey: undefined });
    }

    search(key) {

        if (!key || key === '')
            return this.setState({ orders: this.props.orders, searchKey: undefined });
        else {

            let orders = {};
            let _order = [];
            let _key = key.toString().toLowerCase();
            let date;

            Object.keys(this.props.orders).map( (index) => {
                orders[index] = this.props.orders[index].filter( (order) => {

                    _order = order.products.filter( (product) => {
                        return ((product.name.toLowerCase().search(_key) !== -1) || (product.description.toLowerCase().search(_key) !== -1) || (product.quantity == Number(key)) || (product.price == Number(_key)) || (product.amount == Number(_key)));
                    });

                    if (!isEmpty(_order) || (order.location && ((order.location.name.toLowerCase().search(_key) != -1) || (order.location.address.toLowerCase().search(_key) != -1) || (order.location.country.toLowerCase().search(_key) != -1))) || Moment(order.date).format('DD MM YYYY MMMM').toLowerCase().search(_key) != -1 || ( isNumber(_key) && ((order.quantity == Number(_key)) || (order.amount == Number(_key)))))
                        return order;

                } );
            } );

            return this.setState({ orders: orders, searchKey: key });
        }
    }

    changeSegment(segment) {
        return this.setState({ segment: segment });
    }

    toggleOrderSelection(order) {

        let selected = this.state.selected;
        let orders = this.state.orders;

        orders[this.state.segment][order.key].selected = !orders[this.state.segment][order.key].selected;

        if (!isEmpty(selected[order.key])) delete selected[order.key];
        else {

            if (isEmpty(selected)) Vibration.vibrate(100);

            selected[order.key] = order;
        }

        return this.setState({ selected: selected, orders: orders });
    }

    selectAllOrders() {

        let selected = this.state.selected;
        let orders = this.state.orders;

        if (Object.keys(selected).length != Object.keys(orders).length) {

            Object.keys(orders[this.state.segment]).map( (key) => (
                orders[this.state.segment][key].selected = true
            ) );

            selected = { ...orders[this.state.segment] };

        }

        return this.setState({ selected: selected, orders: orders });
    }

    exitOrderSelection() {

        let orders = this.state.orders;

        Object.keys(this.state.selected).map( (key) => {

            if (!isEmpty(orders[this.state.segment][key]))
                orders[this.state.segment][key].selected = false;

            return orders[this.state.segment][key];
        } );

        return this.setState({ selected: {}, orders: orders });
    }

    reOrder(order) {

        if (!this.state.loading && !this.state.refreshing)
            return Actions.reOrder({ order: order });
        else return;
    }

    quickReOrder(order, secId, rowId, rowMap) {

        /**
        * Close the Row on the View
        */
        rowMap[`${secId}${rowId}`].props.closeRow();

        // Validation
        let errors = {};
        if (this.state.cartSize !== 0) errors.cart = "Another Order in Process";

        // Hand;e Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else return this.props.reOrder(order, this.props.products);
    }

    queuedOrder(order) {
        return Actions.queuedOrder({ order: order });
    }

    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status : error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, done: false });
    }

    refresh(silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!silent && !this.state.loading && !this.state.refreshing)
                this.setState({ loading: true });

            return this.props.fetchOrders({ silent }).then(
                (data) => {

                    if (!silent && !isEmpty(data) && !isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        return this.setState({ refreshing: false, done: false, errors });

                    } else
                        return ( silent || this.setState({
                            loading: false,
                            refreshing: false,
                            done: true,
                            errors: {}
                        }) );

                }, (error) => ( silent || this.handleError(error) ) )
                .catch( (error) => ( silent || this.handleError(error) ) );
        }
    }

    delete(order, secId, rowId, rowMap) {

        /**
        * Close the Row on the View
        */
        rowMap[`${secId}${rowId}`].props.closeRow();

        /**
        * Update Orders Global State by removing the Order
        */
        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            return this.props.deleteOrder(order).then(
                (data) => {

                  if (!isEmpty(data.errors)) {

                      let errors = data.errors;

                      this.handleError(data.errors);

                      return this.setState({ loading: false, refreshing: false, done: false, errors });

                  } else
                      return this.setState({ loading: false, refreshing: false, done: true, errors: {} });

                }, this.handleError
            ).catch(this.handleError);
        }
    }

    deleteOrders() {

        if (!isEmpty(this.state.selected)) {

            /**
            * Update Orders Global State by removing the Order
            */
            // Validation
            let errors = {};

            // Hand;e Data Submission to server
            if (isEmpty(errors)) {

                if (!this.state.loading) this.setState({ loading: true });

                return this.props.deleteOrders(this.state.selected, this.state.segment).then(
                    (data) => {

                      if (!isEmpty(data.errors)) {

                          let errors = data.errors;

                          this.handleError(data.errors);

                          return this.setState({ loading: false, refreshing: false, done: false, errors });

                      } else {

                          this.exitOrderSelection();

                          return this.setState({ loading: false, refreshing: false, done: true, errors: {} });
                      }

                    }, this.handleError
                ).catch(this.handleError);
            }
        }
    }

    shop() {
        return Actions.shop();
    }

    checkout() {
        return Actions.checkout({ previous:'Orders' });
    }

    render() {
        return (
            <OrdersComponent
              dataSource={ this.dataSource }
              loading={ this.state.loading }
              refreshing={ this.state.refreshing }
              errors={ this.state.errors }
              months={ this.props.months }
              gender={ this.props.user.gender }
              cartSize={ this.state.cartSize }
              segment={ this.state.segment }
              orders={ this.state.orders }
              selected={ this.state.selected }
              searchFocused={ this.state.searchFocused }
              focusSearch={ this.focusSearch }
              clearSearch={ this.clearSearch }
              blurSearch={ this.blurSearch }
              search={ this.search }
              changeSegment={ this.changeSegment }
              toggleOrderSelection={ this.toggleOrderSelection }
              selectAllOrders={ this.selectAllOrders }
              exitOrderSelection={ this.exitOrderSelection }
              reOrder={ this.reOrder }
              queuedOrder={ this.queuedOrder }
              quickReOrder={ this.quickReOrder }
              delete={ this.delete }
              deleteOrders={ this.deleteOrders }
              shop={ this.shop }
              checkout={ this.checkout }
              refresh={ this.refresh }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Orders.propTypes = {
    languages: PropTypes.array.isRequired,
    months: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    segment: PropTypes.string,
    orders: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    fetchOrders: PropTypes.func.isRequired,
    reOrder: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired,
    readQueuedOrder: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        months: state.months,
        user: state.user,
        products: state.products,
        orders: state.orders,
        order: state.order
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchOrders: fetchOrders,
        reOrder: reOrder,
        deleteOrder: deleteOrder,
        deleteOrders: deleteOrders,
        readQueuedOrder: readQueuedOrder
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Orders);
