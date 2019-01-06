import firebase from 'react-native-firebase';
// import fetch from './fetch';
import confirmOrderDelivery from './dispatches/confirmOrderDelivery';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(order) {

    // return fetch('delivery.php', order, confirmOrderDelivery);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let currentUser = firebase.auth().currentUser;

                    firebase.database().ref('orders/queued/' + currentUser.uid)
                    .once('child_removed')
                    .then( (order) => {

                        let dbRef = firebase.database.ref('orders/previous/' + currentUser.uid).push();

                        order.id = order.id || dbRef.key;
                        order.date = firebase.database.ServerValue.TIMESTAMP;

                        dbRef.set(order)
                        .then( (order) => ( order ) )
                        .catch(errorHandler);

                        return (
                            dbRef.once('value')
                            .then( (order) => {

                                order = { key: order.key, ...order.val() };

                                resolve(order);

                                return dispatch( confirmOrderDelivery(order) );
                            } )
                            .catch(errorHandler)
                        );
                    } )
                    .catch(errorHandler);

                    return (
                        firebase.database().ref('orders/queued/' + currentUser.uid + '/' + order.key).remove()
                        .then( (order) => ( order ) )
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
