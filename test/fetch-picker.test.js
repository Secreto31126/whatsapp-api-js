// Unit tests with mocha and sinon
const assert = require('assert');
const sinon = require('sinon');

const nock = require('nock');
nock.disableNetConnect();

const rewire = require('rewire');
const picker = rewire('../fetch-picker');

describe("Fetch Picker", function() {
    it("should pick cross-fetch when fetch is undefined", function() {
        picker.__with__({ fetch: undefined })(function() {
            assert.equal(picker.pick(), require("cross-fetch"));
        });
    });
    
    it("should pick fetch when fetch is a function", function() {
        const fake = sinon.fake();
        picker.__with__({ fetch: fake })(function() {
            assert.equal(picker.pick(), fake);
        });
    });
    
    it("should be a function", function() {
        assert.equal(typeof picker.pick(), "function");
    });

    it("should make a http GET request to the specified URL", async function() {
        // Will check if nock received ONE request to the specified URL
        const scope = nock('http://example.com').get('/').reply(200);
        await picker.pick()('http://example.com/');
        assert.ok(scope.isDone());
    });

    it("should make a http POST request to the specified URL", async function() {
        // Will check if nock received ONE request to the specified URL
        const scope = nock('http://example.com').post('/').reply(200);
        await picker.pick()('http://example.com/', { method: "POST" });
        assert.ok(scope.isDone());
    });
});
