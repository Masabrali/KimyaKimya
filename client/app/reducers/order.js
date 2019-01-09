/**
* Import Utilities
*/
import arrayColumn from './../utilities/arrayColumn';
import arraySum from './../utilities/arraySum';
import isEmpty from './../utilities/isEmpty';

/**
* Define the reducer
*/
export default function (state = {}, action = {}) {

    let index = undefined;

    switch (action.type) {

        case 'PRODUCT_ADDED_TO_ORDER':

            index = state.products.find((product) => {
                return (product.id == action.product.id);
            });
            index = state.products.indexOf(index);

            if (index === -1) state.products.push(action.product);
            else {
                state.products[index].quantity += action.product.quantity;
                state.products[index].amount += action.product.amount;
            }

            state.quantity += action.product.quantity;
            state.amount += action.product.amount;

            return { ...state };

        case 'PRODUCT_REMOVED_FROM_ORDER':

            index = state.products.indexOf(action.product);

            state.products.splice(index, 1);

            state.quantity -= action.product.quantity;
            if (state.quantity < 0) state.quantity = 0;

            state.amount -= action.product.amount;
            if (state.amount < 0) state.amount = 0;

            if (isEmpty(state.products.length) || !state.quantity || !state.amount) {

                state.delivery = 0;

                state.location = undefined;
            }

            return { ...state };

        case 'PRODUCT_EDITED_IN_ORDER':

            index = state.products.indexOf(action.product);

            if (index !== -1) {

                state.quantity = arraySum(arrayColumn(state.products, 'quantity'));
                if (state.quantity < 0) state.quantity = 0;

                state.amount = arraySum(arrayColumn(state.products, 'amount'));
                if (state.amount < 0) state.amount = 0;
            }

            return { ...state };

        case 'PRODUCT_CHANGED':

            if (action.product.id) {

                index = state.products.indexOf(action.product);

                if (index !== -1) {

                    state.quantity = arraySum(arrayColumn(state.products, 'quantity'));
                    if (state.quantity < 0) state.quantity = 0;

                    state.amount = arraySum(arrayColumn(state.products, 'amount'));
                    if (state.amount < 0) state.amount = 0;
                }
            }

            return { ...state };

        case 'PRODUCT_REMOVED':

            if (action.product.id) {

                index = state.products.indexOf(action.product);

                if (index !== -1) {

                    state.quantity = arraySum(arrayColumn(state.products, 'quantity'));
                    if (state.quantity < 0) state.quantity = 0;

                    state.amount = arraySum(arrayColumn(state.products, 'amount'));
                    if (state.amount < 0) state.amount = 0;
                }
            }

            return { ...state };

        case 'ORDER_LOCATION_SET':

            state.delivery = parseFloat(Math.ceil(action.location.distance || 0) * (action.location.rate || 0));
            state.location = action.location;

            return { ...state };

        case 'ORDER_HOTPOINT_SET':

            state.hotpoint = { key: action.hotpoint.id, ...action.hotpoint };

            return { ...state };

        case 'ORDER_SELECTED':

            return {
                draft: null,
                products: action.order.products,
                quantity: action.order.quantity,
                amount: action.order.amount,
                delivery: action.order.delivery,
                location: action.order.location,
                hotpoint: action.order.hotpoint
            };

        case 'ORDER_DRAFTED':

            return {
                products: [],
                quantity: 0,
                amount: 0,
                delivery: 0,
                location: undefined,
                hotpoint: undefined
            }

        case 'ORDER_SUBMITTED':

            return {
                products: [],
                quantity: 0,
                amount: 0,
                delivery: 0,
                location: undefined,
                hotpoint: undefined
            }

        default:

            if (isEmpty(state))
                return {
                    products: [],
                    quantity: 0,
                    amount: 0,
                    delivery: 0,
                    location: undefined,
                    hotpoint: undefined
                };
            else return state;
    }
}
