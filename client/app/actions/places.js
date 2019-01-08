/**
* Import GOOGLE_API_KEY adderss
*/
import { GOOGLE_API_KEY } from '../config';

/**
* Import other
*/
import fetch from './fetch';
import setPlaces from './dispatches/setPlaces';

export default function(key) {
    return fetch(
        'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + GOOGLE_API_KEY + '&input=' + key,
        key,
        setPlaces,
        true
    );
}
