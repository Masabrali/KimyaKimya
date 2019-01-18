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

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );
                    const currentUser = firebase.auth().currentUser;

                    return (
                        firebase.database().ref('clients/' + currentUser.uid).once('value')
                        .then( (user) => {

                            let _user = {
                                countryCode: currentUser.phoneNumber.substr(0, 4),
                                phone: currentUser.phoneNumber.substr(4),
                                ...user.val()
                            };

                            resolve(_user);

                            return dispatch( setUser(_user) );

                        }, errorHandler)
                        .catch(handleError)
                    );
                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );
    } );
}
