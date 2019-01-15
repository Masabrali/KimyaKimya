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

                    // return (
                    //     firebase.functions().httpsCallable('invite')(friends)
                    //     .then( (invitations) => ( resolve(invitations.val()) ), errorHandler)
                    //     .catch(errorHandler)
                    // );

                    // create invitation
                    const invitation = new firebase.invites.Invitation('KimyaKimya Invitation', 'Download and Try KimyaKimya for Great, Healthy and Enjoyable experiences tailored for your.');
                    // invitation.setDeepLink('https://je786.page.link/testing');
                    // invitation.setCustomImage(customImage);
                    invitation.setCallToActionText('Experience It Firsthand');
                    // invitation.setAndroidMinimumVersionCode(androidMinimumVersionCode);
                    // invitation.setAndroidClientId(androidClientId);
                    // invitation.setIOSClientId(iosClientId);

                    // send the invitation
                    return (
                        firebase.invites().sendInvitation(invitation)
                        .then( (invitation) => ( resolve(invitation) ), errorHandler)
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
