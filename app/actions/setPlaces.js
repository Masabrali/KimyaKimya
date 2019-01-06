import draftOrder from './dispatches/setPlaces';

export default function(places) {

    return dispatch => {
        return dispatch( setPlaces(places) );
    };
}
