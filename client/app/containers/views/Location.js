/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import GooglePlaces from 'react-native-google-places';
import Settings from 'react-native-settings';
import { Alert, BackHandler, ListView, Dimensions, StatusBar } from 'react-native';
import moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import durationFormat from '../../utilities/durationFormat';
import isEmpty from '../../utilities/isEmpty';
import getDistance from '../../utilities/getDistance';
import isFunction from '../../utilities/isFunction';
import isString from '../../utilities/isString';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import Actions
*/
import fetchRate from '../../actions/rate';
import fetchSpeed from '../../actions/speed';
import fetchNearby from '../../actions/nearby';
import fetchPlaces from '../../actions/places';
import fetchHotpoints from '../../actions/hotpoints';
import fetchHotpoint from '../../actions/hotpoint';
import fetchDistance from '../../actions/distance';
import setPlaces from '../../actions/setPlaces';
import location from '../../actions/location';
import setOrderLocation from '../../actions/orderLocation';
import setOrderHotpoint from '../../actions/orderHotpoint';
import logScreen from '../../actions/logScreen';

/**
 * Import Components
*/
import LocationComponent from '../../components/views/Location';
import Error from '../../components/others/Error';

/**
* Import Styles
*/
import Styles from '../../components/styles';

type Props = {};

