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

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );
                    const path = 'client_orders/' + ( (order.draft)? 'drafts/' : 'previous/' ) + firebase.auth().currentUser.uid + '/';

                    firebase.database().ref(path)
                    .once('child_removed')
                    .then( (order) => {

                        let _order = {};
                        _order[order.key] = order.val();

                        resolve(_order);

                        return dispatch( deleteOrder(_order) );

                    }, errorHandler)
                    .catch(handleError);

                    return (
                        firebase.database().ref(path + order.key).remove()
                        .then( (order) => (
                            (!isEmpty(order))? resolve({ errors: [order] }) : order
                        ), errorHandler)
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
