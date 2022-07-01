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
            const bot = "1";
            const user = "2";
            const id = "something_random";
            const message = new Text("Hello world");

            it("should be able to send a basic message", async () => {
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
                            id,
                        },
                    ],
                };
                
                api.post(`/${Whatsapp.v}/${bot}/messages`).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.sendMessage(bot, user, message)).json();

                assert.deepEqual(response, expectedResponse);
            });

            it("should be able to send a reply message (context)", async () => {
                const context = "another_random_id";

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
                            id,
                        },
                    ],
                };
                
                api.post(`/${Whatsapp.v}/${bot}/messages`).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.sendMessage(bot, user, message, context)).json();

                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.sendMessage(undefined, user, message);
                });

                assert.throws(() => {
                    Whatsapp.sendMessage(false, user, message);
                });

                assert.throws(() => {
                    Whatsapp.sendMessage();
                });
            });

            it("should fail if the phone param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.sendMessage(bot, undefined, message);
                });

                assert.throws(() => {
                    Whatsapp.sendMessage(bot, false, message);
                });

                assert.throws(() => {
                    Whatsapp.sendMessage(bot);
                });
            });

            it("should fail if the object param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.sendMessage(bot, user, undefined);
                });

                assert.throws(() => {
                    Whatsapp.sendMessage(bot, user, false);
                });

                assert.throws(() => {
                    Whatsapp.sendMessage(bot, user);
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

                api.post(`/${Whatsapp.v}/${bot}/messages`).once().reply(200, expectedResponse);
                
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

        const bot = "1";
        const message = "Hello World";
        const code = "something_random";

        describe("Create", () => {
            it("should be able to create a QR code as a png (default)", async () => {
                const format = "png";

                const expectedResponse = {
                    code,
                    prefilled_message: message,
                    deep_link_url: `https://wa.me/message/${code}`,
                    qr_image_url: 'https://scontent.faep22-1.fna.fbcdn.net/m1/v/t6/another_weird_url',
                };

                api.post(`/${Whatsapp.v}/${bot}/message_qrdls`).query({
                    generate_qr_image: format,
                    prefilled_message: message,
                }).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.createQR(bot, message)).json();
    
                assert.deepEqual(response, expectedResponse);
            });

            it("should be able to create a QR as a png", async () => {
                const format = "png";

                const expectedResponse = {
                    code,
                    prefilled_message: message,
                    deep_link_url: `https://wa.me/message/${code}`,
                    qr_image_url: 'https://scontent.faep22-1.fna.fbcdn.net/m1/v/t6/another_weird_url',
                };

                api.post(`/${Whatsapp.v}/${bot}/message_qrdls`).query({
                    generate_qr_image: format,
                    prefilled_message: message,
                }).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.createQR(bot, message, format)).json();
    
                assert.deepEqual(response, expectedResponse);
            });

            it("should be able to create a QR as a svg", async () => {
                const format = "svg";

                const expectedResponse = {
                    code,
                    prefilled_message: message,
                    deep_link_url: `https://wa.me/message/${code}`,
                    qr_image_url: 'https://scontent.faep22-1.fna.fbcdn.net/m1/v/t6/another_weird_url',
                };

                api.post(`/${Whatsapp.v}/${bot}/message_qrdls`).query({
                    generate_qr_image: format,
                    prefilled_message: message,
                }).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.createQR(bot, message, format)).json();
    
                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.createQR(undefined, message);
                });

                assert.throws(() => {
                    Whatsapp.createQR(false, message);
                });

                assert.throws(() => {
                    Whatsapp.createQR();
                });
            });

            it("should fail if the message param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.createQR(bot, undefined);
                });

                assert.throws(() => {
                    Whatsapp.createQR(bot, false);
                });

                assert.throws(() => {
                    Whatsapp.createQR(bot);
                });
            });
            
            it("should fail with an invalid format type", () => {
                const format = "jpg";

                assert.throws(() => {
                    Whatsapp.createQR(bot, message, format);
                });
            });
        });

        describe("Retrieve", () => {
            it("should be able to retrieve all QR codes", async () => {
                const expectedResponse = {
                    data: [
                        {
                            code,
                            prefilled_message: message,
                            deep_link_url: `https://wa.me/message/${code}`,
                        },
                    ],
                };

                api.get(`/${Whatsapp.v}/${bot}/message_qrdls/`).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.retrieveQR(bot)).json();

                assert.deepEqual(response, expectedResponse);
            });

            it("should be able to retrieve a single QR code", async () => {
                const expectedResponse = {
                    data: [
                        {
                            code,
                            prefilled_message: message,
                            deep_link_url: `https://wa.me/message/${code}`,
                        }
                    ]
                };

                api.get(`/${Whatsapp.v}/${bot}/message_qrdls/${code}`).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.retrieveQR(bot, code)).json();

                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.retrieveQR(undefined, code);
                });

                assert.throws(() => {
                    Whatsapp.retrieveQR(false, code);
                });

                assert.throws(() => {
                    Whatsapp.retrieveQR();
                });
            });
        });

        describe("Update", () => {
            const new_message = "Hello World 2";

            it("should be able to update a QR code", async () => {
                const expectedResponse = {
                    code,
                    prefilled_message: new_message,
                    deep_link_url: `https://wa.me/message/${code}`,
                };

                api.post(`/${Whatsapp.v}/${bot}/message_qrdls/${code}`).query({
                    prefilled_message: new_message,
                }).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.updateQR(bot, code, new_message)).json();
    
                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.updateQR(undefined, code, new_message);
                });

                assert.throws(() => {
                    Whatsapp.updateQR(false, code, new_message);
                });

                assert.throws(() => {
                    Whatsapp.updateQR();
                });
            });

            it("should fail if the code param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.updateQR(bot, undefined, new_message);
                });

                assert.throws(() => {
                    Whatsapp.updateQR(bot, false, new_message);
                });

                assert.throws(() => {
                    Whatsapp.updateQR(bot);
                });
            });

            it("should fail if the message param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.updateQR(bot, code, undefined);
                });

                assert.throws(() => {
                    Whatsapp.updateQR(bot, code, false);
                });

                assert.throws(() => {
                    Whatsapp.updateQR(bot, code);
                });
            });
        });

        describe("Delete", () => {
            it("should be able to delete a QR code", async () => {
                const expectedResponse = {
                    success: true,
                };

                api.delete(`/${Whatsapp.v}/${bot}/message_qrdls/${code}`).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.deleteQR(bot, code)).json();
    
                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.deleteQR(undefined, code);
                });

                assert.throws(() => {
                    Whatsapp.deleteQR(false, code);
                });

                assert.throws(() => {
                    Whatsapp.deleteQR();
                });
            });

            it("should fail if the code param is falsy", () => {
                assert.throws(() => {
                    Whatsapp.deleteQR(bot, undefined);
                });

                assert.throws(() => {
                    Whatsapp.deleteQR(bot, false);
                });

                assert.throws(() => {
                    Whatsapp.deleteQR(bot);
                });
            });
        });
    });
});
