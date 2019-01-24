/** @format */

import { AppRegistry } from 'react-native';
import firebase from 'react-native-firebase';
import App from './app/App';
import { name as appName } from './app.json';

try {

    AppRegistry.registerComponent(appName, () => (App));

} catch (error) {

    error = new Error(error);

    firebase.crashlytics().recordError(error.type || error.code, error.message || error);

    throw error;
}
