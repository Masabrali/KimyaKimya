import firebase from 'react-native-firebase';
// import fetch from './fetch';
import verifyUser from './dispatches/verifyUser';
import setUserPhone from './dispatches/setUserPhone';

/**
* Import Utilities
*/
import isEmpty from '../utilities/isEmpty';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function verify(user) {

    // return fetch('verify.php', user, verifyUser);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );

                    let _resolve = (_user) => {

                        resolve({ user: _user });

                        if ((user.action == 'phone' || user.action == 'edit'))
                            return dispatch( setUserPhone(_user) );
                        else
                            return dispatch( verifyUser(_user) );
                    };

                    let verifyPhoneNumber = (phoneAuthSnapshot) => {

                        let credential = firebase.auth.PhoneAuthProvider.credential(phoneAuthSnapshot.verificationId, user.verificationCode);

                        return (
                            ( (!isEmpty(firebase.auth().currentUser))? firebase.auth().currentUser.reauthenticateWithCredential(credential) : firebase.auth().signInWithCredential(credential) )
                            .then( (user) => ( _resolve(user) ) )
                            .catch(errorHandler)
                        );
                    };
                    
                    if (user.autoVerified) return _resolve({ ...user.user });
                    else {
                        if (!isEmpty(user.confirmResults))
                            return (
                                user.confirmResults.confirm(user.verificationCode).then(_resolve)
                                .catch(errorHandler)
                            );
                        else if (!isEmpty(user.phoneVerification)) {

                            if (!isEmpty(user.phoneAuthSnapshot))
                                return verifyPhoneNumber(user.phoneAuthSnapshot);
                            else
                                return (
                                    user.phoneVerification.then(verifyPhoneNumber)
                                    .catch(errorHandler)
                                );
                        }
                    }

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );

    } );
}
