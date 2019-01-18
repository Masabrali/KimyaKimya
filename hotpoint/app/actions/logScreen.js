import firebase from 'react-native-firebase';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function logScreen(screenName, className, params) {

    return dispatch => {
        return {
            currentScreen: firebase.analytics().setCurrentScreen(screenName, className),
            loggedEvent: firebase.analytics().logEvent('Screen_' + className, params)
        };
    };
}
