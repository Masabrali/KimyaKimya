export default function (state = {}, action = {}) {

    switch(action.type) {

        case 'LINKS_FETCHED':

            return action.links;

        case 'LINK_FETCHED':

            state[action.link.key] = action.link.link;

            return { ...state };

        default: return state;
    }
}
