import setOrderHotpoint from './dispatches/setOrderHotpoint';

export default function(hotpoint) {

    return dispatch => {
        return dispatch( setOrderHotpoint(hotpoint) );
    };
}
