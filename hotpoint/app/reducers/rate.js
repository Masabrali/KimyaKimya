/**
* Define the reducer
*/
export default function (state = 0, action = {}) {

    switch(action.type) {

        case 'RATE_FETCHED':

            return action.rate;

        default: return state;
    }
}
