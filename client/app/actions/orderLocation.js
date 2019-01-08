import setOrderLocation from './dispatches/setOrderLocation';

export default function(location) {

    return dispatch => {
        return dispatch( setOrderLocation(location) );
    };
}
