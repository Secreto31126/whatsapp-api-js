/**
 * @returns {function} The fetch function
 */
function pickFetch() {
    const req = typeof fetch === "undefined" ? require('cross-fetch') : fetch;
    // @ts-ignore
    return req;
}

module.exports = { pickFetch };
