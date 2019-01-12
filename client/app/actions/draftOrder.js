import firebase from 'react-native-firebase';
// import fetch from './fetch';
import draftOrder from './dispatches/draftOrder';

/**
* Import Utilities
*/
import isEmpty from '../utilities/isEmpty';

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
                    let dbRef = firebase.database().ref('orders/drafts/' + firebase.auth().currentUser.uid);

                    dbRef.once('child_added')
                    .then( (order) => {

                        let _order = {};
                        _order[order.key] = order.val();

                        resolve(_order);

                        return dispatch( draftOrder(_order) );

                    }, errorHandler)
                    .catch(errorHandler);


                    dbRef = dbRef.push();

                    order.key = order.key || dbRef.key;
                    order.id = order.id || dbRef.key;
                    order.date = firebase.database.ServerValue.TIMESTAMP;
                    order.draft = true;

                    return (
                        dbRef.set(order)
                        .then( (order) => (
                            (!isEmpty(order))? resolve({ errors: [order] }) : order
                        ), errorHandler)
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
