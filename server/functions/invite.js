// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

/**
* Update Delivery Rate based on Changes in Fuel Prices
*/
exports.invite = (request, response) => {

    let friends = request.body.friends;

    return response.status(200).send(JSON.stringify({ invitations: friends.length }));
};
