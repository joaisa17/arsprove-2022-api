function GroupBy(arr, cb) {
    const obj = {};

    arr.map(e => {
        const key = cb(e);
        if (!obj[key]) obj[key] = [];
        obj[key].push(e);
    });

    return obj;
}

console.log(GroupBy([
    1,
    1,
    1,
    2,
    3,
    4
], e => e === 1? 'isOne':'isNotOne'))