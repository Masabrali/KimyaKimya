export default function(currency) {
    if (currency === undefined || !currency) return currency;
    else
        return parseFloat(currency).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}
