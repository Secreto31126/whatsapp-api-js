/**
 * @package
 * @ignore
 * @returns {(fetch|import("undici/types/fetch").fetch)} The fetch function
 */
function pickFetch() {
    return typeof fetch !== "undefined" ? fetch : require("undici").fetch;
}

module.exports = { pickFetch };
