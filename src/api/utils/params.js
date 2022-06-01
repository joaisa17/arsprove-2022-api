/**
 * 
 * @param {string} str 
 * @param {RegExp} expression 
 */
function regex(str, expression) {
    return Boolean(str) && Boolean(str.match(expression));
}

/** 
 * @param {import('express').Request} req
 * @param {Object<string, any>} params 
 * @param {string} reqKey
 */
export default function ValidateParams(req, params, reqKey) {
    const index = reqKey || 'body';

    return !Object.keys(params).map(key =>
        params[key] instanceof Array? params[key].includes(typeof req[index][key])
        :params[key] instanceof RegExp? regex(req[index][key], params[key])
        :(typeof req[index][key]) === params[key]
    ).includes(false);
}