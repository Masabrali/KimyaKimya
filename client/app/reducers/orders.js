/**
* Import Libraries
*/
import firebase from 'react-native-firebase';

/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';

/**
* Define the reducer
*/
export default function (state = {}, action = {}) {

    let currentUser = firebase.auth().currentUser;
    let sort = (_orders) => {

        let orders = {};

        Object.keys(_orders)
        .sort( (a, b) => ( _orders[b].date - _orders[a].date ) )
        .map( (key) => ( orders[key] = { key: key, ..._orders[key] } ) );

        return orders;
    };

    switch(action.type) {

        case 'ORDERS_FETCHED':

            let orders = action.orders || {};

            return {
                previous: sort(( orders.previous || {} )[currentUser.uid] || state.previous || {}),
                drafts: sort(( orders.drafts || {} )[currentUser.uid] || state.drafts || {}),
                queued: sort(( orders.queued || {} )[currentUser.uid] || state.queued || {})
            };

        case 'ORDER_DRAFTED':

            Object.keys(action.order).map( (key) => (
                state.drafts[key] = state.drafts[key] || action.order[key]
            ) );

            state.drafts = sort(state.drafts);

            return { ...state };

        case 'ORDER_SELECTED':

            if (!isEmpty(state.drafts[action.order.key])) delete state.drafts[action.order.key];

            return { ...state };

        case 'ORDER_DELETED':

            Object.keys(action.order).map( (key) => (
                delete state[(action.order[key].draft)? 'drafts' : 'previous'][key]
            ) );

            return { ...state };

        case 'ORDER_SUBMITTED':

            Object.keys(action.order).map( (key) => ( state.queued[key] = action.order[key] ) );

            state.queued = sort(state.queued);

            state.newOrderQueued = true;

            return { ...state };

        case 'ORDER_READ':

            state.newOrderQueued = false;

            return { ...state };

        case 'ORDER_DELIVERED':

            Object.keys(action.order).map( (key) => ( delete state.queued[key] ) );

            state.newOrderQueued = false;

            return { ...state };

        case 'USER_LOGGED_OUT':

            return {};

        default:

            if (isEmpty(state))
                return {
                    previous: {},
                    drafts: {},
                    queued: {}
                };
            else return state;
    }
}
