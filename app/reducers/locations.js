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
    let processPlaces = (places) => {

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

        case 'ORDERS_FETCHED':

            Object.keys(actions.orders.previous).map( (order) => ( places.push(order.location) ) );

            return processPlaces(places);

        default: return state;
    }
}
