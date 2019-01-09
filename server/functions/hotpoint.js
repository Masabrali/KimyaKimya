// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

/**
* Degree to Radient
*/
function degToRad(deg) {
  return deg * (Math.PI/180);
}

/**
* Distance Between two places
*/
function getDistance(placeA, placeB) {

    // Radius of the earth in km
    let Radius = 6371;

    // Get Latitudinal and Longitudinal Distance in Radians
    let latDistance = degToRad(placeB.latitude - placeA.latitude);
    let lngDistance = degToRad(placeB.longitude - placeA.longitude);

    // Calculate Mathematical Hypotenal Distance Squared
    let hypDistance = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) + Math.cos(degToRad(placeA.latitude)) * Math.cos(degToRad(placeB.latitude)) * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);

    // Return Distance in meters
    return (Radius * 2 * Math.atan2(Math.sqrt(hypDistance), Math.sqrt(1 - hypDistance)));
}

/**
* Fetch for the most suitable and nearest hotpoint
*/
exports.hotpoint = (order) => {

    return (
        new Promise( (resolve, reject) => {

            try {

                let _hotpoints = {};

                return (
                    admin.database().ref('hotpoints').once('value')
                    .then( (hotpoints) => {

                        Object.keys(hotpoints.val()).sort( (placeA, placeB) => (
                            getDistance(hotpoints[placeA].location, { latitude, longitude }) - getDistance(hotpoints[placeB].location, { latitude, longitude })
                        ) ).map( (key) => ( _hotponts[key] = hotpoints[key] ) );

                        return resolve(_hotpoints);
                    } )
                    .catch( (error) => ( resolve({ errors: [error] }) ) )
                );

            } catch (error) {

                return reject(error);
            }
        } )
    );
};
