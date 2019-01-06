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

                    let errorHandler = (error) => ( resolve({ errors: [error] }) );
                    let dbRef = firebase.database().ref('products');

                    dbRef.on('child_added', (product) => ( dispatch( addProduct({ key: product.key, ...product.val() }) ) ), errorHandler);

                    dbRef.on('child_changed', (product) => ( dispatch( changeProduct({ key: product.key, ...product.val() }) ) ), errorHandler);

                    dbRef.on('child_removed', (product) => ( dispatch( removeProduct({ key: product.key, ...product.val() }) ) ), errorHandler);

                    if (!products.silent)
                        dbRef.once('value').then( (products) => {

                            resolve(products.val());

                            return dispatch( setProducts(products.val()) );

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
