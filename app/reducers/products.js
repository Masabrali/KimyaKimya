/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';
import isArray from './../utilities/isArray';

/**
* Define the reducer
*/
export default function (state = {}, action = {}) {

    switch(action.type) {

        case 'PRODUCTS_FETCHED':

            return {
                condoms: action.products.condoms,
                pills: action.products.pills,
                emergency: action.products.emergency
            };

        case 'PRODUCT_ADDED':

            if (action.product.id && isEmpty(state[action.product.category][action.product.key]))
                state[action.product.category][action.product.key] = action.product;

            return { ...state };

        case 'PRODUCT_CHANGED':

            if (action.product.id && !isEmpty(state[action.product.category][action.product.key]))
                state[action.product.category][action.product.key] = action.product;

            return { ...state };

        case 'PRODUCT_REMOVED':

            if (action.product.id && !isEmpty(state[action.product.category][action.product.key])) {

                if (isArray(state[action.product.category]))
                    state[action.product.category].splice(action.product.key, 1);
                else
                    delete state[action.product.category][action.product.key];
            }

            return { ...state };

        default:

            if (isEmpty(state))
                return {
                    condoms: [],
                    pills: [],
                    emergency: []
                };
            else return state;
    }
}
