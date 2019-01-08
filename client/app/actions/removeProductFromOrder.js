import removeProductFromOrder from './dispatches/removeProductFromOrder';

export default function(product) {

    return dispatch => {
        return dispatch( removeProductFromOrder(product) );
    };
}
