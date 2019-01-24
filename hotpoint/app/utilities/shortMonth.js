export default function(month) {
    if (month === undefined || month === '') return month;
    else
        return month.substring(0, 3);
}
