// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/**
* Update Rate with Changes in Fuel and Maintenance
*/
const updateRateModules = require('./updateRate');
exports.updateRateWithFuel = functions.database.ref('delivery/fuel').onWrite(updateRateModules.updateRateWithFuel);
exports.updateRateWithMaintenance = functions.database.ref('delivery/maintenance').onWrite(updateRateModules.updateRateWithMaintenance);
exports.updateRateWithRate = functions.database.ref('rate').onWrite(updateRateModules.updateRateWithRate);

/**
* Invite Friends
*/
const inviteModules = require('./invite');
exports.invite = functions.https.onCall(inviteModules.invite);

/**
* Get Hotpoint
*/
const hotpointModules = require('./hotpoint');
exports.hotpoint = functions.https.onCall(hotpointModules.hotpoint);

/**
* Submit Order
*/
const orderModules = require('./order');
exports.order = functions.https.onCall(orderModules.order);

/**
* Confirm Order
*/
const confirmOrderModules = require('./confirmOrder');
exports.confirmOrder = functions.https.onCall(confirmOrderModules.confirmOrder);
