/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import RNGooglePlaces from 'react-native-google-places';
import GooglePlaces from 'react-native-google-places';
import Settings from 'react-native-settings';
import { Alert, BackHandler, ListView, Dimensions } from 'react-native'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import durationFormat from '../../utilities/durationFormat';
import isEmpty from '../../utilities/isEmpty';
import degToRad from '../../utilities/degToRad';
import isFunction from '../../utilities/isFunction';
import isString from '../../utilities/isString';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import Actions
*/
import fetchRate from '../../actions/rate';
import fetchNearby from '../../actions/nearby';
import fetchPlaces from '../../actions/places';
import fetchHotpoints from '../../actions/hotpoints';
import fetchHotpoint from '../../actions/hotpoint';
import fetchDistance from '../../actions/distance';
import setPlaces from '../../actions/setPlaces';
import location from '../../actions/location';
import setOrderLocation from '../../actions/orderLocation';
import setOrderHotpoint from '../../actions/orderHotpoint';

/**
 * Import Components
*/
import LocationComponent from '../../components/views/Location';
import Error from '../../components/others/Error';

type Props = {};

class Location extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize Componnent StateMembers
        const screen = Dimensions.get('window');
        const LATITUDE_DELTA = 0.0722; // const LATITUDE_DELTA = 0.0922;

        this.initialRegion = {
            latitude: -6.8390920866185185,
            longitude: 39.212374817579985,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LATITUDE_DELTA * (screen.width / screen.height)
        };

        // Initialize state
        this.state = {
            loading: false,
            locationsLoading: false,
            errors: {},
            turnOnLocationError: false,
            places: props.places,
            hotpoints: props.hotpoints,
            rate: props.rate,
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
        this.marker = undefined;
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
        this.getDistance = this.getDistance.bind(this);
        this.sortPlaces = this.sortPlaces.bind(this);
        this.sortHotpoints = this.sortHotpoints.bind(this);
        this.fetchNearby = this.fetchNearby.bind(this);
        this.fetchPlaces = this.fetchPlaces.bind(this);
        this.fetchHotpoints = this.fetchHotpoints.bind(this);
        this.fetchHotpoint = this.fetchHotpoint.bind(this);
        this.fetchRate = this.fetchRate.bind(this);
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

        (isEmpty(this.props.hotpoints))? this.fetchHotpoints() : this.fetchHotpoints(true);

        return ( (isEmpty(this.props.rate))? this.fetchRate() : this.fetchRate(true) );
    }

    componentDidMount() {

        if (isAndroid())
            this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => {

                if (this.state.locationFocused) {

                    this.blurLocation(this.locationInput);

                    return true;
                }

                return false;
            });

        return this.initializeLocation();
    }

    componentWillReceiveProps(props) {

        if (!isEmpty(props.hotpoints)) this.handleHotpoints(props.hotpoints);

        return this.setState({
            order: props.order,
            places: props.places || this.state.places,
            locations: props.locations || this.state.locations,
            rate: props.rate || this.state.rate
        });
    }

    componentWillUnmount() {

        if (isAndroid()) this.androidBackListener.remove();

        return navigator.geolocation.clearWatch(this.geolocationWatchId);
    }

    /**
    * HandleError
    */
    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status:error.name,
            message: (error.response)? error.response.statusText:error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, done: false });
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

                    if (data.errors !== undefined) return this.handleError(data.errors)
                    else
                        return this.setState({ loading: false, done: true, errors: {} });
                },
                this.handleError
            ).catch(this.handleError);
        }
    }

    /**
    * Map has finished Renderring
    */
    mapReady(map, marker, markers) {

        this.map = map;

        this.marker = marker;

        this.hotpoint_markers = markers;

        return this.setState({ mapReady: true });
    }

    /**
    * Initialize Location
    */
    initializeLocation(reset) {

        if (reset) this.getCurrentLocation();
        else {
            if (isEmpty(this.props.order.location)) this.getCurrentLocation();
            else {
                if (isEmpty(this.state.hotpoints)) this.fetchHotpoints(this.props.order.location);
            }
        }

        return this.watchCurrentLocation();
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
    handleLocation(location, animateRegion) {

        location = { ...location };

        location.latitudeDelta = location.latitudeDelta || (isEmpty(this.state.location))? this.initialRegion.latitudeDelta : this.state.location.latitudeDelta;

        location.longitudeDelta = location.longitudeDelta || (isEmpty(this.state.location))? this.initialRegion.longitudeDelta : this.state.location.longitudeDelta;

        location.name = location.name || this.state.selectedLocation.name || undefined;

        location.address = location.address || this.state.selectedLocation.address || undefined;

        if (location != this.state.location) {

            if (isEmpty(this.state.hotpoints)) this.fetchHotpoints(location);

            if (isEmpty(this.state.places) && this.state.regionChanged < 2)
                this.fetchNearby(location);

            if (this.state.mapReady && !isEmpty(this.map) && !isEmpty(this.map.props.initialRegion) && this.map.props.region != location) {
                if (animateRegion) this.map.animateToRegion(location);
                else this.map.props.region = location;
            }

            if (this.state.mapReady && !isEmpty(this.marker))
                this.marker.animateMarkerToCoordinate(location);

            return this.setState({ location: location, selectedLocation: {}, loading: false, errors: {} });

        } else return 1;
    }

    /**
    * Handle Current Location
    */
    handleCurrentLocation(location) {

        location = { ...location };

        location.latitudeDelta = location.latitudeDelta || (isEmpty(this.state.location))? this.initialRegion.latitudeDelta : this.state.location.latitudeDelta;

        location.longitudeDelta = location.longitudeDelta || (isEmpty(this.state.location))? this.initialRegion.longitudeDelta : this.state.location.longitudeDelta;

        if (location != this.state.currentLocation) {

            if (this.state.mapReady && !isEmpty(this.map) && (this.map.props.initialRegion == this.initialRegion)) {

                this.map.animateToRegion(location);

                this.marker.animateMarkerToCoordinate(location);
            }

            return this.setState({ currentLocation: location, location: this.state.location || location, loading: false, errors: {} });

        } else return this.state.currentLocation;
    };

    /**
    * Handle Hotpoints
    */
    handleHotpoints(hotpoints) {

        if (this.state.mapReady && !isEmpty(this.map))
            Object.keys(hotpoints).map( (key) => (
                (!isEmpty(this.hotpoint_markers) && !isEmpty(this.hotpoint_markers[key]))? this.hotpoint_markers[key].animateMarkerToCoordinate(hotpoints[key].location) : undefined
            ) );

        return this.setState({ hotpoints: hotpoints || this.state.hotpoints });
    }

    /**
    * Watch and Update the current GeoLocation of the User
    */
    watchCurrentLocation() {

        /**
        * Geolocation Options
        */
        let geoLocationOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

        /**
        * Find location
        */
        return this.geolocationWatchId = navigator.geolocation.watchPosition( (location) => this.handleCurrentLocation(location.coords),
            (error) => {

                if (error.code != 1) return this.handleError(error);
                else {

                    if (navigator.geolocation.requestAuthorization())
                        this.geolocationWatchId =  navigator.geolocation.watchPosition(
                            (location) => this.handleCurrentLocation(location.coords),
                            this.handleError,
                            geolocationOptions
                        );
                    else this.handleError(error);
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
    * Distance Between two places
    */
    getDistance(placeA, placeB) {

        // Radius of the earth in km
        let Radius = 6371;

        // Get Latitudinal and Longitudinal Distance in Radians
        let latDistance = degToRad(placeB.latitude - placeA.latitude);
        let lngDistance = degToRad(placeB.longitude - placeA.longitude);

        // Calculate Mathematical Hypotenal Distance Squared
        let hypDistance = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) + Math.cos(degToRad(placeA.latitude)) * Math.cos(degToRad(placeB.latitude)) * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);

        // Return Distance in meters
        return (Radius * 2 * Math.atan2(Math.sqrt(hypDistance), Math.sqrt(1 - hypDistance)));
    }

    /**
    * SortPlaces
    */
    sortPlaces(places, location) {

        /**
        * Sort Places as an Array
        */
        let _places = (places || this.state.places).sort( (placeA, placeB) => {

            let { latitude, longitude } = (location || this.state.currentLocation || this.state.location);

            return (this.getDistance(placeA, { latitude, longitude }) - this.getDistance(placeB, { latitude, longitude }));
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
        let hotpoints = {};
        let { latitude, longitude } = (this.state.location || this.state.currentLocation);

        /**
        * Sort Places as an Array using keys
        */
        Object.keys(this.state.hotpoints).sort( (placeA, placeB) => (
            this.getDistance(hotpoints[placeA].location, { latitude, longitude }) - this.getDistance(hotpoints[placeB].location, { latitude, longitude })
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
                        return this.handleError(data.errors[0]);
                    else
                        return this.setState({ loading: false, done: true, errors: {} });
                },
                this.handleError
            ).catch(this.handleError);
        }
    }

    /**
    * fetchHotpoint
    */
    fetchHotpoint(callback) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            return this.props.fetchHotpoint({ ...this.state.order, location: this.state.location })
            .then( (data) => {

                if (!isEmpty(data) && !isEmpty(data.errors))
                    return this.handleError(data.errors[0]);
                else {

                    this.setState({ loading: false, done: true, errors: {} });

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
    fetchNearby(location) {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (this.state.locationsLoading !== undefined) {
                if (!this.state.locationsLoading) this.setState({ locationsLoading: true });
            } else {
                if (!this.state.loading) this.setState({ loading: true });
            }

            return this.props.fetchNearby(location).then(
                (data) => {

                    if (data.error_message)
                        return this.handleError({name: data.status, message: data.error_message})
                    else
                        return this.setState({ loading: false, done: true, errors: {} });
                },
                this.handleError
            ).catch(this.handleError);
        }
    }

    /**
    * Fetch Places by Key
    */
    fetchPlaces(key, handleLocations, handleError) {

        // Validation
        let errors = {};
        let errorHandler = (error) => {

            if (handleError)
                return handleError(error);
            else
                return this.handleError(error);
        };

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (this.state.locationsLoading !== undefined) {
                if (!this.state.locationsLoading) this.setState({ locationsLoading: true });
            } else {
                if (!this.state.loading) this.setState({ loading: true });
            }

            if (isEmpty(GooglePlaces)) {

                return this.props.fetchPlaces(key).then(
                    (data) => {

                        if (data.error_message) {

                            if (handleError)
                                return handleError({name: data.status, message: data.error_message});
                            else
                                return this.handleError({name: data.status, message: data.error_message});
                        } else
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
                    }, errorHandler
                ).catch(this.handleError);
            } else
                return (
                    GooglePlaces.getAutocompletePredictions(key)
                    .then( (places) => {
                        if (this.props.setPlaces(places)) return handleLocations(places);
                    }, errorHandler)
                    .catch(this.errorHandler)
                );
        }
    }

    /**
    * Handle Region Change on the Map
    */
    regionChanged(region) {

        if (this.state.mapReady && this.state.regionChanged > 0) this.handleLocation(region);

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

        return this.handleCurrentLocation(location);
    }

    /**
    * Get Approximate User location using GooglePlaces
    */
    getCurrentPlace() {
        return GooglePlaces.getCurrentPlace()
          .then(this.handleLocation, this.handleError)
          .catch(this.handleError);
    }

    /**
    * Get current User location using Geolocation
    */
    getCurrentLocation(callback) {

        /**
        * Handle the CurrentLocation
        */
        let handleCurrentLocation = (location) => {

            if (isEmpty(this.state.location)) return this.handleLocation(location.coords);
            else return;
        };

        /**
        * Set loading
        */
        if (!this.state.loading) this.setState({ loading: true });

        /**
        * Geolocation Options
        */
        let geoLocationOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

        /**
        * Find location
        */
        return navigator.geolocation.getCurrentPosition(handleCurrentLocation,
            (error) => {

                if (error.code == 2) {

                    this.setState({ turnOnLocationError: true });

                    return this.askToTurnOnLocation((result) => {
                        if (!result || result != Settings.ENABLED)
                            return this.getCurrentPlace(this.handleLocation, () => (this.handleError(error)) );
                        else return 1;
                    });
                } else if (error.code != 1 && error.code != 2) return this.handleError(error);
                else {

                    if (navigator.geolocation.requestAuthorization())
                        return navigator.geolocation.getCurrentPosition(handleCurrentLocation,
                            this.getCurrentPlace(this.handleLocation, this.handleError),
                            geolocationOptions
                        );
                    else
                        return this.getCurrentPlace(this.handleLocation, this.handleError);
                }
            },
            geoLocationOptions
        );
    }

    /**
    * getPlace
    */
    getPlace(location, handleLocation, handleError) {

        /**
        * Sort Places and get the first places
        */
        let place = this.sortPlaces(this.state.places, location)[0];

        /**
        * Pass Validated Place or Use Google API instead
        */
        if (!isEmpty(place)) return handleLocation(place);
        else
            return this.props.location(location).then(
                (data) => {

                    if (data.error_message)
                        return this.handleError({name: data.status, message: data.error_message});
                    else {

                        location.name = data.results[0].address_components[0].long_name;
                        location.address = data.results[0].formatted_address;

                        return handleLocation(location);
                    }
                },
                (error) => {

                    if (handleError) return handleError(error);
                    else return this.handleError(error);
                }
            ).catch(this.handleError);
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
            let handleLocations = (locations) => {

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
            let handleError = (error) => {

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
            if (isEmpty(this.state.places)) this.fetchNearby(this.state.location);

            /**
            * Convert the search key into lower case
            */
            let _key = key.toString().toLowerCase();

            /**
            * Filter through the available places to look for possible place
            */
            this.sortPlaces();
            let locations = this.state.places.filter( (location) => {
                return ((location.name.toLowerCase().search(_key) !== -1) || (product.address.toLowerCase().search(_key) !== -1));
            });

            if (!isEmpty(locations)) return handleLocations(locations);
            else return this.fetchPlaces(key, handleLocations, handleError);
        }
    }

    /**
    * Select a Location from the Searched List
    */
    selectLocation(location, locationInput) {

        let _location = {
            latitude: location.latitude || location.coordinate.latitude || location.geomentry.location.lat,
            longitude: location.longitude || location.coordinate.longitude || location.geomentry.location.lng,
            latitudeDelta: location.latitudeDelta || location.coordinate.latitudeDelta,
            longitudeDelta: location.longitudeDelta || location.coordinate.longitudeDelta,
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
            let orderLocation = (data, hotpoint) => {

                /**
                * Check for Errors
                */
                if (!isEmpty(data) && !isEmpty(data.errors)) this.handleError(data.errors[0]);

                /**
                * Set loading
                */
                if (!this.state.loading) this.setState({ loading: true });

                /**
                * Create a temporary location object
                */
                let location = { ...this.state.location, rate: this.state.rate };

                /**
                * Get the Location Address
                */
                if (!location.address && !isEmpty(data.origin_addresses))
                    location.address = data.origin_addresses[0];

                /**
                * Get the Distance Value
                */
                location.distance = (!isEmpty(data.rows))? data.rows[0].elements.distance.value / 1000 : this.getDistance(location, hotpoint.location);

                /**
                * Get the Duration Value
                */
                location._duration = (!isEmpty(data.rows))? data.rows[0].elements.duration.value / 3600 : location.distance / 50;
                location.duration = parseInt(Math.ceil(location._duration));

                /**
                * Format the Duration
                */
                let duration = durationFormat(location.duration);
                location.duration = duration.duration;
                location.durationUnits = duration.units;

                /**
                * Check and add details to the location
                */
                /**
                * Create an orderSummary Finishing function
                */
                let orderSummary = (location) => {
                    /**
                    * Update the State
                    */
                    this.setState({ location: location, loading: false, done: true, errors: {} });

                    /**
                    * Update Order and Move to the Next View
                    */
                    if (this.props.setOrderLocation(location)) {
                        /**
                        * Add Assigned Hotpoint to Order
                        */
                        if (this.props.setOrderHotpoint(hotpoint)) return Actions.orderSummary();
                    }

                };
                /**
                * Check and Get the Place, otherwise proceed to orderSummary
                */
                if (!location.name && !location.address)
                    this.getPlace(location, (_location) => {

                        location.name = location.name || _location.name;
                        location.address = location.address || _location.address;

                        return orderSummary(location);

                    }, (error) => ( orderSummary(location, { errors: [error] }) ) );
                else
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
                            this.props.fetchDistance({ origin: this.state.location, destination: hotpoint.location })
                            .then( (data) => ( orderLocation(data, hotpoint) ), errorHandler)
                            .catch(errorHandler)
                        );
                    }
                } )
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
              order={ this.props.order }
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
    fetchRate: PropTypes.func.isRequired,
    fetchNearby: PropTypes.func.isRequired,
    fetchPlaces: PropTypes.func.isRequired,
    fetchHotpoints: PropTypes.func.isRequired,
    fetchHotpoint: PropTypes.func.isRequired,
    fetchDistance: PropTypes.func.isRequired,
    setPlaces: PropTypes.func.isRequired,
    location: PropTypes.func.isRequired,
    setOrderLocation: PropTypes.func.isRequired
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
        rate: state.rate
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchRate: fetchRate,
        fetchNearby: fetchNearby,
        fetchPlaces: fetchPlaces,
        fetchHotpoints: fetchHotpoints,
        fetchHotpoint: fetchHotpoint,
        fetchDistance: fetchDistance,
        setPlaces: setPlaces,
        location: location,
        setOrderLocation: setOrderLocation,
        setOrderHotpoint: setOrderHotpoint
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Location);
