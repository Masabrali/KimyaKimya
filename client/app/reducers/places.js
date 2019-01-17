/**
* Import Libraries
*/
import firebase from 'react-native-firebase';

/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';

/**
* Define the reducer
*/
export default function (state = [], action = {}) {

    /**
    * Declare one global places array
    */
    let places = [];

    /**
    * Process the incomming places
    */
    const processPlaces = (places) => {

        /**
        * Format and return the incomming places
        */
        return ( places.map( (place) => {

            place = {
              id: place.placeID || (Math.random() * 1000000),
              name: place.name,
              address: place.address || place.formatted_address,
              latitude: place.latitude || place.geometry.location.lat,
              longitude: place.longitude || place.geometry.location.long
            };

            if (state.indexOf(place) == -1) return place;

        } ) );
    };

    switch(action.type) {

        case 'PLACES_FETCHED':

            return [ ...state, ...processPlaces(action.places.candidates || action.places.results || action.places) ];

        case 'ORDERS_FETCHED':

            if (!isEmpty(action.orders) && !isEmpty(action.orders.previous)) {

                const orders = action.orders.previous[firebase.auth().currentUser.uid];

                Object.keys(orders).map( (key) => ( places.push(orders[key].location) ) );
            }

            return [ ...state, ...processPlaces(places) ];

        case 'PLACE_FETCHED':

            return [ ...state, ...processPlaces([action.place]) ];

        default: return state;
    }
}
