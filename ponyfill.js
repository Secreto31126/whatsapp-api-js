/**
 * @returns {(fetch|import("cross-fetch").fetch)} The fetch function
 */
function pickFetch() {
    return globalThis.fetch ?? require('cross-fetch').fetch;
}

/**
 * @returns {{FormData: FormData | import("formdata-node").FormData, Blob: Blob | import("formdata-node").Blob }} The FormData class
 */
function pickForm() {
    const form = globalThis.FormData ?? require('formdata-node').FormData;
    const blob = globalThis.Blob ?? require('formdata-node').Blob;

    // @ts-ignore
    return { FormData: form, Blob: blob };
}

module.exports = { pickFetch, pickForm };
