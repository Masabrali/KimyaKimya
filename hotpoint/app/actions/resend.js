import firebase from 'react-native-firebase';
// import fetch from './fetch';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(user) {

    // return fetch('resend.php', user);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    return (
                        resolve({
                            user: user,
                            phoneVerification: firebase.auth().verifyPhoneNumber(user.countryCode + user.phone)
                        })
                    );

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );
    } );
}
