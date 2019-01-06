import firebase from 'react-native-firebase';
// import fetch from './fetch';
import draftOrder from './dispatches/draftOrder';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(order) {

    // return dispatch => {
    //     return dispatch( draftOrder(order) );
    // };

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );

                    let dbRef = firebase.database().ref('orders/drafts/' + firebase.auth().currentUser.uid).push();

                    order.id = order.id || dbRef.key;
                    order.date = firebase.database.ServerValue.TIMESTAMP;
                    order.draft = true;

                    dbRef.set(order)
                    .then( (order) => ( order ) )
                    .catch(errorHandler)

                    return (
                        dbRef.once('value')
                        .then( (order) => {

                            // order = { key: order.key, ...order.val() };
                            order = {}[order.key] = order.val();

                            resolve(order);

                            return dispatch( draftOrder(order) );
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
