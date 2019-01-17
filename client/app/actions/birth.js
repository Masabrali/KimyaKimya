import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setUserBirth from './dispatches/setUserBirth';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function birth(user) {

    // return fetch('birth.php', user, setUserBirth);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );
                    const currentUser = firebase.auth().currentUser;
                    const userRef = firebase.database().ref('clients/' + currentUser.uid);

                    return (
                        userRef.once('value').then( (_user) => {

                            if (_user.exists()) userRef.update({ birth: user.birth });
                            else userRef.set({ birth: user.birth, gender: _user.gender });

                            return (
                                userRef.once('value').then( (_user) => {

                                    resolve(_user.val());

                                    return dispatch( setUserBirth(_user.val()) );

                                }, errorHandler)
                                .catch(handleError)
                            );
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
