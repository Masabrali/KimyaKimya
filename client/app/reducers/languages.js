export default function (state = [], action = {}) {
    switch (action.type) {

        case 'LANGUAGES_FETCHED':

            return action.languages;

        default: return state;
    }
}
