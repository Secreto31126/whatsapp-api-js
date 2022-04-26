const Build = require('./builders').builder;
const Fetch = require('./fetch').fetch;

class WhatsAppAPI {
    /**
     * @param {String} token The API token, given at setup, it can be either a temp token or a permanent one
     * @param {String} v The version of the API, defaults to v13.0
     */
    constructor(token, v = "v13.0") {
        this.token = token;
        this.v = v;
    }

    /**
     * Send a text message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {String} body The content of the message
     * @param {Boolean} preview_url Whether to send a link preview with the message or not, defaults to false
     * @returns {Promise} The fetch promise
     */
    sendTextMessage(phoneID, to, body, preview_url = false) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.text(body, preview_url));
    }

    /**
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {String} audio The audio file's url or id
     * @param {Boolean} isItAnID Whether the audio is an id (true) or a url (false)
     * @returns {Promise} The fetch promise
     */
    sendAudioMessage(phoneID, to, audio, isItAnID) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("audio", audio, isItAnID));
    }

    sendDocumentMessage(phoneID, to, document, isItAnID, caption = undefined, filename = undefined) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("document", document, isItAnID, caption, filename));
    }

    sendImageMessage(phoneID, to, image, isItAnID, caption = undefined) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("image", image, isItAnID, caption));
    }

    sendVideoMessage(phoneID, to, video) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("video", video));
    }

    sendStickerMessage(phoneID, to, sticker) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("sticker", sticker));
    }

    sendLocationMessage(phoneID, to, longitude, latitude, name = undefined, address = undefined) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.location(longitude, latitude, name, address));
    }

    /**
     * Send a contact message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param  {...Array} contacts Array objects, each containing contacts components built using the contact's builder module
     * @returns {Promise} The fetch promise
     */
    sendContactsMessage(phoneID, to, ...contacts) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.contacts(contacts));
    }
}

exports.WhatsApp = WhatsAppAPI;
exports.Contacts = require('./contacts').contacts;
exports.Handlers = require('./requests');
