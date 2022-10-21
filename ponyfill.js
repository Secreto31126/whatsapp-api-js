/**
 * @returns {(fetch|import("cross-fetch").fetch)} The fetch function
 */
function pickFetch() {
    return typeof fetch !== "undefined" ? fetch : require('cross-fetch').fetch;
}

/**
 * @returns {{FormData: FormData | import("formdata-node").FormData, Blob: Blob | import("formdata-node").Blob }} The FormData class
 */
function pickForm() {
    const form = typeof FormData !== "undefined" ? FormData : require('formdata-node').FormData;
    const blob = typeof Blob !== "undefined" ? Blob : require('formdata-node').Blob;

    return { FormData: new form, Blob: new blob };
}

module.exports = { pickFetch, pickForm };
