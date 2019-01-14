import firebase from 'react-native-firebase';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function logScreen(screenName, className) {

    return dispatch => {
        return firebase.analytics().setCurrentScreen(screenName, className);
        // return firebase.analytics().logEvent(`Page_${action.routeName}`, {});
    };
}
