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

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );

                    let dbRef = firebase.database().ref('orders/queued/' + firebase.auth().currentUser.uid).push();

                    order.id = order.id || dbRef.key;
                    order.orderID = dbRef.key;
                    order.queued = true;
                    order.queueDate = firebase.database.ServerValue.TIMESTAMP;
                    order.date = firebase.database.ServerValue.TIMESTAMP;

                    dbRef.set(order)
                    .then( (order) => ( order ) )
                    .catch(errorHandler);

                    return (
                        dbRef.once('value')
                        .then( (order) => {

                            order = { key: order.key, ...order.val() };

                            resolve(order);

                            return dispatch( submitOrder(order) );
                        } )
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
