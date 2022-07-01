// Unit tests with mocha
const assert = require('assert');

const nock = require('nock');
nock.disableNetConnect();

const { req } = require('../fetch-picker');

describe("Fetch Picker", function() {
    it("should be fetch or cross-fetch, depending on the Node version of the system running this unit", function() {
        assert.equal(req, typeof fetch === "undefined" ? require("cross-fetch") : fetch);
    });
    
    it("should be a function", function() {
        assert.equal(typeof req, "function");
    });

    it("should make a http request to the specified URL", async function() {
        // Will check if nock received ONE request to the specified URL
        const scope = nock('http://example.com').get('/').reply(200);
        await req('http://example.com/');
        assert.ok(scope.isDone());
    });
});
