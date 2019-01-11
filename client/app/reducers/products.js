/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';
import isArray from './../utilities/isArray';

/**
* Define the reducer
*/
export default function (state = {}, action = {}) {

    let category;

    switch(action.type) {

        case 'PRODUCTS_FETCHED':

            return {
                condoms: action.products.condoms,
                pills: action.products.pills,
                emergency: action.products.emergency
            };

        case 'PRODUCT_ADDED':

            Object.keys(action.product).map( (key) => (
                state[action.product[key].category][key] = action.product[key]
            ) );

            return { ...state };

        case 'PRODUCT_CHANGED':

            Object.keys(action.product).map( (key) => (
                state[action.product[key].category][key] = action.product[key]
            ) );

            return { ...state };

        case 'PRODUCT_REMOVED':

            Object.keys(action.product).map( (key) => {

                category = action.product[key].category;

                return ( (isArray(state[category]))? state[category].splice(key, 1) : delete state[category][key] );
            } );

            return { ...state };

        default:

            return ( (!isEmpty(state))? state : { condoms: {}, pills: {}, emergency: {} } );
    }
}
