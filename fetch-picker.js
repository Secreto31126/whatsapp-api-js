const req = typeof fetch === "undefined" ? require('cross-fetch') : fetch;
module.exports = { req };
