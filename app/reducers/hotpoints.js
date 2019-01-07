/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';

/**
* Define the reducer
*/
export default function (state = {}, action = {}) {

    switch(action.type) {

        case 'HOTPOINTS_FETCHED':

            return action.hotpoints;

        case 'HOTPOINT_ADDED':

            if (action.hotpoint.id && isEmpty(state[action.hotpoint.key]))
                state[action.hotpoint.key] = action.hotpoint;

            return { ...state };

        case 'HOTPOINT_CHANGED':

            if (action.hotpoint.id && !isEmpty(state[action.hotpoint.key]))
                state[action.hotpoint.key] = action.hotpoint;

            return { ...state };

        case 'HOTPOINT_REMOVED':

            if (action.hotpoint.id && !isEmpty(state[action.hotpoint.key])) {

                if (isArray(state)) state.splice(action.hotpoint.key, 1);
                else delete state[action.hotpoint.key];
            }

            return { ...state };

        default: return state;
    }
}
