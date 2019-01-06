import readQueuedOrder from './dispatches/readQueuedOrder';

export default function() {

    return dispatch => {
        return dispatch( readQueuedOrder() );
    };
}
