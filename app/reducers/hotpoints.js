/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';

/**
* Define the reducer
*/
export default function (state = [], action = {}) {

    switch(action.type) {

        case 'HOTPOINTS_FETCHED':

            return action.hotpoints;

        default: return state;
    }
}
