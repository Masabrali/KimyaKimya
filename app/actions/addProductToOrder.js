import addProductToOrder from './dispatches/addProductToOrder';

export default function(product) {

    return dispatch => {
        return dispatch( addProductToOrder(product) );
    };
}
