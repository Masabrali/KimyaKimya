/**
* Import GOOGLE_API_KEY adderss
*/
import { GOOGLE_API_KEY } from '../config';

/**
* Import other
*/
import fetch from './fetch';
import setPlaces from './dispatches/setPlaces';

export default function(location) {
    return fetch(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + GOOGLE_API_KEY + '&location=' + location.latitude + ',' + location.longitude + '&radius=50000&rankby=distance',
        location,
        setPlaces,
        true
    );
}
