// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

/**
* Order Submission
*/
exports.order = (order, context) => {

    return (
        new Promise( (resolve, reject) => {

            try {

                if (!order || !order.location || !order.hotpoint || !order.products)
                    return resolve({ errors: [{ message: 'Invalid Order' }] });
                else {

                    let dbRef = admin.database().ref('orders/queued/' + context.auth.uid);
                    // let hotpointDbRef = admin.database().ref('')

                    dbRef.once('child_added')
                    .then( (order) => {

                        let _order = {};
                        _order[order.key] = order.val();

                        return resolve(_order);

                    }, reject)
                    .catch(reject);


                    dbRef = dbRef.push();

                    order.key = dbRef.key;
                    order.id = dbRef.key;
                    order.orderID = dbRef.key;
                    order.client = context.auth.uid;
                    order.queued = true;
                    order.queuedDate = admin.database.ServerValue.TIMESTAMP;
                    order.date = admin.database.ServerValue.TIMESTAMP;

                    return (
                        dbRef.set(order)
                        .then(resolve, reject)
                        .catch(reject)
                    );
                }

            } catch (error) {
                return reject(error);
            }
        } )
    );
};
