import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setFCMToken from './dispatches/setFCMToken';

/**
* Import Utilities
*/
import isEmpty from '../utilities/isEmpty';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(token) {

    // return dispatch => {
    //     return dispatch( setFCMToken(token) );
    // };

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    const errorHandler = (error) => ( resolve({ errors: [error] }) );
                    const dbRef = firebase.database().ref('fcm_tokens/' + firebase.auth().currentUser.uid);

                    const _resolve = (token) => {

                        dispatch( setFCMToken(token) )

                        return resolve(token);
                    };

                    const publishFCMToken = (token) => {

                        dbRef.once('value')
                        .then( (token) => ( _resolve(token.val()) ), errorHandler)
                        .catch(handleError);

                        return (
                            dbRef.set(token)
                            .then( (token) => (
                                (!isEmpty(token))? resolve({ errors: [token] }) : token
                            ), errorHandler)
                            .catch(handleError)
                        );
                    };

                    firebase.messaging().getToken()
                    .then(publishFCMToken, errorHandler)
                    .catch(handleError);

                    return firebase.messaging().onTokenRefresh(publishFCMToken);

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );
    } );
}
