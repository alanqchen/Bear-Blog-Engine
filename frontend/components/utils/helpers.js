import dateFormat from 'dateformat'

// Returns MMMM DD, YYYY
export function timestamp2date(dateStr) {
    dateStr = dateStr.slice(0, 10);
    return dateFormat(dateStr, "mmmm") + " " + dateFormat(dateStr, "dd") + ", " + dateFormat(dateStr, "yyyy");
}
