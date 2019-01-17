export default function (state = {}, action = {}) {

    switch(action.type) {

        case 'INVITATION_FETCHED':

            return action.invitation;

        case 'INVITATION_UPDATED':

            state[action.invitation.key] = action.invitation.value;

            return { ...state };

        case 'INVITATION_CHANGED':

            delete state[action.invitation.key];

            return { ...state };

        default: return state;
    }
}
