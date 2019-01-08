/**
* Import GOOGLE_API_KEY adderss
*/
import { GOOGLE_API_KEY } from '../config';

/**
* Import other
*/
import fetch from './fetch';

export default function(locations) {
    return fetch(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + GOOGLE_API_KEY + '&origins=' + locations.origin.latitude + ',' + locations.origin.longitude + '&destinations=' + locations.destination.latitude + ',' + locations.destination.longitude,
        locations,
        undefined,
        true
    );
}
