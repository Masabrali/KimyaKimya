/**
* Define the reducer
*/
export default function (state = null, action = {}) {

    switch(action.type) {

        case 'COUNTRY_FETCHED':

            return action.country;

        default: return state;
    }
}
