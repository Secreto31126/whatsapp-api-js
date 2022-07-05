/**
 * @package
 * @ignore
 */
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

module.exports = Message;
