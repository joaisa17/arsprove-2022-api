/** @param {number} ms */
export default function Suspend(ms) {
    if (!ms) ms = 1000;

    return new Promise(res => {
        setTimeout(res, ms);
    });
}