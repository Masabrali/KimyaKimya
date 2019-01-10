import firebase from 'react-native-firebase';
// import fetch from './fetch';
import logoutUser from './dispatches/logoutUser';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function logout(user) {

    // return fetch('logout.php', user, logoutUser);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                  let errorHandler = (error) => ( resolve({ errors: [error] }) );

                  return (
                      firebase.auth().signOut().then( () => {

                          resolve(user);

                          return dispatch( logoutUser(user) );

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
