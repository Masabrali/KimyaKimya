export default function isEmpty(obj) {

    if (!obj) return true;
    else {
        if (typeof obj === 'array') return (obj.length < 1);
        else if (typeof obj === 'object') return (Object.keys(obj).length < 1);
    }
}
