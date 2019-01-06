import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setUserGender from './dispatches/setUserGender';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function gender(user) {

    // return fetch('gender.php', user, setUserGender);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let currentUser = firebase.auth().currentUser;

                    let userRef = firebase.database().ref('users/' + currentUser.uid);

                    return (
                        userRef.once('value').then( (_user) => {

                            if (_user.exists()) userRef.update({ gender: user.gender });
                            else userRef.set({ gender: user.gender, birth: _user.birth });

                            return (
                                userRef.once('value').then( (_user) => {

                                    resolve(_user.val());

                                    return dispatch( setUserGender(_user.val()) );
                                } )
                                .catch( (error) => ( resolve({ errors: [error] }) ) )
                            );
                        } )
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