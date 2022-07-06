function pick() {
    const req = typeof fetch === "undefined" ? require('cross-fetch') : fetch;
    return req;
}

module.exports = { pick };
