// Unit tests with mocha
const assert = require('assert');

const { get, post } = require('../requests');

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
            class Message {
                /**
                 * Helper class to test the messages post request, conditionally creating the object based on the available data
                 */
                constructor(phoneID, phone, message, name) {
                    this.object = "whatsapp_business_account";
                    this.entry = [{
                        id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
                        changes: [{
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                messages: [{}],
                            }
                        }],
                    }];

                    if (phoneID) {
                        this.entry[0].changes[0].value.metadata = {
                            display_phone_number: phoneID,
                            phone_number_id: phoneID,
                        };
                    }

                    if (phone) {
                        this.entry[0].changes[0].value.contacts = [{
                            wa_id: phone,
                        }];
                    }

                    if (message) {
                        this.entry[0].changes[0].value.messages = [ message ];
                    }

                    if (name) {
                        if (!this.entry[0].changes[0].value.contacts) this.entry[0].changes[0].value.contacts = [{}];
                        this.entry[0].changes[0].value.contacts[0].profile = { name };
                    }
                }
            }

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
                const request = new Message(phoneID, phone, message, name);
    
                const response = post(request, (bot, user, m, n, r) => {
                    assert.deepEqual(bot, phoneID);
                    assert.deepEqual(user, phone);
                    assert.deepEqual(m, message);
                    assert.deepEqual(n, name);
                    assert.deepEqual(r, request);
                });
    
                assert.equal(response, 200);
            });
    
            it("should throw 400 if the request isn't a valid Whatsapp cloud API request (data.object)", function() {
                assert.throws(function() {
                    post({}, (bot, user, m, n, r) => {});
                }, e => e === 400);
            });

            it("should throw TypeError if the request is missing any data", function() {
                assert.throws(function() {
                    post(new Message(), () => {});
                }, TypeError);

                assert.throws(function() {
                    // This is actually unexpected, it should throw error...
                    post(new Message(phoneID), () => {});
                }, TypeError);

                assert.throws(function() {
                    post(new Message(phoneID, phone), () => {});
                }, TypeError);

                assert.throws(function() {
                    post(new Message(phoneID, phone, message), () => {});
                }, TypeError);
            });

            it("should fail if the callback is not a function", function() {
                assert.throws(function() {
                    post(new Message(phoneID, phone, message, name));
                }, TypeError);

                assert.throws(function() {
                    post(new Message(phoneID, phone, message, name), "callback");
                }, TypeError);
            });
        });

        describe("Status", function() {});
    });
});
