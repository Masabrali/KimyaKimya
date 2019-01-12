import firebase from 'react-native-firebase';
import setOrder from './dispatches/setOrder';

/**
* Import Error handler
*/
import handleError from './handleError';

/**
* Import Utilities
*/
import isEmpty from '../utilities/isEmpty';

export default function(order, products) {

    /**
    * Update products in order
    */
    order.products.map( (product, index) => (
        Object.keys(products).map( (segment) => {
            order.products[index] = products[segment].find( (_product) => ( _product.id == product.id ) ) || product;
        } )
    ) );

    /**
    * Dispatch action
    */
    return ( dispatch => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    if (order.draft) {

                        let errorHandler = (error) => ( resolve({ errors: [error] }) );
                        let currentUser = firebase.auth().currentUser;

                        firebase.database().ref('orders/drafts/' + currentUser.uid)
                        .once('child_removed')
                        .then( (order) => {

                            order = { key: order.key, ...order.val() };

                            resolve(order);

                            return dispatch( setOrder(order) );
                        }, errorHandler)
                        .catch(errorHandler);

                        return (
                            firebase.database().ref('orders/drafts/' + currentUser.uid + '/' + order.key).remove()
                            .then( (order) => (
                                (!isEmpty(order))? resolve({ errors: [order] }) : order
                            ), errorHandler)
                            .catch(errorHandler)
                        );

                    } else
                        return dispatch( setOrder(order) );

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }
            } )
        );

    } );
}
