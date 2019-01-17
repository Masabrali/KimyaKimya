/**
* Import Libraries
*/
import firebase from 'react-native-firebase';

/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';
import isArray from './../utilities/isArray';

/**
* Define the reducer
*/
export default function (state = {}, action = {}) {

    let _key;
    const currentUser = firebase.auth().currentUser;
    const sort = (_orders) => {

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
                previous: sort(( orders.previous || {} )[currentUser.uid] || {}),
                drafts: sort(( orders.drafts || {} )[currentUser.uid] || {}),
                queued: sort(( orders.queued || {} )[currentUser.uid] || {})
            };

        case 'ORDER_ADDED':

            Object.keys(action.order).map( (key) => {

                _key = (!!action.order[key].draft)? 'drafts' : (!!action.order[key].queued)? 'queued' : 'previous';

                state[_key][key] = action.order[key];

                state[_key] = sort(state[_key]);

                return action.order[key];
            } );

            return { ...state };

        case 'ORDER_CHANGED':

            Object.keys(action.order).map( (key) => {

                _key = (!!action.order[key].draft)? 'drafts' : (!!action.order[key].queued)? 'queued' : 'previous';

                state[_key][key] = action.order[key];

                state[_key] = sort(state[_key]);

                return action.order[key];
            } );

            return { ...state };

        case 'ORDER_DRAFTED':

            Object.keys(action.order).map( (key) => ( state.drafts[key] = action.order[key] ) );

            state.drafts = sort(state.drafts);

            return { ...state };

        case 'ORDER_SELECTED':

            if (!isEmpty(state.drafts[action.order.key])) delete state.drafts[action.order.key];

            return { ...state };

        case 'ORDER_DELETED':

            Object.keys(action.order).map( (key) => {

                _key = (!!action.order[key].draft)? 'drafts' : (!!action.order[key].queued)? 'queued' : 'previous';

                return ((isArray(state[_key]))? state[_key].splice(key, 1) : delete state[_key][key]);
            } );

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

            return ( (!isEmpty(state))? state : { previous: {}, drafts: {}, queued: {} } );
    }
}
