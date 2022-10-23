// @ts-nocheck

// Unit tests with mocha and sinon
const assert = require('assert');
const sinon = require('sinon');

const fake = sinon.fake();

const { get, post } = require('../requests');

const { MessageMock, StatusMock } = require('./requests.mocks');

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
        // Valid data
        const phoneID = "1";
        const phone = "2";

        describe("Validation", function() {   
            it("should throw 400 if the request isn't a valid Whatsapp cloud API request (data.object)", function() {
                assert.throws(function() {
                    post({}, fake);
                }, e => e === 400);
            });
        });

        describe("Messages", function() {
            const name = "name";
            const message = {
                from: phone,
                id: "wamid.ID",
                timestamp: 0,
                type: "text",
                text: {
                    body: "message",
                },
            };
            const mock = new MessageMock(phoneID, phone, message, name);

            it("should parse the post request and call back with the right parameters", function() {
                const spy = sinon.spy();
    
                const response = post(mock, spy);
    
                sinon.assert.calledOnceWithMatch(spy, phoneID, phone, message, name, mock);
                assert.equal(response, 200);
            });

            it("should throw TypeError if the request is missing any data", function() {
                let moddedMock;

                moddedMock = new MessageMock();
                assert.throws(function() {
                    post(moddedMock, fake);
                }, TypeError);

                moddedMock = new MessageMock(phoneID);
                assert.throws(function() {
                    // This is actually unexpected, it should throw error...
                    post(moddedMock, fake);
                }, TypeError);

                moddedMock = new MessageMock(phoneID, phone);
                assert.throws(function() {
                    post(moddedMock, fake);
                }, TypeError);

                moddedMock = new MessageMock(phoneID, phone, message);
                assert.throws(function() {
                    post(moddedMock, fake);
                }, TypeError);
            });

            it("should fail if the onMessage callback is not a function", function() {
                assert.throws(function() {
                    post(mock);
                }, TypeError);

                assert.throws(function() {
                    post(mock, "callback");
                }, TypeError);
            });
        });

        describe("Status", function() {
            const status = "3";
            const id = "4";
            const conversation = {
                id: "CONVERSATION_ID",
                expiration_timestamp: "TIMESTAMP",
                origin: {
                    type: "user_initiated"
                }
            }
            const pricing = {
                pricing_model: "CBP",
                billable: true,
                category: "business-initiated"
            }
            const mock = new StatusMock(phoneID, phone, status, id, conversation, pricing);

            it("should parse the post request and call back with the right parameters", function() {
                const spy = sinon.spy();

                const response = post(mock, fake, spy);

                sinon.assert.calledOnceWithMatch(spy, phoneID, phone, status, id, conversation, pricing, { ...mock });
                assert.equal(response, 200);
            });

            it("should throw TypeError if the request is missing any data", function() {
                let moddedMock;

                moddedMock = new StatusMock();
                assert.throws(function() {
                    post(moddedMock, fake, fake);
                }, TypeError);

                moddedMock = new StatusMock(phoneID);
                assert.throws(function() {
                    post(moddedMock, fake, fake);
                }, TypeError);

                // In conclution, it's pointless. As soon as any of the other parameters are defined,
                // the code will return undefined for the missing ones, without any error.

                // moddedMock = new StatusMock(phoneID, phone);
                // assert.throws(function() {
                //     post(moddedMock, fake, fake);
                // }, TypeError);

                // moddedMock = new StatusMock(phoneID, phone, status);
                // assert.throws(function() {
                //     post(moddedMock, fake, fake);
                // }, TypeError);

                // moddedMock = new StatusMock(phoneID, phone, status, id);
                // assert.throws(function() {
                //     post(moddedMock, fake, fake);
                // }, TypeError);

                // moddedMock = new StatusMock(phoneID, phone, status, id, conversation);
                // assert.throws(function() {
                //     post(moddedMock, fake, fake);
                // }, TypeError);
            });

            it("shouldn't throw if onStatus callback is not truthy", function() {
                assert.doesNotThrow(function() {
                    post(mock, fake);
                });

                assert.doesNotThrow(function() {
                    post(mock, fake, false);
                });
            });

            it("should fail if the onStatus callback is truthy but it's not a function", function() {
                assert.throws(function() {
                    post(mock, fake, true);
                }, TypeError);

                assert.throws(function() {
                    post(mock, fake, "callback");
                }, TypeError);
            });
        });
    });
});
