import firebase from 'react-native-firebase';
// import fetch from './fetch';

/**
* Import Utilities
*/
import isEmpty from '../utilities/isEmpty';
import guid from '../utilities/guid';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(message) {

    // let form = new FormData();
    // form.append("message", message.message);
    // form.append("screenshot", message.screenshot);
    //
    // return fetch('contactUs.php', undefined, undefined, undefined, 'PUT', form, 'multipart/form-data');

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let dbRef = firebase.database().ref('contact_us');
                    let _message = {
                        message: message.message,
                        user: firebase.auth().currentUser.uid,
                        read: false
                    };

                    let _contactUs = (screenshot) => {

                        dbRef.once('child_added')
                        .then( (data) => {

                            let _data = {};
                            _data[data.key] = data.val();

                            return resolve(_data);

                        }, errorHandler)
                        .catch(errorHandler);

                        if (!isEmpty(screenshot)) _message.screenshot = screenshot.ref;

                        return (
                            dbRef.push(_message)
                            .then( (data) => ( data ), errorHandler)
                            .catch(errorHandler)
                        );
                    };

                    if (isEmpty(message.screenshot)) return _contactUs();
                    else
                        return (
                            firebase.storage().ref('screenshots/' + guid())
                            .putFile(message.screenshot.uri)
                            .then( _contactUs, errorHandler)
                            .catch(errorHandler)
                        );

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );

    } );
}
