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

                    return (
                        firebase.functions().httpsCallable('invite')({ friends: friends })
                        .then( (invitations) => ( resolve(invitations.val()) ) )
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
