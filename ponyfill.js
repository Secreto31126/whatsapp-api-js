/**
 * @returns {(fetch|import("cross-fetch").fetch)} The fetch function
 */
function pickFetch() {
    return typeof fetch !== "undefined" ? fetch : require('cross-fetch').fetch;
}

module.exports = { pickFetch };
