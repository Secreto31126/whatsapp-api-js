// Unit tests with mocha
const assert = require('assert');

// Mock the fetch module
const sinon = require('sinon');
const fetch = require('../fetch');

// Import the module
const { WhatsAppAPI, Types } = require('../index');
const { Text } = Types;

describe("WhatsAppAPI", () => {
    describe("Token", () => {
        it("should create a WhatsAppAPI object with the token", () => {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");
            assert.equal(Whatsapp.token, "YOUR_ACCESS_TOKEN");
        });

        it("should fail if no access token is provided", () => {
            assert.throws(() => {
                const Whatsapp = new WhatsAppAPI();
            });
        });
    });

    describe("Version", () => {
        it("should work with v14.0 as default", () => {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");
            assert.equal(Whatsapp.v, "v14.0");
        });

        it("should work with any specified version", () => {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN", "v13.0");
            assert.equal(Whatsapp.v, "v13.0");
        });
    });
    
    describe("Message", () => {
        describe("Send", () => {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");

            let sendMessageStub;

            beforeEach(() => {
                sendMessageStub = sinon.stub(fetch, "sendMessage");
            });

            afterEach(() => {
                sendMessageStub.restore();
            });

            it("should be able to send a basic message", async () => {
                const user = "2";

                const response = {
                    messaging_product: "whatsapp",
                    contacts: [
                        {
                            input: user,
                            wa_id: user,
                        }
                    ],
                    messages: [
                        {
                            id: "something_random",
                        },
                    ],
                };
    
                sendMessageStub.returns(Promise.resolve(response));

                const e = await Whatsapp.sendMessage("1", user, new Text("3"));
                assert.equal(e, response);
            });

            it("should fail if the phoneID param is falsy", async () => {
                assert.throws(() => {
                    Whatsapp.sendMessage(undefined, "2", new Text("3"));
                });

                assert.throws(() => {
                    Whatsapp.sendMessage(false, "2", new Text("3"));
                });

                assert.throws(() => {
                    Whatsapp.sendMessage();
                });
            });

            it("should fail if the phone param is falsy", async () => {
                assert.throws(() => {
                    Whatsapp.sendMessage("1", undefined, new Text("3"));
                });

                assert.throws(() => {
                    Whatsapp.sendMessage("1", false, new Text("3"));
                });

                assert.throws(() => {
                    Whatsapp.sendMessage("1");
                });
            });

            it("should fail if the object param is falsy", async () => {
                assert.throws(() => {
                    Whatsapp.sendMessage("1", "2", undefined);
                });

                assert.throws(() => {
                    Whatsapp.sendMessage("1", "2", false);
                });
            });
        });

        describe("Mark as read", () => {
            it("should be able to mark a message as read", async () => {
                const response = {
                    done: true,
                };

                const sendMessageStub = sinon.stub(fetch, "readMessage");
                sendMessageStub.returns(Promise.resolve(response));

                const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");
                const e = await Whatsapp.markAsRead("1", "2");
                assert.equal(e, response);
            });
        });
    });
});
