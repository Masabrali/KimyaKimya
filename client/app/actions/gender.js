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

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );
                    const currentUser = firebase.auth().currentUser;
                    const userRef = firebase.database().ref('clients/' + currentUser.uid);

                    return (
                        userRef.once('value').then( (_user) => {

                            if (_user.exists()) userRef.update({ gender: user.gender });
                            else userRef.set({ gender: user.gender, birth: _user.birth });

                            return (
                                userRef.once('value').then( (_user) => {

                                    resolve(_user.val());

                                    return dispatch( setUserGender(_user.val()) );

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
