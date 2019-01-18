import firebase from 'react-native-firebase';
// import fetch from './fetch';
import setLinks from './dispatches/setLinks';
import setLink from './dispatches/setLink';

/**
* Import Error handler
*/
import handleError from './handleError';

export default function links(links) {

    // return fetch('products.php', products, setProducts);

    return ( (dispatch) => {

        return (
            new Promise( (resolve, reject) => {

                try {

                    const errorHandler= (error) => ( resolve({ errors: [error] }) );
                    const dbRef = firebase.database().ref('links');

                    dbRef.on('child_changed', (link) => ( dispatch( setLink({ key: link.key, link: link.val() }) ) ), errorHandler);

                    if (!links.silent)
                        dbRef.once('value').then( (links) => {

                            resolve(links.val());

                            return dispatch( setLinks(links.val()) );

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
