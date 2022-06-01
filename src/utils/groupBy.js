/**
 * @param {Array} arr 
 * @param {() => string} cb 
 */
export default function GroupBy(arr, cb) {
    const obj = {};

    arr.map(e => {
        const key = cb(e);
        if (!obj[key]) obj[key] = [];
        obj[key].push(e);
    });

    return obj;
}