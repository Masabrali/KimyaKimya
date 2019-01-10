// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

/**
* Order Confirmation
*/
exports.confirmOrder = (order, context) => {

    return (
        new Promise( (resolve, reject) => {

            try {

                if (!order || !order.location || !order.hotpoint || !order.products)
                    return resolve({ errors: [{ message: 'Invalid Order' }] });
                else {

                    console.log('confirmOrder')
                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let dbRef;

                    admin.database().ref('orders/queued/' + context.auth.uid)
                    .once('child_removed')
                    .then( (order) => {
                        console.log('child removed')
                        dbRef = firebase.database.ref('orders/previous/' + context.auth.uid).push();

                        order.date = firebase.database.ServerValue.TIMESTAMP;

                        dbRef.set(order)
                        .then( (order) => ( order ), errorHandler)
                        .catch(errorHandler);

                        return (
                            dbRef.once('value')
                            .then( (order) => {
                                console.log('child added')
                                let _order = {};
                                _order[order.key] = order.val();

                                return resolve(_order);

                            }, reject)
                            .catch(reject)
                        );

                    }, reject)
                    .catch(reject);
                    console.log('removing child')
                    // return (
                        admin.database().ref('orders/queued/' + context.auth.uid + '/' + order.key).remove()
                        .then( (order) => ( order ), reject)
                        .catch(reject)
                    // );
                }

            } catch (error) {
                return reject(error);
            }
        } )
    );
};
