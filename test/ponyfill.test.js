// @ts-nocheck

// Unit tests with mocha and sinon
const assert = require('assert');
const sinon = require('sinon');

const nock = require('nock');
nock.disableNetConnect();

const rewire = require('rewire');
const picker = rewire('../ponyfill');

describe('PonyFills', function() {
    describe("Fetch Picker", function() {
        before(function () {
            // Prevent running the tests if node version is greater than 17
            if (process.version.match(/v(\d+)/)[1] >= 17) {
                this.skip();
            }
        });
    
        it("should pick cross-fetch when fetch is undefined", function() {
            picker.__with__({ fetch: undefined })(function() {
                assert.equal(picker.pickFetch(), require("cross-fetch"));
            });
        });
        
        it("should pick native fetch when fetch is a function", function() {
            const fake = sinon.fake();
            picker.__with__({ fetch: fake })(function() {
                assert.equal(picker.pickFetch(), fake);
            });
        });
        
        it("should be a function", function() {
            assert.equal(typeof picker.pickFetch(), "function");
        });
    
        it("should make a http GET request to the specified URL", async function() {
            // Will check if nock received ONE request to the specified URL
            const scope = nock('http://example.com').get('/').reply(200);
            await picker.pickFetch()('http://example.com/');
            assert.ok(scope.isDone());
        });
    
        it("should make a http POST request to the specified URL", async function() {
            // Will check if nock received ONE request to the specified URL
            const scope = nock('http://example.com').post('/').reply(200);
            await picker.pickFetch()('http://example.com/', { method: "POST" });
            assert.ok(scope.isDone());
        });
    });
});
