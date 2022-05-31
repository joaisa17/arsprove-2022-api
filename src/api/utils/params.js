/**
 * 
 * @param {string} str 
 * @param {RegExp} expression 
 */
function regex(str, expression) {
    return Boolean(str.match(expression));
}

/** 
 * @param {import('express').Request} req
 * @param {Object<string, any>} params 
 */
export default function ValidateParams(req, params) {
    return !Object.keys(params).map(key =>
        params[key] instanceof Array? params[key].includes(typeof req.body[key])
        :params[key] instanceof RegExp? regex(req.body[key], params[key])
        :(typeof req.body[key]) === params[key]
    ).includes(false);
}