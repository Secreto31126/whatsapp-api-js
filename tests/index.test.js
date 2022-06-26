// Unit tests with mocha
const assert = require('assert');

// Mock the https requests
const nock = require('nock');
nock.disableNetConnect();
const api = nock("https://graph.facebook.com");

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
        const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");

        describe("Send", () => {
            it("should be able to send a basic message", async () => {                
                const bot = "1";
                const user = "2";
                
                const expectedResponse = {
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
                
                api.post(`/${Whatsapp.v}/${bot}/messages`).reply(200, expectedResponse);

                const response = await (await Whatsapp.sendMessage(bot, user, new Text("3"))).json();

                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", () => {
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

            it("should fail if the phone param is falsy", () => {
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

            it("should fail if the object param is falsy", () => {
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
                const bot = "1";
                const id = "2";

                const expectedResponse = {
                    success: true
                };

                api.post(`/${Whatsapp.v}/${bot}/messages`).reply(200, expectedResponse);
                
                const response = await (await Whatsapp.markAsRead(bot, id)).json();

                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.markAsRead(undefined, "2");
                });

                assert.throws(() => {
                    Whatsapp.markAsRead(false, "2");
                });

                assert.throws(() => {
                    Whatsapp.markAsRead();
                });
            });

            it("should fail if the id param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.markAsRead("1", undefined);
                });

                assert.throws(() => {
                    Whatsapp.markAsRead("1", false);
                });

                assert.throws(() => {
                    Whatsapp.markAsRead("1");
                });
            });
        });
    });

    describe("QR", () => {
        const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");

        describe("Get", () => {
            it("should be able to create a QR code", async () => {
                const expectedResponse = {
                    qr: "https://api.whatsapp.com/qr/code",
                };
    
                api.get(`/${Whatsapp.v}/qr`).reply(200, expectedResponse);
    
                const response = await (await Whatsapp.getQR()).json();
    
                assert.deepEqual(response, expectedResponse);
            });
        });
    });
});
