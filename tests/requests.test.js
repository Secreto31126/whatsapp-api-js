// Unit tests with mocha and sinon
const assert = require('assert');
const sinon = require('sinon');

const { get, post } = require('../requests');

const MessageMock = require('./message.mock');

describe("Requests", function() {
    describe("Get", function() {
        const mode = "subscribe";
        const token = "token";
        const challenge = "challenge";

        it("should validate the get request and return the challenge", function() {
            const request = {
                "hub.mode": mode,
                "hub.verify_token": token,
                "hub.challenge": challenge,
            }

            const response = get(request, token);

            assert.equal(response, challenge);
        });

        it("should throw 400 if the request is missing data", function() {
            const compare = e => e === 400;

            assert.throws(function() {
                get({}, "token");
            }, compare);

            assert.throws(function() {
                get({ "hub.mode": mode }, "token");
            }, compare);

            assert.throws(function() {
                get({ "hub.verify_token": token }, "token");
            }, compare);
        });

        it("should throw 403 if the verification tokens don't match", function() {
            const compare = e => e === 403;

            assert.throws(function() {
                get({ "hub.mode": mode, "hub.verify_token": "wrong" }, token);
            }, compare);
        });

        it("should throw 500 if verify_token is not specified", function() {
            const compare = e => e === 500;

            assert.throws(function() {
                get({ "hub.mode": mode, "hub.verify_token": token }, null);
            }, compare);
        });
    });

    describe("Post", function() {
        describe("Messages", function() {
            // Valid data
            const phoneID = 1;
            const phone = 2;
            const message = {
                from: phone,
                id: "wamid.ID",
                timestamp: 0,
                type: "text",
                text: {
                    body: "message",
                },
            };
            const name = "name";
    
            it("should validate the post request and call back with the right parameters", function() {
                const request = new MessageMock(phoneID, phone, message, name);
                const spy = sinon.spy();
    
                const response = post(request, spy);
    
                sinon.assert.calledOnceWithMatch(spy, phoneID, phone, message, name, request);
                assert.equal(response, 200);
            });
    
            it("should throw 400 if the request isn't a valid Whatsapp cloud API request (data.object)", function() {
                assert.throws(function() {
                    post({}, (bot, user, m, n, r) => {});
                }, e => e === 400);
            });

            it("should throw TypeError if the request is missing any data", function() {
                let mock;

                mock = new MessageMock();
                assert.throws(function() {
                    post(mock, () => {});
                }, TypeError);

                mock = new MessageMock(phoneID);
                assert.throws(function() {
                    // This is actually unexpected, it should throw error...
                    post(mock, () => {});
                }, TypeError);

                mock = new MessageMock(phoneID, phone);
                assert.throws(function() {
                    post(mock, () => {});
                }, TypeError);

                mock = new MessageMock(phoneID, phone, message);
                assert.throws(function() {
                    post(mock, () => {});
                }, TypeError);
            });

            it("should fail if the callback is not a function", function() {
                assert.throws(function() {
                    post(new MessageMock(phoneID, phone, message, name));
                }, TypeError);

                assert.throws(function() {
                    post(new MessageMock(phoneID, phone, message, name), "callback");
                }, TypeError);
            });
        });

        describe("Status", function() {});
    });
});