class Location extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize Componnent StateMembers
        const screen = Dimensions.get('window');
        const LATITUDE_DELTA = 0.0722; // const LATITUDE_DELTA = 0.0922;

        this.initialRegion = {
            latitude: -6.7724834,
            longitude: 39.2664724,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LATITUDE_DELTA * (screen.width / screen.height)
        };

        // Initialize state
        this.state = {
            loading: false,
            locationsLoading: false,
            errors: {},
            turnOnLocationError: false,
            order: props.order,
            places: props.places,
            hotpoints: props.hotpoints,
            rate: props.rate,
            speed: props.speed,
            locations: props.locations,
            mapReady: false,
            location: props.order.location,
            selectedLocation: {},
            regionChanged: 0,
            currentLocation: undefined,
            locationFocused: false,
            locationKey: undefined
        };

        // Initialize other variables
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => ( r1 !== r2 ) });
        this.geolocationWatchId = undefined;
        this.map = undefined;
        this.hotpoint_markers = undefined;
        this.locationInput = undefined;
        this.androidBackListener = undefined;

        // Bind functions to this
        this.mapReady = this.mapReady.bind(this);
        this.initializeLocation = this.initializeLocation.bind(this);
        this.dismissTurnOnLocationError = this.dismissTurnOnLocationError.bind(this);
        this.turnOnLocation = this.turnOnLocation.bind(this);
        this.askToTurnOnLocation = this.askToTurnOnLocation.bind(this);
        this.handleCurrentLocation = this.handleCurrentLocation.bind(this);
        this.handleLocation =this.handleLocation.bind(this);
        this.refreshLocation = this.refreshLocation.bind(this);
        this.userLocationChanged = this.userLocationChanged.bind(this);
        this.regionChanged = this.regionChanged.bind(this);
        this.mapPressed = this.mapPressed.bind(this);
        this.handleError = this.handleError.bind(this);
        this.sortPlaces = this.sortPlaces.bind(this);
        this.sortHotpoints = this.sortHotpoints.bind(this);
        this.fetchNearby = this.fetchNearby.bind(this);
        this.fetchPlaces = this.fetchPlaces.bind(this);
        this.fetchHotpoints = this.fetchHotpoints.bind(this);
        this.fetchHotpoint = this.fetchHotpoint.bind(this);
        this.fetchRate = this.fetchRate.bind(this);
        this.fetchSpeed = this.fetchSpeed.bind(this);
        this.getCurrentPlace = this.getCurrentPlace.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.watchCurrentLocation = this.watchCurrentLocation.bind(this);
        this.getPlace = this.getPlace.bind(this);
        this.focusLocation = this.focusLocation.bind(this);
        this.blurLocation = this.blurLocation.bind(this);
        this.clearLocation = this.clearLocation.bind(this);
        this.searchLocation = this.searchLocation.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
        this.location = this.location.bind(this);
        this.back = this.back.bind(this);
    }

    componentWillMount() {

        if (isAndroid())
            this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => {

                if (this.state.locationFocused) {

                    this.blurLocation(this.locationInput);

                    return true;
                }

                return false;
            });
    }

    componentDidMount() {

        ( (isEmpty(this.props.hotpoints))? this.fetchHotpoints() : this.fetchHotpoints(true) );

        ( (isEmpty(this.props.rate))? this.fetchRate() : this.fetchRate(true) );

        ( (isEmpty(this.props.speed))? this.fetchSpeed() : this.fetchSpeed(true) );

        this.initializeLocation();

        return this.props.logScreen('Location', 'Location', { gender: this.props.user.gender, age: parseInt(Math.floor(moment.duration(moment(new Date()).diff(moment(this.props.user.birth))).asYears())) });
    }

    componentWillReceiveProps(props) {

        if (!isEmpty(props.hotpoints)) this.handleHotpoints(props.hotpoints);

        return this.setState({
            order: props.order,
            places: props.places || this.state.places,
            locations: props.locations || this.state.locations,
            rate: props.rate || this.state.rate,
            speed: props.speed || this.state.speed
        });
    }

    componentWillUnmount() {

        if (isAndroid()) this.androidBackListener.remove();

        return navigator.geolocation.clearWatch(this.geolocationWatchId);
    }

    /**
    * HandleError
    */
    handleError(error, excuseLoading) {

        const errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status:error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors,
            loading: (excuseLoading)? this.state.loading : false,
            locationsLoading: (excuseLoading)? this.state.locationsLoading : false,
            done: false
        });
    }

    /**
    * Fetch Delivery Rate
    */
    fetchRate(silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!silent && !this.state.loading) this.setState({ loading: true });

            return this.props.fetchRate().then(
                (data) => {

                    if (!isEmpty(data.errors)) return this.handleError(data.errors, silent);
                    else
                        return (silent || this.setState({ loading: false, done: true, errors: {} }));
                },
                this.handleError
            ).catch(this.handleError);
        }
    }

    /**
    * Fetch Delivery Speed
    */
    fetchSpeed(silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!silent && !this.state.loading) this.setState({ loading: true });

            return this.props.fetchSpeed().then(
                (data) => {

                    if (!isEmpty(data.errors)) return this.handleError(data.errors, silent);
                    else
                        return (silent || this.setState({ loading: false, done: true, errors: {} }));
                },
                this.handleError
            ).catch(this.handleError);
        }
    }

    /**
    * Map has finished Renderring
    */
    mapReady(map, markers) {

        this.map = map;

        this.hotpoint_markers = markers;

        return this.setState({ mapReady: true });
    }

    /**
    * Initialize Location
    */
    initializeLocation(reset) {

        if (reset) this.getCurrentLocation();
        else {
            if (isEmpty(this.state.order.location)) this.getCurrentLocation();
            else {
                if (isEmpty(this.state.hotpoints)) this.fetchHotpoints();

                if (isEmpty(this.state.places) && this.state.regionChanged < 2)
                    this.fetchNearby(location);

                return this.handleLocation(this.state.order.location, true);
            }
        }

        return this.watchCurrentLocation(true);
    }

    /**
    * Dismiss Tunr On Location Error
    */
    dismissTurnOnLocationError() {
        return this.setState({ turnOnLocationError: false });
    }

    /**
    * Turn on Location
    */
    turnOnLocation(callback) {

        return Settings.openSetting(Settings.ACTION_LOCATION_SOURCE_SETTINGS).then(
          (result) => {

              if (result == Settings.ENABLED) {

                  this.initializeLocation();

                  this.dismissTurnOnLocationError();
              }

              if (isFunction(callback)) return callback(result);
              else return result;
          },
          this.handleError
        ).catch(this.handleError);
    }

    /**
    * Ask To Turn On Location
    */
    askToTurnOnLocation(callback) {

        return Alert.alert(
            'TURN ON LOCATION',
            "Turn On your Location Services to set your Delivery location",
            [
              { text: 'Cancel', onPress: () => {
                      if (isFunction(callback)) return callback(false);
                      else return;
                  },
                  style: 'cancel'
              },
              { text: 'Turn On', onPress: () => {

                      return this.turnOnLocation( (result) => {
                          if (isFunction(callback)) return callback(result);
                          else return result;
                      } );
                  }
              },
            ],
            { cancelable: false }
        );
    }

    /**
    * Handle the Position derived
    */
    handleLocation(location, animateRegion, silent) {

        location = { ...location };

        location.latitudeDelta = location.latitudeDelta || (isEmpty(this.state.location))? this.initialRegion.latitudeDelta : this.state.location.latitudeDelta;

        location.longitudeDelta = location.longitudeDelta || (isEmpty(this.state.location))? this.initialRegion.longitudeDelta : this.state.location.longitudeDelta;

        location.name = location.name || this.state.selectedLocation.name || undefined;

        location.address = location.address || this.state.selectedLocation.address || undefined;

        if (location != this.state.location) {

            if (isEmpty(this.state.hotpoints)) this.fetchHotpoints(silent);

            if (isEmpty(this.state.places) && this.state.regionChanged < 2)
                this.fetchNearby(location, silent);

            if (this.state.mapReady && !isEmpty(this.map) && !isEmpty(this.map.props.initialRegion) && this.map.props.region != location) {
                if (animateRegion) this.map.animateToRegion(location);
                else this.map.props.region = location;
            }

            return this.setState({
                location: location,
                selectedLocation: {},
                loading: (silent)? this.state.loading : false,
                errors: {}
            });

        } else return 1;
    }

    /**
    * Handle Current Location
    */
    handleCurrentLocation(location, silent) {

        location = { ...location };

        location.latitudeDelta = location.latitudeDelta || ((isEmpty(this.state.location))? this.initialRegion.latitudeDelta : this.state.location.latitudeDelta);

        location.longitudeDelta = location.longitudeDelta || ((isEmpty(this.state.location))? this.initialRegion.longitudeDelta : this.state.location.longitudeDelta);

        if (location != this.state.currentLocation) {

            if (this.state.mapReady && !isEmpty(this.map) && (this.map.props.initialRegion == this.initialRegion))
                this.map.animateToRegion(location);

            return this.setState({
                currentLocation: location,
                location: this.state.location || location,
                loading: (silent)? this.state.loading : false,
                errors: {}
            });

        } else return this.state.currentLocation;
    };

    /**
    * Handle Hotpoints
    */
    handleHotpoints(hotpoints) {

        if (this.state.mapReady && !isEmpty(this.map) && isAndroid())
            Object.keys(hotpoints).map( (key) => (
                (!isEmpty(this.hotpoint_markers) && !isEmpty(this.hotpoint_markers[key]))? this.hotpoint_markers[key].animateMarkerToCoordinate(hotpoints[key].location) : undefined
            ) );

        return this.setState({ hotpoints: hotpoints || this.state.hotpoints });
    }

    /**
    * Watch and Update the current GeoLocation of the User
    */
    watchCurrentLocation(silent) {

        /**
        * Geolocation Options
        */
        const geoLocationOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

        /**
        * Find location
        */
        return this.geolocationWatchId = navigator.geolocation.watchPosition( (location) => this.handleCurrentLocation(location.coords, silent),
            (error) => {

                const silent = (!isEmpty(this.state.currentLocation) || !isEmpty(this.state.order.location))

                if (error.code != 1) {

                    if (error.code == 2) this.setState({ turnOnLocationError: true });
                    else this.setState({ turnOnLocationError: false });

                    return this.handleError(error, silent);

                } else {

                    if (navigator.geolocation.requestAuthorization()) {
                        this.geolocationWatchId =  navigator.geolocation.watchPosition(
                            (location) => this.handleCurrentLocation(location.coords, silent),
                            (error) => ( this.handleError(error, silent) ),
                            geolocationOptions
                        );

                        return this.geolocationWatchId;
                    } else
                        return this.handleError(error, silent);
                }
            },
            geoLocationOptions
        );
    }

    /**
    * Refresh Location
    */
    refreshLocation() {

        this.handleLocation(this.state.currentLocation || this.initialRegion, true);

        return this.initializeLocation(true);
    }

    /**
    * SortPlaces
    */
    sortPlaces(places, location) {

        /**
        * Sort Places as an Array
        */
        const _places = (places || this.state.places).sort( (placeA, placeB) => {

            let { latitude, longitude } = (location || this.state.currentLocation || this.state.location);

            return (getDistance(placeA, { latitude, longitude }) - getDistance(placeB, { latitude, longitude }));
        });

        /**
        * Return the sorted Places
        */
        if (places) return _places;
        else return this.setState({ places: _places });
    }

    /**
    * SortHotpoints
    */
    sortHotpoints() {

        /**
        * Declare variables
        */
        const { latitude, longitude } = (this.state.location || this.state.currentLocation);
        let hotpoints = {};

        /**
        * Sort Places as an Array using keys
        */
        Object.keys(this.state.hotpoints).sort( (placeA, placeB) => (
            getDistance(hotpoints[placeA].location, { latitude, longitude }) - getDistance(hotpoints[placeB].location, { latitude, longitude })
        ) ).map( (key) => ( hotpoints[key] = this.state.hotpoints[key] ) );

        /**
        * Return the sorted Places
        */
        return this.setState({ hotpoints: hotpoints });
    }

    /**
    * fetchHotpoints
    */
    fetchHotpoints(silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!silent && !this.state.loading) this.setState({ loading: true });

            return this.props.fetchHotpoints({ silent: silent }).then(
                (data) => {

                    if (!isEmpty(data) && !isEmpty(data.errors))
                        return this.handleError(data.errors[0], silent);
                    else
                        return (silent || this.setState({ loading: false, done: true, errors: {} }));
                },
                (error) => ( this.handleError(error, silent) )
            ).catch( (error) => ( this.handleError(error, silent) ) );
        }
    }

    /**
    * fetchHotpoint
    */
    fetchHotpoint(callback, silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!silent && !this.state.loading) this.setState({ loading: true });

            return this.props.fetchHotpoint({ ...this.state.order, location: this.state.location })
            .then( (data) => {

                if (!isEmpty(data) && !isEmpty(data.errors))
                    return this.handleError(data.errors[0], silent);
                else {

                    if (!silent) this.setState({ loading: false, done: true, errors: {} });

                    if (isFunction(callback)) return callback(data);
                    else return data;
                }
            }, this.handleError)
            .catch(this.handleError);
        }
    }

    /**
    * Get Nearby Places
    */
    fetchNearby(location, silent) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (this.state.locationsLoading !== undefined) {
                if (!this.state.locationsLoading) this.setState({ locationsLoading: true });
            } else {
                if (!silent && !this.state.loading) this.setState({ loading: true });
            }

            return this.props.fetchNearby(location).then(
                (data) => {

                    if (data.error_message)
                        return this.handleError({ name: data.status, message: data.error_message }, silent)
                    else
                        return (silent || this.setState({ loading: false, locationsLoading: false, done: true, errors: {} }));
                },
                (error) => ( this.handleError(error, silent) )
            ).catch( (error) => ( this.handleError(error, silent) ) );
        }
    }

    /**
    * Fetch Places by Key
    */
    fetchPlaces(key, handleLocations, handleError, silent) {

        // Validation
        const errorHandler = (error) => {

            if (handleError)
                return handleError(error);
            else
                return this.handleError(error, silent);
        };
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (this.state.locationsLoading !== undefined) {
                if (!this.state.locationsLoading) this.setState({ locationsLoading: true });
            } else {
                if (!silent && !this.state.loading) this.setState({ loading: true });
            }

            if (isEmpty(GooglePlaces)) {

                return this.props.fetchPlaces(key).then(
                    (data) => {

                        if (data.error_message)
                            return errorHandler({name: data.status, message: data.error_message});
                        else {

                            if (!silent)
                                this.setState({ loading: false, locationsLoading: false, done: true, errors: {} });

                            return handleLocations(
                                (data.candidates || data.results).map(
                                    (place) => ({
                                          id: place.placeID || (Math.rand() * 1000000),
                                          name: place.name,
                                          address: place.address || place.formatted_address,
                                          latitude: place.latitude || place.geometry.location.lat,
                                          longitude: place.longitude || place.geometry.location.long
                                    })
                                )
                            );
                        }
                    }, errorHandler
                ).catch( (error) => ( this.handleError(error, silent) ) );
            } else
                return (
                    GooglePlaces.getAutocompletePredictions(key)
                    .then( (places) => {
                        if (this.props.setPlaces(places)) return handleLocations(places);
                    }, errorHandler)
                    .catch( (error) => ( this.handleError(error, silent) ) )
                );
        }
    }

    /**
    * Handle Region Change on the Map
    */
    regionChanged(region) {

        if (this.state.mapReady && this.state.regionChanged > 0) this.handleLocation(region, true);

        return this.setState({ regionChanged: this.state.regionChanged + 1 });
    }

    /**
    * Handle Map Pressed Event
    */
    mapPressed(location) {

        location = location.nativeEvent;

        if (this.state.mapReady) return this.handleLocation(location.coordinate, true);
        else return;
    }

    /**
    * User Location Changed
    */
    userLocationChanged(location) {

        location = location.nativeEvent.coordinate;

        if (this.state.mapReady && isEmpty(this.state.location))
            this.handleLocation(location, true);

        return this.handleCurrentLocation(location, true);
    }

    /**
    * Get Approximate User location using GooglePlaces
    */
    getCurrentPlace(silent) {
        return GooglePlaces.getCurrentPlace()
          .then( (place) => ( this.handleLocation(place, true, silent) ), (error) => ( this.handleError(error, silent) ) )
          .catch( (error) => ( this.handleError(error, silent) ) );
    }

    /**
    * Get current User location using Geolocation
    */
    getCurrentLocation(callback, silent) {

        /**
        * Handle the CurrentLocation
        */
        const handleCurrentLocation = (location) => (
            (isEmpty(this.state.location))? this.handleLocation(location.coords) : undefined
        );

        /**
        * Set loading
        */
        if (!silent && !this.state.loading) this.setState({ loading: true });

        /**
        * Geolocation Options
        */
        const geoLocationOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

        /**
        * Find location
        */
        return navigator.geolocation.getCurrentPosition(handleCurrentLocation,
            (error) => {

                if (error.code == 2) {

                    this.setState({ turnOnLocationError: true });

                    return this.askToTurnOnLocation((result) => (
                        (!result || result != Settings.ENABLED)? this.getCurrentPlace(silent) : 1
                    ) );
                } else if (error.code != 1 && error.code != 2) {

                    if (isEmpty(this.state.location)) this.handleError(error);

                    return this.setState({ turnOnLocationError: false });

                } else {

                    this.setState({ turnOnLocationError: false });

                    const silent = (!isEmpty(this.state.currentLocation) || !isEmpty(this.state.order.location));

                    if (navigator.geolocation.requestAuthorization())
                        return navigator.geolocation.getCurrentPosition(handleCurrentLocation,
                            (error) => ( this.getCurrentPlace(silent) ),
                            geolocationOptions
                        );
                    else
                        return this.getCurrentPlace(silent);
                }
            },
            geoLocationOptions
        );
    }

    /**
    * getPlace
    */
    getPlace(location, handleLocation, handleError, silent) {

        /**
        * Sort Places and get the first places
        */
        const place = this.sortPlaces(this.state.places, location)[0];

        /**
        * Pass Validated Place or Use Google API instead
        */
        if (!isEmpty(place)) return handleLocation(place);
        else
            return this.props.location(location).then(
                (data) => {

                    if (data.error_message) {

                        const error = { name: data.status, message: data.error_message };

                        return ((isFunction(handleError))? handleError(error) : this.handleError(error, silent));

                    } else {

                        location.name = data.results[0].address_components[0].long_name;
                        location.address = data.results[0].formatted_address;

                        return handleLocation(location, silent);
                    }
                },
                (error) => (
                    (isFunction(handleError))? handleError(error, silent) : this.handleError(error, silent)
                )
            ).catch( (error) => this.handleError(error, silent) );
    }

    /**
    * Focus Location Search Input
    */
    focusLocation(location) {

        if (!isEmpty(location) && !isEmpty(location._root)) {

            location._root.value = this.state.locationKey || '';

            location._root.focus();

            this.locationInput = location;
        }

        return this.setState({ locationFocused: true });
    }

    /**
    * Blur Location Search Input
    */
    blurLocation(location) {

        if (this.state.locationKey) this.searchLocation();

        if (!isEmpty(location) && !isEmpty(location._root)) {

            location._root.value = (!isEmpty(this.state._location))? ((this.state._location.name || '') + ((this.state._location.address)? (', ' + this.state._location.address) : '')) : '';

            location._root.blur();

            this.locationInput = this.locationInput || location;
        }

        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor(Styles.backgroundHeader.backgroundColor);

        return this.setState({ locationFocused: false });
    }

    /**
    * Clear Location Input
    */
    clearLocation(location) {

        if (!isEmpty(location) && !isEmpty(location._root)) {

            location._root.clear();

            this.locationInput = this.locationInput || location;

            return this.setState({ locationKey: undefined });
        }
    }

    /**
    * Search for Location using Key
    */
    searchLocation(key) {

        if (!key || key === '')
            return this.setState({ locations: this.props.locations, locationKey: undefined });
        else {

            /**
            * Handle Locations
            */
            const handleLocations = (locations) => {

                return this.setState({
                    locations: locations,
                    locationKey: key,
                    loading: false,
                    locationsLoading: undefined,
                    done: true,
                    errors: {},
                });
            }

            /**
            * Handle Errors
            */
            const handleError = (error) => {

                let errors = this.state.errors;

                errors.global = {
                    type: (error.response)? error.response.status:error.name,
                    message: (error.response)? error.response.statusText:error.message
                };

                Error(errors.global, 5000);

                return this.setState({ locations: [], locationKey: key, errors, locationsLoading: false, done: false });
            }

            /**
            * Check if Places are filled and if not fill them
            **/
            if (isEmpty(this.state.places)) this.fetchNearby(this.state.location, true);

            /**
            * Convert the search key into lower case
            */
            const _key = key.toString().toLowerCase();

            /**
            * Filter through the available places to look for possible place
            */
            this.sortPlaces();
            const locations = this.state.places.filter( (location) => {
                return ((location.name.toLowerCase().search(_key) !== -1) || (product.address.toLowerCase().search(_key) !== -1));
            });

            if (!isEmpty(locations)) return handleLocations(locations);
            else return this.fetchPlaces(key, handleLocations, handleError, true);
        }
    }

    /**
    * Select a Location from the Searched List
    */
    selectLocation(location, locationInput) {

        const _location = {
            latitude: location.latitude || location.coordinate.latitude || location.geomentry.location.lat,
            longitude: location.longitude || location.coordinate.longitude || location.geomentry.location.lng,
            latitudeDelta: location.latitudeDelta || location.coordinate.latitudeDelta || ((isEmpty(this.state.location))? this.initialRegion.latitudeDelta : this.state.location.latitudeDelta),
            longitudeDelta: location.longitudeDelta || location.coordinate.longitudeDelta || ((isEmpty(this.state.location))? this.initialRegion.longitudeDelta : this.state.location.longitudeDelta),
            name: location.name,
            address: location.address || location.formatted_address
        };

        this.blurLocation(locationInput);

        this.handleLocation(_location, true);

        return this.setState({ selectedLocation: _location });
    }

    /**
    * Process Location
    */
    location() {

        // Validation
        let errors = {};
        if (isEmpty(this.state.location)) errors.location = "Location not Specified";
        else {
            if (isEmpty(this.state.location.longitude)) errors.location = "Location not Specified";
            if (isEmpty(this.state.location.latitude)) errors.location = "Location not Specified";
            if (isEmpty(this.state.hotpoints)) errors.hotpoints = "No Hotpoints not available around your location."
        }
        this.setState({ errors: errors });

        // Handle Data Submission to server
        if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        else {

            /**
            * Function to Complete Order
            */
            const orderLocation = (data, hotpoint) => {
                
                /**
                * Check for Errors
                */
                if (!isEmpty(data) && !isEmpty(data.errors)) this.handleError(data.errors[0], true);

                /**
                * Create a temporary location object
                */
                const location = { ...this.state.location, rate: this.state.rate };

                /**
                * Get the Location Address
                */
                if (!location.address && !isEmpty(data.destination_addresses))
                    location.address = data.destination_addresses[0];

                /**
                * Get the Distance Value
                */
                location.distance = (!isEmpty(data.rows))? data.rows[0].elements.distance.value / 1000 : getDistance(location, hotpoint.location);

                /**
                * Get the Duration Value
                */
                location._duration = (!isEmpty(data.rows))? data.rows[0].elements.duration.value / 3600 : location.distance / ((hotpoint.speed !== undefined)? hotpoint.speed : this.state.speed);

                /**
                * Format the Duration
                */
                const duration = durationFormat(location._duration);
                location.duration = duration.duration;
                location.durationUnits = duration.units;

                /**
                * Check and add details to the location
                */
                /**
                * Create an orderSummary Finishing function
                */
                const orderSummary = (location) => {
                    /**
                    * Update the State
                    */
                    this.setState({ location: location, done: true, errors: {} });

                    /**
                    * Update Order and Move to the Next View
                    */
                    if (this.props.setOrderLocation(location)) {
                        /**
                        * Add Assigned Hotpoint to Order
                        */
                        if (this.props.setOrderHotpoint(hotpoint)) {

                            this.setState({ loading: false });

                            return Actions.orderSummary();
                        }
                    }

                };

                /**
                * Check and Get the Place, otherwise proceed to orderSummary
                */
                if (!location.name && !location.address) {

                    /**
                    * Get Place from Google Places
                    */
                    this.getPlace(location, (_location) => {

                        location.name = location.name || _location.name;
                        location.address = location.address || _location.address;

                        return orderSummary(location);

                    }, (error) => ( orderSummary(location) ), true);
                } else
                    return orderSummary(location);
            };

            /**
            * Set loading
            */
            if (!this.state.loading) this.setState({ loading: true });

            /**
            * Get Hotpoint from the Server
            */
            /**
            * Get Nearest Store and FetchDistance to the Store
            */
            return (
                this.fetchHotpoint( (hotpoint) => {

                    if (!isEmpty(hotpoint) && !isEmpty(hotpoint.errors))
                        return this.handleError(hotpoint.errors[0]);
                    else {

                        let errorHandler = (error) => ( orderLocation({ errors: [error] }, hotpoint) )
                        /**
                        * Fetch Distance from Location to Hotpoint
                        */
                        return (
                            this.props.fetchDistance({ origin: hotpoint.location, destination: this.state.location })
                            .then( (data) => ( orderLocation(data, hotpoint) ), errorHandler)
                            .catch(errorHandler)
                        );
                    }
                }, true)
            );
        }
    }

    back() {
        return Actions.pop();
    }

    render() {
        return (
            <LocationComponent
              dataSource={ this.dataSource }
              gender={ this.props.user.gender }
              _location={ this.state.location }
              initialRegion={ this.initialRegion }
              turnOnLocation={ this.turnOnLocation }
              locationFocused={ this.state.locationFocused }
              focusLocation={ this.focusLocation }
              blurLocation={ this.blurLocation }
              clearLocation={ this.clearLocation }
              searchLocation={ this.searchLocation }
              locationKey={ this.state.locationKey }
              locations={ this.state.locations }
              hotpoints={ this.state.hotpoints }
              selectLocation={ this.selectLocation }
              mapReady={ this.mapReady }
              regionChanged={ this.regionChanged }
              mapPressed={ this.mapPressed }
              userLocationChanged={ this.userLocationChanged }
              refreshLocation={ this.refreshLocation }
              fetchHotpoints={ this.fetchHotpoints }
              order={ this.state.order }
              location={ this.location }
              back={ this.back }
              loading={ this.state.loading }
              locationsLoading={ this.state.locationsLoading }
              dismissTurnOnLocationError={ this.dismissTurnOnLocationError }
              turnOnLocationError={ this.state.turnOnLocationError }
              errors={ this.state.errors }
            />
        )
    }
}

