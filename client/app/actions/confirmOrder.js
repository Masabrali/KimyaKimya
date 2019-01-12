import firebase from 'react-native-firebase';
// import fetch from './fetch';
import confirmOrder from './dispatches/confirmOrder';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(order) {

    // return fetch('delivery.php', order, confirmOrder);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );

                    return (
                        firebase.functions().httpsCallable('confirmOrder')(order)
                        .then( (order) => {
                            
                            resolve(order.data)

                            return dispatch( confirmOrder(order.data) );

                        }, errorHandler)
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
