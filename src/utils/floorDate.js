/**
 * @param {Date} date
 * @param {number} level
*/
export default function FloorDate(date, level) {
    if (!date) return;
    const copy = new Date(date);

    (!level || level >= 4) && copy.setHours(0);
    (!level || level >= 3) && copy.setMinutes(0);
    (!level || level >= 2) && copy.setSeconds(0);
    (!level || level >= 1) && copy.setMilliseconds(0);

    return copy;
}