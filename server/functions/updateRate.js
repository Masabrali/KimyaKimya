// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

/**
* Update Delivery Rate based on Changes in Fuel Prices
*/
exports.updateRateWithFuel = (fuel, context) => {

    try {

        let errorHandler = (error) => ( console.log(error) );

        if (context.authType === 'ADMIN')
            return (
                admin.database().ref('delivery/maintenance').once('value')
                .then( (maintenance) => (
                    admin.database().ref('delivery/rate').set( (((fuel.after.val() / 30) * 2) + ((maintenance.val() / 200) * 2)) * 2 )
                ) )
                .catch(errorHandler)
            );
        else
            return (
                admin.database().ref('delivery/rate').once('value')
                .then( (rate) => ( rate.val() ) )
                .catch(errorHandler)
            );

    } catch (error) {
        return console.log(error);
    }
};

/**
* Update Delivery Rate based on Changes in Maintenace Prices
*/
exports.updateRateWithMaintenance = (maintenance, context) => {

    try {

        let errorHandler = (error) => ( console.log(error) );

        if (context.authType === 'ADMIN')
            return (
                admin.database().ref('delivery/fuel').once('value')
                .then( (fuel) => (
                    admin.database().ref('delivery/rate').set( (((fuel.val() / 30) * 2) + ((maintenance.after.val() / 200) * 2)) * 2 )
                ) )
                .catch( (error) => ( console.log(error) ) )
            );
        else
            return (
                admin.database().ref('delivery/rate').once('value')
                .then( (rate) => ( rate.val() ) )
                .catch(errorHandler)
            );

    } catch (error) {
        return console.log(error);
    }
};

/**
* Update Delivery Rate based on Changes in the Delivery Rate Field
*/
exports.updateRateWithRate = (rate, context) => {

    try {

        let errorHandler = (error) => ( console.log(error) );

        if (context.authType === 'ADMIN')
            return (
                admin.database().ref('delivery/fuel').once('value')
                .then( (fuel) => (
                    admin.database().ref('delivery/maintenance').once('value')
                    .then( (maintenance) => (
                        admin.database().ref('delivery/rate').set( (((fuel.val() / 30) * 2) + ((maintenance.val() / 200) * 2)) * 2 )
                    ) )
                ) )
                .catch( (error) => ( console.log(error) ) )
            );
        else
            return (
                admin.database().ref('delivery/rate').once('value')
                .then( (rate) => ( rate.val() ) )
                .catch(errorHandler)
            );

    } catch (error) {
        return console.log(error);
    }
};
