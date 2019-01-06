/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';

/**
* Define the reducer
*/
export default function (state = {}, action = {}) {
    
    switch(action.type) {

        case 'USER_LOGGED_IN':

            return action.user;

        case 'USER_VERIFIED':

            return action.user;

        case 'USER_PHONE_SET':

            state.country = action.user.country;
            state.countryCode = action.user.countryCode;
            state.phone = action.user.phone;

            return { ...state };

        case 'USER_GENDER_SET':

            state.gender = action.user.gender;

            return { ...state };

        case 'USER_BIRTH_SET':

            state.birth = action.user.birth;

            return { ...state };

        case 'USER_FETCHED':

            return action.user;

        case 'USER_LOGGED_OUT':

            return {};

        default: return state;
    }
}
