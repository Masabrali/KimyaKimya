import firebase from 'react-native-firebase';
// import fetch from './fetch';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(friends) {

    // return fetch('invite.php', friends);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );

                    return (
                        firebase.functions().httpsCallable('invite')(friends)
                        .then( (invitations) => ( resolve(invitations.val()) ), errorHandler)
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
