/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { ListView, BackHandler, Keyboard } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import Actions
*/
import fetchProducts from '../../actions/products';

/**
 * Import Components
*/
import ShopComponent from '../../components/views/Shop';
import Error from '../../components/others/Error';

/**
* Import Conditional Libraries
*/
const AndroidKeyboardAdjust = (isAndroid())? require('react-native-android-keyboard-adjust') : undefined; // Version can be specified in package.json

type Props = {};

class Shop extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            refreshing: false,
            done: false,
            errors: {},
            keyboardHeight: 0,
            cartSize: props.order.quantity,
            products: props.products,
            segment: 'condoms',
            thumbnail: {
                condoms: require('../../assets/condoms_thumbnail.png'),
                pills: require('../../assets/pills_thumbnail.png'),
                emergency: require('../../assets/emergency_thumbnail.png')
            },
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
        this.shop = this.shop.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentWillMount() {

        if (isEmpty(firebase.auth().currentUser)) return Actions.reset('root');
        else {

            Keyboard.addListener('keyboardDidShow', (e) => (
                this.setState({ keyboardHeight: (e.endCoordinates)? e.endCoordinates.height : 0 })
            ) );

            Keyboard.addListener('keyboardDidHide', () => ( this.setState({ keyboardHeight: 0 }) ) );

            return ( (isAndroid())? AndroidKeyboardAdjust.setAdjustPan() : 1 );
        }
    }

    componentDidMount() {

        if (isEmpty(this.props.products) || (isEmpty(this.props.products.condoms) && isEmpty(this.props.products.pills) && isEmpty(this.props.products.emergency)))
            this.refresh();
        else this.refresh(true);

	      return SplashScreen.hide();
    }

    componentWillReceiveProps(props) {

        this.setState({ cartSize: props.order.quantity, products: props.products });

        if (this.state.searchKey) this.search(this.state.searchKey);

        return 1;
    }

    componentWillUnmount() {

        Keyboard.removeAllListeners();

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
            return this.setState({ products: this.props.products, searchKey: undefined });
        else {

            let products = {};
            let product;
            let _key = key.toString().toLowerCase();

            Object.keys(this.props.products).map( (index) => {

                products[index] = products[index] || {};

                Object.keys(this.props.products[index]).map( (_index) => {

                    product = this.props.products[index][_index];

                    if ((product.name.toLowerCase().search(_key) !== -1) || (product.description.toLowerCase().search(_key) !== -1) || (product.price == Number(_key)))
                        products[index][_index] = product;

                    return product;
                } );
            } );

            return this.setState({ products: products, searchKey: key });
        }
    }

    changeSegment(segment) {
        return this.setState({ segment: segment });
    }

    shop(product) {

        if (!this.state.loading && !this.state.refreshing)
            return Actions.product({ product: product });
        else return;
    }

    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status : error.name,
            message: (error.response)? error.response.statusText : error.message
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

            this.props.fetchProducts({ silent }).then(
                (data) => {

                    if (!silent && !isEmpty(data.errors)) {

                        let errors = data.errors;

                        Error(errors[Object.keys(errors)[0]], 5000);

                        this.setState({ errors, loading: false, refreshing: false, done: false });

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

    checkout() {
        return Actions.checkout({ previous:'Shop' });
    }

    render() {
        return (
            <ShopComponent
              loading={ this.state.loading }
              refreshing={ this.state.refreshing }
              errors={ this.state.errors }
              keyboardHeight={ this.state.keyboardHeight }
              gender={ this.props.user.gender }
              cartSize={ this.state.cartSize }
              segment={ this.state.segment }
              products={ this.state.products }
              thumbnail={ this.state.thumbnail[this.state.segment] }
              searchFocused={ this.state.searchFocused }
              searchKey={ this.state.searchKey }
              focusSearch={ this.focusSearch }
              clearSearch={ this.clearSearch }
              blurSearch={ this.blurSearch }
              search={ this.search }
              changeSegment={ this.changeSegment }
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
Shop.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    fetchProducts: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        products: state.products,
        order: state.order,
        countries: state.countries
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchProducts: fetchProducts
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Shop);