/**
 * Container PropTypes
*/
Location.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    places: PropTypes.array.isRequired,
    hotpoints: PropTypes.object.isRequired,
    rate: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    fetchRate: PropTypes.func.isRequired,
    fetchNearby: PropTypes.func.isRequired,
    fetchPlaces: PropTypes.func.isRequired,
    fetchHotpoints: PropTypes.func.isRequired,
    fetchHotpoint: PropTypes.func.isRequired,
    fetchDistance: PropTypes.func.isRequired,
    setPlaces: PropTypes.func.isRequired,
    location: PropTypes.func.isRequired,
    setOrderLocation: PropTypes.func.isRequired,
    logScreen: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        order: state.order,
        locations: state.locations,
        places: state.places,
        hotpoints: state.hotpoints,
        rate: state.rate,
        speed: state.speed
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchRate: fetchRate,
        fetchSpeed: fetchSpeed,
        fetchNearby: fetchNearby,
        fetchPlaces: fetchPlaces,
        fetchHotpoints: fetchHotpoints,
        fetchHotpoint: fetchHotpoint,
        fetchDistance: fetchDistance,
        setPlaces: setPlaces,
        location: location,
        setOrderLocation: setOrderLocation,
        setOrderHotpoint: setOrderHotpoint,
        logScreen: logScreen
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Location);
