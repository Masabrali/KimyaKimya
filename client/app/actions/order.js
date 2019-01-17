import firebase from 'react-native-firebase';
// import fetch from './fetch';
import submitOrder from './dispatches/submitOrder';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(order) {

    // return fetch('order.php', order, submitOrder);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );

                    return (
                        firebase.functions().httpsCallable('order')(order)
                        .then( (order) => {

                            resolve(order.data)

                            return dispatch( submitOrder(order.data) );

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
