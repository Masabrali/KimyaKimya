import firebase from 'react-native-firebase';
// import fetch from './fetch';

/**
* Import Utiities
*/
import isEmpty from '../utilities/isEmpty';
import isAndroid from '../utilities/isAndroid';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(_invitation) {

    // return fetch('invite.php', friends);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    if (isEmpty(_invitation) || !_invitation.title || !_invitation.message || !_invitation.callToAction)
                        return resolve({ errors: [{message: "Invalid Invitation"}] });
                    else {

                        const errorHandler = (error) => ( resolve({ errors: [error] }) );
                        const dbRef = firebase.database().ref('invitations');
                        let invitations = {};
                        let _invitations = {};

                        // create invitation
                        const invitation = new firebase.invites.Invitation(_invitation.title, _invitation.message);
                        invitation.setCallToActionText(_invitation.callToAction);

                        if (_invitation.deepLink) invitation.setDeepLink(_invitation.deepLink);

                        if (_invitation.customImage) invitation.setCustomImage(_invitation.customImage);

                        if (_invitation.androidMinimumVersionCode) invitation.setAndroidMinimumVersionCode(_invitation.androidMinimumVersionCode);

                        if (_invitation.androidClientId) invitation.setAndroidClientId(_invitation.androidClientId);

                        if (_invitation.iosClientId) invitation.setIOSClientId(_invitation.iosClientId);

                        if (isAndroid()) {

                            if (_invitation.emailSubject) invitation.android.setEmailSubject(_invitation.emailSubject);

                            if (_invitation.emailHtmlContent) invitation.android.setEmailHtmlContent(_invitation.emailHtmlContent);

                            if (_invitation.additionalReferralParameters) invitation.android.setAdditionalReferralParameters(_invitation.additionalReferralParameters);

                            if (_invitation.googleAnalyticsTrackingId) invitation.android.setGoogleAnalyticsTrackingId(_invitation.googleAnalyticsTrackingId);
                        }

                        // send the invitation
                        return (
                            firebase.invites().sendInvitation(invitation)
                            .then( (invitationIDs) => {

                                dbRef.on('child_added', (invitation) => {

                                    _invitations[invitation.key] = invitation.val();

                                    if (invitation.key == invitationIDs[invitationIDs.length - 1]) {

                                        dbRef.off('child_added');

                                        return resolve(_invitations);

                                    } else return invitation;

                                }, errorHandler);

                                return (
                                    invitationIDs.map( (invitation) => (
                                        dbRef.child(invitation).set({
                                            sender: firebase.auth().currentUser.uid,
                                            date: firebase.database.ServerValue.TIMESTAMP
                                        })
                                        .then( (invitation) => (
                                            (!isEmpty(invitation))? resolve({ errors: [invitation] }) : invitation
                                        ), errorHandler)
                                        .catch(handleError)
                                    ) )
                                );

                            }, errorHandler)
                            .catch(handleError)
                        );
                    }

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );
    } );
}
