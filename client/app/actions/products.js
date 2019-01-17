import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setProducts from './dispatches/setProducts';
import addProduct from './dispatches/addProduct';
import changeProduct from './dispatches/changeProduct';
import removeProduct from './dispatches/removeProduct';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function products(products) {

    // return fetch('products.php', products, setProducts);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );
                    const dbRef = firebase.database().ref('products');

                    dbRef.on('child_added', (product) => (
                        dispatch( addProduct(product.val()) )
                    ), errorHandler);

                    dbRef.on('child_changed', (product) => (
                        dispatch( changeProduct(product.val()) )
                    ), errorHandler);

                    dbRef.on('child_removed', (product) => (
                        dispatch( removeProduct(product.val()) )
                    ), errorHandler);

                    if (!products.silent)
                        dbRef.once('value').then( (products) => {

                            resolve(products.val());

                            return dispatch( setProducts(products.val()) );

                        }, errorHandler)
                        .catch(handleError);

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );
    } );
}
