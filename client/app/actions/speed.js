import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setSpeed from './dispatches/setSpeed';

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
                        firebase.database().ref('delivery/speed')
                        .on('value', (speed) => {

                            resolve(speed.val());

                            return dispatch( setSpeed(speed.val()) );

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
