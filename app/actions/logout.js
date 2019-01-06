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

                  return (
                      firebase.auth().signOut().then( () => {

                          resolve(user);

                          return dispatch( logoutUser(user) );
                      } )
                      .catch( (error) => ( resolve({ errors: [error] }) ) )
                  );

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );

    } );
}
