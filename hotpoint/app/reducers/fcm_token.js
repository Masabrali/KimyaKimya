/**
* Define the reducer
*/
export default function (state = '', action = {}) {

    switch(action.type) {

        case 'FCM_TOKEN_FETCHED':

            return action.token;

        default: return state;
    }
}
