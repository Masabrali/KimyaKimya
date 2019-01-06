/**
* Import GOOGLE_API_KEY adderss
*/
import { GOOGLE_API_KEY } from '../config';

/**
* Import other
*/
import fetch from './fetch';
import addPlace from './dispatches/addPlace';

export default function(location) {
    return fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?key=' + GOOGLE_API_KEY + '&latlng=' + location.latitude + ',' + location.longitude,
        location,
        addPlace,
        true
    );
}
