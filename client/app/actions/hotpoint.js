import firebase from 'react-native-firebase';
// import fetch from './fetch';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(order) {

    // return fetch('hotpoint.php', order);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );

                    return (
                        firebase.functions().httpsCallable('hotpoint')(order)
                        .then( (hotpoint) => ( resolve(hotpoint.data) ), errorHandler)
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
