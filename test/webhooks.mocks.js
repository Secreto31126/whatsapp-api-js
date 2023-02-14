export class MessageWebhookMock {
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
            this.entry[0].changes[0].value.messages = [message];
        }

        if (name) {
            if (!this.entry[0].changes[0].value.contacts) this.entry[0].changes[0].value.contacts = [{}];
            this.entry[0].changes[0].value.contacts[0].profile = { name };
        }
    }
}

export class StatusWebhookMock {
    /**
     * Helper class to test the status post request, conditionally creating the object based on the available data
     */
    constructor(phoneID, phone, status, messageID, conversation, pricing) {
        this.object = "whatsapp_business_account";
        this.entry = [{
            id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
            changes: [{
                field: "messages",
                value: {
                    messaging_product: "whatsapp",
                    statuses: [{}],
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
            this.entry[0].changes[0].value.statuses[0].recipient_id = phone;
        }

        if (status) {
            this.entry[0].changes[0].value.statuses[0].status = status;
        }

        if (messageID) {
            this.entry[0].changes[0].value.statuses[0].id = messageID;
        }

        if (conversation) {
            this.entry[0].changes[0].value.statuses[0].conversation = conversation;
        }

        if (pricing) {
            this.entry[0].changes[0].value.statuses[0].pricing = pricing;
        }

        if (Object.keys(this.entry[0].changes[0].value.statuses[0]).length === 0) {
            this.entry[0].changes[0].value.statuses = [];
        }
    }
}
