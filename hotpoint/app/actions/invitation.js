import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setInvitation from './dispatches/setInvitation';
import updateInvitation from './dispatches/updateInvitation';
import changeInvitation from './dispatches/changeInvitation';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function invitation(invitation) {

    // return fetch('products.php', products, setProducts);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    const errorHandler = (error) => ( resolve({ errors: [error] }) );
                    const dbRef = firebase.database().ref('invitation');

                    dbRef.on('child_added', (invitation) => ( dispatch( updateInvitation({ key: invitation.key, value: invitation.val() }) ) ), errorHandler);

                    dbRef.on('child_changed', (invitation) => ( dispatch( updateInvitation({ key: invitation.key, value: invitation.val() }) ) ), errorHandler);

                    dbRef.on('child_removed', (invitation) => ( dispatch( changeInvitation({ key: invitation.key, value: invitation.val() }) ) ), errorHandler);

                    dbRef.once('value').then( (invitation) => {

                        resolve(invitation.val());

                        return dispatch( setInvitation(invitation.val()) );

                    }, errorHandler)
                    .catch(handleError);

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );
    } );
}
