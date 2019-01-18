import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setUserPhone from './dispatches/setUserPhone';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function phone(user) {

    // return fetch('phone.php', user, setUserPhone);

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
