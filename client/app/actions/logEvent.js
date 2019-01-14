import firebase from 'react-native-firebase';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function logEvent(eventName, params) {

    return dispatch => {
        return firebase.analytics().logEvent(eventName, params);
    };
}
