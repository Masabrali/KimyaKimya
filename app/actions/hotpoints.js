import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setHotpoints from './dispatches/setHotpoints';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function(location) {

    // return fetch('hotpoints.php', location, setHotpoints);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let dbRef = firebase.database().ref('hotpoints');

                    // if (!products.silent)
                    //     dbRef.once('value').then( (products) => {
                    //
                    //         resolve(products.val());
                    //
                    //         return dispatch( setProducts(products.val()) );
                    //
                    //     } )
                    //     .catch(errorHandler);
                    //
                    // dbRef.on('child_added', (product) => ( dispatch( addProduct({ key: product.key, ...product.val() }) ) ), errorHandler);
                    //
                    // dbRef.on('child_changed', (product) => ( dispatch( changeProduct({ key: product.key, ...product.val() }) ) ), errorHandler);
                    //
                    // dbRef.on('child_removed', (product) => ( dispatch( removeProduct({ key: product.key, ...product.val() }) ) ), errorHandler);

                    // return (
                    //     firebase.functions().ref('hotpoints').once('value')
                    //     .then( (hotpoints) => {
                    //
                    //         resolve(hotpoints.val());
                    //
                    //         return dispatch( setOrders(orders.val()) );
                    //     } )
                    //     .catch( (error) => ( resolve({ errors: [error] }) ) )
                    // );

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );

    } );
}
