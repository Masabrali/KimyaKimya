import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setRate from './dispatches/setRate';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(rate) {

    // return fetch('rate.php', rate, setRate);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    return (
                        firebase.database().ref('delivery/rate')
                        .on('value', (rate) => {

                            resolve(rate.val());

                            return dispatch( setRate(rate.val()) );

                        }, (error) => ( resolve({ errors: [error] }) ))
                    );

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );

    } );
}
