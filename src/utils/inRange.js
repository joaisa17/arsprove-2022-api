/**
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 */
export default function InRange(value, min, max) {
    return Math.max(
        Math.min(value, max),
        min
    ) === value;
}