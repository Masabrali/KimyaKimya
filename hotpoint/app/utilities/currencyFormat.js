export default function(currency) {
    if (currency === undefined || !currency) return currency;
    else
        return parseInt(Math.ceil(currency)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}
