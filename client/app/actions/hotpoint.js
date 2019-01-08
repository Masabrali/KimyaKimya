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

                    return (
                        firebase.functions().httpsCallable('hotpoint')({ order: order })
                        .then( (hotpoint) => ( resolve(hotpoint.val()) ) )
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
