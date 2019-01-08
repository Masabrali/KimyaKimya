export default function (product) {
    return {
        type: 'PRODUCT_REMOVED_FROM_ORDER',
        product
    };
}
