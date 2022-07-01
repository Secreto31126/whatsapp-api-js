// Unit tests with mocha
const assert = require('assert');

// Mock the https requests
const nock = require('nock');
nock.disableNetConnect();
const api = nock("https://graph.facebook.com");

// Import the module
const { WhatsAppAPI, Types } = require('../index');
const { Text } = Types;

describe("WhatsAppAPI", function() {
    describe("Token", function() {
        it("should create a WhatsAppAPI object with the token", function() {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");
            assert.equal(Whatsapp.token, "YOUR_ACCESS_TOKEN");
        });

        it("should fail if no access token is provided", function() {
            assert.throws(function() {
                const Whatsapp = new WhatsAppAPI();
            });
        });
    });

    describe("Version", function() {
        it("should work with v14.0 as default", function() {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");
            assert.equal(Whatsapp.v, "v14.0");
        });

        it("should work with any specified version", function() {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN", "v13.0");
            assert.equal(Whatsapp.v, "v13.0");
        });
    });
    
    describe("Message", function() {
        const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");

        describe("Send", function() {
            const bot = "1";
            const user = "2";
            const id = "something_random";
            const message = new Text("Hello world");

            it("should be able to send a basic message", async function() {
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

            it("should be able to send a reply message (context)", async function() {
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

            it("should fail if the phoneID param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.sendMessage(undefined, user, message);
                });

                assert.throws(function() {
                    Whatsapp.sendMessage(false, user, message);
                });

                assert.throws(function() {
                    Whatsapp.sendMessage();
                });
            });

            it("should fail if the phone param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.sendMessage(bot, undefined, message);
                });

                assert.throws(function() {
                    Whatsapp.sendMessage(bot, false, message);
                });

                assert.throws(function() {
                    Whatsapp.sendMessage(bot);
                });
            });

            it("should fail if the object param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.sendMessage(bot, user, undefined);
                });

                assert.throws(function() {
                    Whatsapp.sendMessage(bot, user, false);
                });

                assert.throws(function() {
                    Whatsapp.sendMessage(bot, user);
                });
            });
        });

        describe("Mark as read", function() {
            it("should be able to mark a message as read", async function() {
                const bot = "1";
                const id = "2";

                const expectedResponse = {
                    success: true
                };

                api.post(`/${Whatsapp.v}/${bot}/messages`).once().reply(200, expectedResponse);
                
                const response = await (await Whatsapp.markAsRead(bot, id)).json();

                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.markAsRead(undefined, "2");
                });

                assert.throws(function() {
                    Whatsapp.markAsRead(false, "2");
                });

                assert.throws(function() {
                    Whatsapp.markAsRead();
                });
            });

            it("should fail if the id param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.markAsRead("1", undefined);
                });

                assert.throws(function() {
                    Whatsapp.markAsRead("1", false);
                });

                assert.throws(function() {
                    Whatsapp.markAsRead("1");
                });
            });
        });
    });

    describe("QR", function() {
        const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");

        const bot = "1";
        const message = "Hello World";
        const code = "something_random";

        describe("Create", function() {
            it("should be able to create a QR code as a png (default)", async function() {
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

            it("should be able to create a QR as a png", async function() {
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

            it("should be able to create a QR as a svg", async function() {
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

            it("should fail if the phoneID param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.createQR(undefined, message);
                });

                assert.throws(function() {
                    Whatsapp.createQR(false, message);
                });

                assert.throws(function() {
                    Whatsapp.createQR();
                });
            });

            it("should fail if the message param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.createQR(bot, undefined);
                });

                assert.throws(function() {
                    Whatsapp.createQR(bot, false);
                });

                assert.throws(function() {
                    Whatsapp.createQR(bot);
                });
            });
            
            it("should fail with an invalid format type", function() {
                const format = "jpg";

                assert.throws(function() {
                    Whatsapp.createQR(bot, message, format);
                });
            });
        });

        describe("Retrieve", function() {
            it("should be able to retrieve all QR codes", async function() {
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

            it("should be able to retrieve a single QR code", async function() {
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

            it("should fail if the phoneID param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.retrieveQR(undefined, code);
                });

                assert.throws(function() {
                    Whatsapp.retrieveQR(false, code);
                });

                assert.throws(function() {
                    Whatsapp.retrieveQR();
                });
            });
        });

        describe("Update", function() {
            const new_message = "Hello World 2";

            it("should be able to update a QR code", async function() {
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

            it("should fail if the phoneID param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.updateQR(undefined, code, new_message);
                });

                assert.throws(function() {
                    Whatsapp.updateQR(false, code, new_message);
                });

                assert.throws(function() {
                    Whatsapp.updateQR();
                });
            });

            it("should fail if the code param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.updateQR(bot, undefined, new_message);
                });

                assert.throws(function() {
                    Whatsapp.updateQR(bot, false, new_message);
                });

                assert.throws(function() {
                    Whatsapp.updateQR(bot);
                });
            });

            it("should fail if the message param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.updateQR(bot, code, undefined);
                });

                assert.throws(function() {
                    Whatsapp.updateQR(bot, code, false);
                });

                assert.throws(function() {
                    Whatsapp.updateQR(bot, code);
                });
            });
        });

        describe("Delete", function() {
            it("should be able to delete a QR code", async function() {
                const expectedResponse = {
                    success: true,
                };

                api.delete(`/${Whatsapp.v}/${bot}/message_qrdls/${code}`).once().reply(200, expectedResponse);

                const response = await (await Whatsapp.deleteQR(bot, code)).json();
    
                assert.deepEqual(response, expectedResponse);
            });

            it("should fail if the phoneID param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.deleteQR(undefined, code);
                });

                assert.throws(function() {
                    Whatsapp.deleteQR(false, code);
                });

                assert.throws(function() {
                    Whatsapp.deleteQR();
                });
            });

            it("should fail if the code param is falsy", function() {
                assert.throws(function() {
                    Whatsapp.deleteQR(bot, undefined);
                });

                assert.throws(function() {
                    Whatsapp.deleteQR(bot, false);
                });

                assert.throws(function() {
                    Whatsapp.deleteQR(bot);
                });
            });
        });
    });
});
