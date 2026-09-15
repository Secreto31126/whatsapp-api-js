// Unit tests with node:test and sinon
import { describe, it, beforeEach, mock } from "node:test";
import { strictEqual, partialDeepStrictEqual } from "node:assert";
import { spy, assert } from "sinon";

// Import the module
import { WhatsAppAPI } from "../lib/index.js";

describe("Payload Examples", () => {
    describe("v26", () => {
        const whatsapp = new WhatsAppAPI({
            token: "fake",
            secure: false,
            v: "v25.0"
        });

        const phoneID = "123456123";

        const message = {
            type: "text",
            text: {
                body: "this is a text message"
            }
        };

        let msgSpy = spy();
        let stsSpy = spy();
        beforeEach(() => {
            msgSpy = spy();
            stsSpy = spy();

            whatsapp.on.message = msgSpy;
            whatsapp.on.status = stsSpy;
        });

        /**
         * @param {import("../lib/types").PostData["entry"][number]["changes"][number]} data
         * @returns {import("../lib/types").PostData}
         */
        function complete_payload(data) {
            return {
                object: "whatsapp_business_account",
                entry: [
                    {
                        id: "1",
                        changes: [data]
                    }
                ]
            };
        }

        describe("Incoming message", () => {
            describe("With phone", () => {
                it("has parent bsuid", async () => {
                    const payload = complete_payload({
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "16505551111",
                                phone_number_id: "123456123"
                            },
                            contacts: [
                                {
                                    profile: {
                                        name: "test user name"
                                    },
                                    wa_id: "16315551181",
                                    user_id: "US.13491208655302741918",
                                    parent_user_id: "US.ENT.506847293015824"
                                }
                            ],
                            messages: [
                                {
                                    id: "ABGGFlA5Fpa",
                                    timestamp: "1504902988",
                                    from: "16315551181",
                                    from_user_id: "US.13491208655302741918",
                                    from_parent_user_id:
                                        "US.ENT.506847293015824",
                                    type: "text",
                                    text: {
                                        body: "this is a text message"
                                    }
                                }
                            ]
                        }
                    });

                    await whatsapp.post(payload);

                    // @ts-expect-error Callback is defined with spy
                    assert.calledOnceWithMatch(whatsapp.on.message, {
                        phoneID,
                        message,
                        from: "16315551181",
                        contact: {
                            profile: {
                                name: "test user name",
                                username: undefined
                            },
                            wa_id: "16315551181",
                            user_id: "US.13491208655302741918",
                            parent_user_id: "US.ENT.506847293015824"
                        },
                        recipient: {
                            phone: "16315551181",
                            bsuid: "US.13491208655302741918",
                            pbsuid: "US.ENT.506847293015824"
                        }
                    });
                });

                it("doesn't have parent bsuid", async () => {
                    const payload = complete_payload({
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "16505551111",
                                phone_number_id: "123456123"
                            },
                            contacts: [
                                {
                                    profile: {
                                        name: "test user name"
                                    },
                                    wa_id: "16315551181",
                                    user_id: "US.13491208655302741918"
                                }
                            ],
                            messages: [
                                {
                                    id: "ABGGFlA5Fpa",
                                    timestamp: "1504902988",
                                    from: "16315551181",
                                    from_user_id: "US.13491208655302741918",
                                    type: "text",
                                    text: {
                                        body: "this is a text message"
                                    }
                                }
                            ]
                        }
                    });

                    await whatsapp.post(payload);

                    // @ts-expect-error Test
                    assert.calledOnceWithMatch(whatsapp.on.message, {
                        phoneID,
                        message,
                        from: "16315551181",
                        contact: {
                            profile: {
                                name: "test user name",
                                username: undefined
                            },
                            wa_id: "16315551181",
                            user_id: "US.13491208655302741918",
                            parent_user_id: undefined
                        },
                        recipient: {
                            phone: "16315551181",
                            bsuid: "US.13491208655302741918"
                        }
                    });
                });
            });

            describe("With username", () => {
                it("has parent bsuid", async () => {
                    const payload = complete_payload({
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "16505551111",
                                phone_number_id: "123456123"
                            },
                            contacts: [
                                {
                                    profile: {
                                        name: "test user name",
                                        username: "@testusername"
                                    },
                                    user_id: "US.13491208655302741918",
                                    parent_user_id: "US.ENT.506847293015824"
                                }
                            ],
                            messages: [
                                {
                                    id: "ABGGFlA5Fpa",
                                    timestamp: "1504902988",
                                    from_user_id: "US.13491208655302741918",
                                    from_parent_user_id:
                                        "US.ENT.506847293015824",
                                    type: "text",
                                    text: {
                                        body: "this is a text message"
                                    }
                                }
                            ]
                        }
                    });

                    await whatsapp.post(payload);

                    // @ts-expect-error Callback is defined with spy
                    assert.calledOnceWithMatch(whatsapp.on.message, {
                        phoneID,
                        message,
                        from: "US.ENT.506847293015824",
                        contact: {
                            profile: {
                                name: "test user name",
                                username: "@testusername"
                            },
                            wa_id: undefined,
                            user_id: "US.13491208655302741918",
                            parent_user_id: "US.ENT.506847293015824"
                        },
                        recipient: {
                            phone: undefined,
                            bsuid: "US.13491208655302741918",
                            pbsuid: "US.ENT.506847293015824"
                        }
                    });
                });

                it("doesn't have parent bsuid", async () => {
                    const payload = complete_payload({
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "16505551111",
                                phone_number_id: "123456123"
                            },
                            contacts: [
                                {
                                    profile: {
                                        name: "test user name",
                                        username: "@testusername"
                                    },
                                    user_id: "US.13491208655302741918"
                                }
                            ],
                            messages: [
                                {
                                    id: "ABGGFlA5Fpa",
                                    timestamp: "1504902988",
                                    from_user_id: "US.13491208655302741918",
                                    type: "text",
                                    text: {
                                        body: "this is a text message"
                                    }
                                }
                            ]
                        }
                    });

                    await whatsapp.post(payload);

                    // @ts-expect-error Callback is defined with spy
                    assert.calledOnceWithMatch(whatsapp.on.message, {
                        phoneID,
                        message,
                        from: "US.13491208655302741918",
                        contact: {
                            profile: {
                                name: "test user name",
                                username: "@testusername"
                            },
                            wa_id: undefined,
                            user_id: "US.13491208655302741918",
                            parent_user_id: undefined
                        },
                        recipient: {
                            phone: undefined,
                            bsuid: "US.13491208655302741918"
                        }
                    });
                });
            });

            describe("With phone and username", () => {
                it("has parent bsuid", async () => {
                    const payload = complete_payload({
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "16505551111",
                                phone_number_id: "123456123"
                            },
                            contacts: [
                                {
                                    profile: {
                                        name: "test user name",
                                        username: "@testusername"
                                    },
                                    wa_id: "16315551181",
                                    user_id: "US.13491208655302741918",
                                    parent_user_id: "US.ENT.506847293015824"
                                }
                            ],
                            messages: [
                                {
                                    id: "ABGGFlA5Fpa",
                                    timestamp: "1504902988",
                                    from: "16315551181",
                                    from_user_id: "US.13491208655302741918",
                                    from_parent_user_id:
                                        "US.ENT.506847293015824",
                                    type: "text",
                                    text: {
                                        body: "this is a text message"
                                    }
                                }
                            ]
                        }
                    });

                    await whatsapp.post(payload);

                    // @ts-expect-error Callback is defined with spy
                    assert.calledOnceWithMatch(whatsapp.on.message, {
                        phoneID,
                        message,
                        from: "16315551181",
                        contact: {
                            profile: {
                                name: "test user name",
                                username: "@testusername"
                            },
                            wa_id: "16315551181",
                            user_id: "US.13491208655302741918",
                            parent_user_id: "US.ENT.506847293015824"
                        },
                        recipient: {
                            phone: "16315551181",
                            bsuid: "US.13491208655302741918",
                            pbsuid: "US.ENT.506847293015824"
                        }
                    });
                });

                it("doesn't have parent bsuid", async () => {
                    const payload = complete_payload({
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "16505551111",
                                phone_number_id: "123456123"
                            },
                            contacts: [
                                {
                                    profile: {
                                        name: "test user name",
                                        username: "@testusername"
                                    },
                                    wa_id: "16315551181",
                                    user_id: "US.13491208655302741918"
                                }
                            ],
                            messages: [
                                {
                                    id: "ABGGFlA5Fpa",
                                    timestamp: "1504902988",
                                    from: "16315551181",
                                    from_user_id: "US.13491208655302741918",
                                    type: "text",
                                    text: {
                                        body: "this is a text message"
                                    }
                                }
                            ]
                        }
                    });

                    await whatsapp.post(payload);

                    // @ts-expect-error Callback is defined with spy
                    assert.calledOnceWithMatch(whatsapp.on.message, {
                        phoneID,
                        message,
                        from: "16315551181",
                        contact: {
                            profile: {
                                name: "test user name",
                                username: "@testusername"
                            },
                            wa_id: "16315551181",
                            user_id: "US.13491208655302741918",
                            parent_user_id: undefined
                        },
                        recipient: {
                            phone: "16315551181",
                            bsuid: "US.13491208655302741918"
                        }
                    });
                });
            });
        });

        describe("Contacts message", () => {
            const message = {
                type: "contacts",
                contacts: [
                    {
                        name: {
                            first_name: "Jane",
                            last_name: "Doe",
                            formatted_name: "Jane Doe"
                        },
                        phones: [
                            {
                                phone: "12185551765",
                                wa_id: "12185551765",
                                type: "MOBILE"
                            }
                        ],
                        vcard: null,
                        origin: "contact_request"
                    }
                ]
            };

            /**
             * @type {import("node:test").Mock<import("../lib/emitters.js").OnMessage<void>>}
             */
            let messageSpy;
            beforeEach(() => {
                messageSpy = mock.fn();
                whatsapp.on.message = messageSpy;
            });

            it("has parent bsuid", async () => {
                const payload = complete_payload({
                    field: "messages",
                    value: {
                        messaging_product: "whatsapp",
                        metadata: {
                            display_phone_number: "16505551111",
                            phone_number_id: "123456123"
                        },
                        contacts: [
                            {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            }
                        ],
                        messages: [
                            {
                                id: "ABGGFlA5Fpa",
                                timestamp: "1504902988",
                                from_user_id: "US.13491208655302741918",
                                from_parent_user_id: "US.ENT.506847293015824",
                                type: "contacts",
                                contacts: [
                                    {
                                        name: {
                                            first_name: "Jane",
                                            last_name: "Doe",
                                            formatted_name: "Jane Doe"
                                        },
                                        phones: [
                                            {
                                                phone: "12185551765",
                                                wa_id: "12185551765",
                                                type: "MOBILE"
                                            }
                                        ],
                                        vcard: null,
                                        origin: "contact_request"
                                    }
                                ]
                            }
                        ]
                    }
                });

                await whatsapp.post(payload);

                const args = messageSpy.mock.calls[0].arguments;

                strictEqual(messageSpy.mock.callCount(), 1);
                partialDeepStrictEqual(args, [
                    {
                        phoneID,
                        message,
                        contact: {
                            profile: {
                                name: "test user name",
                                username: "@testusername"
                            },
                            wa_id: undefined,
                            user_id: "US.13491208655302741918",
                            parent_user_id: "US.ENT.506847293015824"
                        },
                        recipient: {
                            phone: undefined,
                            bsuid: "US.13491208655302741918",
                            pbsuid: "US.ENT.506847293015824"
                        }
                    }
                ]);
            });

            it("doesn't have parent bsuid", async () => {
                const payload = complete_payload({
                    field: "messages",
                    value: {
                        messaging_product: "whatsapp",
                        metadata: {
                            display_phone_number: "16505551111",
                            phone_number_id: "123456123"
                        },
                        contacts: [
                            {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                user_id: "US.13491208655302741918"
                            }
                        ],
                        messages: [
                            {
                                id: "ABGGFlA5Fpa",
                                timestamp: "1504902988",
                                from_user_id: "US.13491208655302741918",
                                type: "contacts",
                                contacts: [
                                    {
                                        name: {
                                            first_name: "Jane",
                                            last_name: "Doe",
                                            formatted_name: "Jane Doe"
                                        },
                                        phones: [
                                            {
                                                phone: "12185551765",
                                                wa_id: "12185551765",
                                                type: "MOBILE"
                                            }
                                        ],
                                        vcard: null,
                                        origin: "contact_request"
                                    }
                                ]
                            }
                        ]
                    }
                });

                await whatsapp.post(payload);

                const args = messageSpy.mock.calls[0].arguments;

                strictEqual(messageSpy.mock.callCount(), 1);
                partialDeepStrictEqual(args, [
                    {
                        phoneID,
                        message,
                        contact: {
                            profile: {
                                name: "test user name",
                                username: "@testusername"
                            },
                            wa_id: undefined,
                            user_id: "US.13491208655302741918",
                            parent_user_id: undefined
                        },
                        recipient: {
                            phone: undefined,
                            bsuid: "US.13491208655302741918",
                            pbsuid: undefined
                        }
                    }
                ]);
            });
        });

        describe("Sent status", () => {
            describe("With phone", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });

            describe("With username", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: undefined,
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: undefined,
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: undefined,
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: undefined,
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });

            describe("With phone and username", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "sent",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        },
                                        pricing: {
                                            billable: true,
                                            pricing_model: "PMP",
                                            type: "regular",
                                            category: "marketing"
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });
        });

        describe("Delivered status", () => {
            describe("With phone", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });

            describe("With username", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: undefined,
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: undefined,
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: undefined,
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: undefined,
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });

            describe("With phone and username", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "delivered",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        conversation: {
                                            id: "CONVERSATION_ID",
                                            expiration_timestamp: "1504903988",
                                            origin: {
                                                type: "marketing"
                                            }
                                        }
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });
        });

        describe("Read status", () => {
            describe("With phone", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: undefined
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });

            describe("With username", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: undefined,
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: undefined,
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: undefined,
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: undefined,
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });

            describe("With phone and username", () => {
                describe("Has parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918",
                                        recipient_parent_user_id:
                                            "US.ENT.506847293015824"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918",
                                        parent_user_id: "US.ENT.506847293015824"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: "US.ENT.506847293015824"
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918",
                                pbsuid: "US.ENT.506847293015824"
                            }
                        });
                    });
                });

                describe("Doesn't have parent bsuid", () => {
                    it("was sent to phone", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_id: "16315551181"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });

                    it("was sent to bsuid", async () => {
                        const payload = complete_payload({
                            field: "messages",
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551111",
                                    phone_number_id: "123456123"
                                },
                                statuses: [
                                    {
                                        id: "ABGGFlA5Fpa",
                                        status: "read",
                                        timestamp: "1504902988",
                                        recipient_user_id:
                                            "US.13491208655302741918"
                                    }
                                ],
                                contacts: [
                                    {
                                        profile: {
                                            name: "test user name",
                                            username: "@testusername"
                                        },
                                        wa_id: "16315551181",
                                        user_id: "US.13491208655302741918"
                                    }
                                ]
                            }
                        });

                        await whatsapp.post(payload);

                        // @ts-expect-error Callback is defined with spy
                        assert.calledOnceWithMatch(whatsapp.on.status, {
                            phoneID,
                            contact: {
                                profile: {
                                    name: "test user name",
                                    username: "@testusername"
                                },
                                wa_id: "16315551181",
                                user_id: "US.13491208655302741918",
                                parent_user_id: undefined
                            },
                            recipient: {
                                phone: "16315551181",
                                bsuid: "US.13491208655302741918"
                            }
                        });
                    });
                });
            });
        });
    });
});
