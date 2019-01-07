import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setOrders from './dispatches/setOrders';
import draftOrder from './dispatches/draftOrder';
import submitOrder from './dispatches/submitOrder';
import confirmOrderDelivery from './dispatches/confirmOrderDelivery';
import deleteOrder from './dispatches/deleteOrder';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(orders) {

    // return fetch('orders.php', orders, setOrders);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let currentUser = firebase.auth().currentUser;
                    let dbRef = firebase.database().ref('orders');
                    let _order;

                    dbRef.on('child_added', (order) => {

                        if (order.key == "drafts")
                            return dispatch( draftOrder(order.val()[currentUser.uid]) );
                        else if (order.key == "queued")
                            return dispatch( submitOrder(order.val()[currentUser.uid]) );
                        else if (order.key == "previous")
                            return dispatch( confirmOrderDelivery(order.val()[currentUser.uid]) );

                    }, errorHandler);

                    dbRef.on('child_changed', (order) => {

                        if (order.key == "queued")
                            return dispatch( deleteOrder(order.val()[currentUser.uid]) );

                    }, errorHandler);

                    dbRef.on('child_removed', (order) => {

                        if (order.key == "drafts" || order.key == "previous")
                            return dispatch( deleteOrder(order.val()[currentUser.uid]) );

                    }, errorHandler);

                    if (!orders.silent)
                        dbRef.once('value').then( (orders) => {

                            resolve(orders.val());

                            return dispatch( setOrders(orders.val()) );

                        } )
                        .catch(errorHandler);

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );

    } );
}
