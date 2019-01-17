import firebase from 'react-native-firebase';
// import fetch from './fetch';
import deleteOrder from './dispatches/deleteOrder';

/**
* Import Utilities
*/
import isEmpty from '../utilities/isEmpty';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(orders, segment) {

    // if (order.draft)
    //     return dispatch => {
    //         return dispatch( deleteOrder(order) );
    //     };
    // else
    //     return fetch('deleteOrder.php', order, deleteOrder);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );
                    const path = 'client_orders/' + segment + '/' + firebase.auth().currentUser.uid + '/';

                    const keys = Object.keys(orders);
                    let _order;

                    firebase.database().ref(path).on('child_removed', (order) => {

                        _order = {};
                        _order[order.key] = order.val();

                        if (!isEmpty(_order[keys[keys.length - 1]]))
                            firebase.database().ref(path).off('child_removed')

                        resolve(_order);

                        return dispatch( deleteOrder(_order) );

                    }, (error) => ( resolve({ errors: [error] }) ));

                    return ( async () => {

                        for (var i = 0; i < keys.length; ++i) {

                            order = await firebase.database().ref(path + keys[i]).remove();

                            if (!isEmpty(order)) return resolve({ errors: [order] });
                        }
                    } )();

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );
    } );
}
