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

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let queuedDbRef = admin.database().ref('client_orders/queued/' + context.auth.uid);
                    let previousDbRef = admin.database().ref('client_orders/previous/' + context.auth.uid);

                    previousDbRef.once('child_added').then( (order) => {

                        let _order = {};
                        _order[order.key] = order.val();

                        return resolve(_order);
                    }, reject)
                    .catch(reject);

                    return (
                        queuedDbRef.child(order.key).remove()
                        .then( (_order) => {

                            if (_order) return resolve({ errors: [order] });
                            else {

                                let newPreviousDbRef = previousDbRef.push();

                                order.key = newPreviousDbRef.key;
                                order.id = newPreviousDbRef.key;
                                order.queued = false;
                                order.date = admin.database.ServerValue.TIMESTAMP;

                                return (
                                    newPreviousDbRef.set(order)
                                    .then( (_order) => ( (_order)? resolve({ errors: [order] }) : _order ), reject)
                                    .catch(reject)
                                );
                            }
                        }, reject)
                        .catch(reject)
                    );
                }

            } catch (error) {
                return reject(error);
            }
        } )
    );
};
