/**
* Define the reducer
*/
export default function (state = 0, action = {}) {

    switch(action.type) {

        case 'SPEED_FETCHED':

            return action.speed;

        default: return state;
    }
}
