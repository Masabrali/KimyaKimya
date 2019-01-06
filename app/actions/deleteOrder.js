import firebase from 'react-native-firebase';
// import fetch from './fetch';
import deleteOrder from './dispatches/deleteOrder';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(order) {

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

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let currentUser = firebase.auth().currentUser;

                    firebase.database().ref('orders/' + ( (order.draft)? 'drafts/' : 'previous/' ) + firebase.auth().currentUser.uid)
                    .once('child_removed')
                    .then( (order) => {

                        order = { key: order.key, ...order.val() };

                        resolve(order);

                        return dispatch( deleteOrder(order) );
                    } )
                    .catch(errorHandler);

                    return (
                        firebase.database().ref('orders/' + ( (order.draft)? 'drafts/' : 'previous/' ) + firebase.auth().currentUser.uid + '/' + order.key).remove()
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
