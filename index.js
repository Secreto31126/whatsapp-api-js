const fetch = require('./fetch').fetch;

/**
 * The main class
 */
class WhatsAppAPI {
    /**
     * Initiate the Whatsapp API app
     * 
     * @param {String} token The API token, given at setup. It can be either a temporal token or a permanent one.
     * @param {String} v The version of the API, defaults to v13.0
     */
    constructor(token, v = "v13.0") {
        this.token = token;
        this.v = v;
    }

    /**
     * Send a Whatsapp message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive)} object A Whatsapp component, built using the corresponding module for each type of message.
     * @returns {Promise} The fetch promise
     */ 
    sendMessage(phoneID, to, object) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!to) throw new Error("To must be specified");
        if (!object) throw new Error("Message must have a message object");
        if (!object._) throw new Error("There has been a breaking update in whatsapp-api-js@0.0.4 and @0.1.0, please check the documentation for more information on how to use the new version, or downgrade using 'npm i whatsapp-api-js@0.0.3'. Sorry for any inconvenience :/");
        return fetch.messages(this.token, this.v, phoneID, to, object);
    }

    /**
     * Mark a message as read
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} messageId The message ID
     * @returns {Promise} The fetch promise
     */
    markAsRead(phoneID, messageId) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!messageId) throw new Error("To must be specified");
        return fetch.read(this.token, this.v, phoneID, messageId);
    }
}

/**
 * Document this please
 */
module.exports = {
    WhatsAppAPI,
    Handlers: require('./requests'),
    Types: {
        Contacts: require('./types/contacts'),
        Interactive: require('./types/interactive'),
        Location: require('./types/location'),
        Media: require('./types/media'),
        Template: require('./types/template'),
        Text: require('./types/text'),
    }
};
