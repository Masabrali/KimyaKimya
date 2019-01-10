import firebase from 'react-native-firebase';
// import fetch from './fetch';
import loginUser from './dispatches/loginUser';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function login(user) {

    // return fetch('login.php', user, loginUser);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );

                    return (
                        firebase.auth().signInWithPhoneNumber(user.countryCode + user.phone)
                        .then( (confirmResults) => {

                            resolve({ user: user, confirmResults: confirmResults});

                            return dispatch( loginUser(user) );

                        }, errorHandler)
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
