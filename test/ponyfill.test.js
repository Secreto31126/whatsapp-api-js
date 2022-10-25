// @ts-nocheck
/* eslint-disable no-undef */

// Unit tests with mocha and sinon
const assert = require("assert");
const sinon = require("sinon");

// Mock the https requests
const { agent, clientExample } = require("./server.mocks");
const { setGlobalDispatcher } = require("undici");
setGlobalDispatcher(agent);

const rewire = require("rewire");
const picker = rewire("../src/ponyfill");

describe("PonyFills", function () {
    describe("Fetch Picker", function () {
        it("should pick undici.fetch when fetch is undefined", function () {
            picker.__with__({ fetch: undefined })(function () {
                assert.equal(picker.pickFetch(), require("undici").fetch);
            });
        });

        it("should pick native fetch when fetch is a function", function () {
            const fake = sinon.fake();
            picker.__with__({ fetch: fake })(function () {
                assert.equal(picker.pickFetch(), fake);
            });
        });

        it("should be a function", function () {
            assert.equal(typeof picker.pickFetch(), "function");
        });

        it("should make a http GET request to the specified URL", async function () {
            clientExample
                .intercept({
                    path: "/"
                })
                .reply(200)
                .times(1);

            await picker.pickFetch()("https://example.com/");
        });

        it("should make a http POST request to the specified URL", async function () {
            clientExample
                .intercept({
                    path: "/",
                    method: "POST"
                })
                .reply(200)
                .times(1);

            await picker.pickFetch()("https://example.com/", {
                method: "POST"
            });
        });
    });
});
