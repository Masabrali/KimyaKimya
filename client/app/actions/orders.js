import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setOrders from './dispatches/setOrders';
import addOrder from './dispatches/addOrder';
import changeOrder from './dispatches/changeOrder';
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

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );
                    const currentUser = firebase.auth().currentUser;
                    const dbRef = firebase.database().ref('client_orders/');
                    let _order;

                    dbRef.on('child_added', (order) => (
                        dispatch( addOrder(order.val()[currentUser.uid]) )
                    ), errorHandler);

                    dbRef.on('child_changed', (order) => (
                        dispatch( changeOrder(order.val()[currentUser.uid]) )
                    ), errorHandler);

                    dbRef.on('child_removed', (order) => (
                        dispatch( deleteOrder(order.val()[currentUser.uid]) )
                    ), errorHandler);

                    if (!orders.silent)
                        dbRef.once('value').then( (orders) => {

                            resolve(orders.val());

                            return dispatch( setOrders(orders.val()) );

                        }, errorHandler)
                        .catch(handleError);

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );
    } );
}
