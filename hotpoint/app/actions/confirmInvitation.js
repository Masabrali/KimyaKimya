import firebase from 'react-native-firebase';
// import fetch from './fetch';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(invitation) {

    // return fetch('ConfirmInvitation.php', invitation);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    const errorHandler = (error) => ( resolve({ errors: [error] }) );
                    const dbRef = firebase.database().ref('invitations/' + invitation.invitationid + '/recepients/' + firebase.auth().currentUser.uid);

                    dbRef.once('value')
                    .then( (invitation) => ( resolve(invitation.val()) ), errorHandler)
                    .catch(handleError);

                    return (
                        dbRef.set(firebase.database.ServerValue.TIMESTAMP)
                        .then( (invitation) => (
                            (!isEmpty(invitation))? resolve({ errors: [invitation] }) : invitation
                        ), errorHandler)
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
