import degToRad from './degToRad';

export default function getDistance(placeA, placeB) {

    // Radius of the earth in km
    const Radius = 6378.137;

    // Get Latitudinal and Longitudinal Distance in Radians
    const latDistance = degToRad(placeB.latitude - placeA.latitude);
    const lngDistance = degToRad(placeB.longitude - placeA.longitude);

    // Calculate Mathematical Hypotenal Distance Squared
    const hypDistance = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) + Math.cos(degToRad(placeA.latitude)) * Math.cos(degToRad(placeB.latitude)) * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);

    // Return Distance in meters
    return ( Radius * 2 * Math.atan2(Math.sqrt(hypDistance), Math.sqrt(1 - hypDistance)) );
}
