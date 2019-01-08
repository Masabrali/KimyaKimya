import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setUser from './dispatches/setUser';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function user() {

    // return fetch('user.php', user, setUser);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let currentUser = firebase.auth().currentUser;

                    return (
                        firebase.database().ref('users/' + currentUser.uid).once('value')
                        .then( (user) => {

                            let _user = {
                                countryCode: currentUser.phoneNumber.substr(0, 4),
                                phone: currentUser.phoneNumber.substr(4),
                                ...user.val()
                            };

                            resolve(_user);

                            return dispatch( setUser(_user) );
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
