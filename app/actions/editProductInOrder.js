import editProductInOrder from './dispatches/editProductInOrder';

export default function(product) {

    return dispatch => {
        return dispatch( editProductInOrder(product) );
    };
}
