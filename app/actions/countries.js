import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setCountries from './dispatches/setCountries';
/**
* Import Error handler
*/
import handleError from './handleError';

export default function() {

    // return fetch('countries.php', {}, setCountries);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    return (
                        firebase.database().ref('countries').once('value')
                        .then( (countries) => {

                            resolve(countries.val());

                            return dispatch( setCountries(countries.val()) );
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
