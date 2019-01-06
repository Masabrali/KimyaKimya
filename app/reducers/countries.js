/**
* Define the reducer
*/
export default function (state = {}, action = {}) {

    switch(action.type) {

        case 'COUNTRIES_FETCHED':

            Object.keys(action.countries)
            .sort( (a, b) => ( action.countries[a].name - action.countries[b].name ) )
            .map( (key) => ( state[key] = action.countries[key] ) );

            return { ...state };

        default: return state;
    }
}
