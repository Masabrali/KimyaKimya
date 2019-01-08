import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setHotpoints from './dispatches/setHotpoints';
import addHotpoint from './dispatches/addHotpoint';
import changeHotpoint from './dispatches/changeHotpoint';
import removeHotpoint from './dispatches/removeHotpoint';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(hotpoints) {

    // return fetch('hotpoints.php', location, setHotpoints);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let dbRef = firebase.database().ref('hotpoints');

                    dbRef.on('child_added', (hotpoint) => ( dispatch( addHotpoint({ key: hotpoint.key, ...hotpoint.val() }) ) ), errorHandler);

                    dbRef.on('child_changed', (hotpoint) => ( dispatch( changeHotpoint({ key: hotpoint.key, ...hotpoint.val() }) ) ), errorHandler);

                    dbRef.on('child_removed', (hotpoint) => ( dispatch( removeHotpoint({ key: hotopoint.key, ...hotpoint.val() }) ) ), errorHandler);

                    dbRef.once('value').then( (hotpoints) => {

                        resolve(hotpoints.val());

                        return dispatch( setHotpoints(hotpoints.val()) );

                    } )
                    .catch(errorHandler);

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );

    } );
}
