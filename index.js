const Build = require('./builders').builder;
const Fetch = require('./fetch').fetch;

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
     * Send a text message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {String} body The text of the text message which can contain formatting and URLs which begin with http:// or https://
     * @param {Boolean} preview_url By default, WhatsApp recognizes URLs and makes them clickable, but you can also include a preview box with more information about the link. Set this field to true if you want to include a URL preview box. Defaults to false.
     * @returns {Promise} The fetch promise
     */
    sendTextMessage(phoneID, to, body, preview_url = false) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.text(body, preview_url));
    }

    /**
     * Send an audio message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {String} audio The audio file's link or id
     * @param {Boolean} isItAnID Whether audio is an id (true) or a link (false, default)
     * @returns {Promise} The fetch promise
     */
    sendAudioMessage(phoneID, to, audio, isItAnID = false) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("audio", audio, isItAnID));
    }

    /**
     * Send a document message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {String} document The document file's link or id
     * @param {Boolean} isItAnID Whether document is an id (true) or a link (false, default)
     * @param {String} caption Describes the specified document media
     * @param {String} filename Describes the filename for the specific document
     * @returns {Promise} The fetch promise
     */
    sendDocumentMessage(phoneID, to, document, isItAnID = false, caption, filename) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("document", document, isItAnID, caption, filename));
    }

    /**
     * Send a image message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {String} image The image file's link or id
     * @param {Boolean} isItAnID Whether document is an id (true) or a link (false, default)
     * @param {String} caption Describes the specified image media
     * @returns {Promise} The fetch promise
     */
    sendImageMessage(phoneID, to, image, isItAnID = false, caption) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("image", image, isItAnID, caption));
    }

    /**
     * Send a video message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {String} video The video file's link
     * @returns {Promise} The fetch promise
     */
    sendVideoMessage(phoneID, to, video) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("video", video));
    }

    /**
     * Send a sticker message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {String} sticker The sticker file's link
     * @returns {Promise} The fetch promise
     */
    sendStickerMessage(phoneID, to, sticker) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.media("sticker", sticker));
    }

    /**
     * Send a location message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {Number} longitude Longitude of the location
     * @param {Number} latitude Latitude of the location
     * @param {String} name Name of the location
     * @param {String} address Address of the location, only displayed if name is present
     * @returns {Promise} The fetch promise
     */
    sendLocationMessage(phoneID, to, longitude, latitude, name = undefined, address = undefined) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.location(longitude, latitude, name, address));
    }

    /**
     * Send a contact message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param  {...Array} contacts The contacts components, each element contains a contact component built using the contact's builder module. They can be: addresses, birthday, emails, name, org, phones and urls.
     * @returns {Promise} The fetch promise
     */
    sendContactsMessage(phoneID, to, ...contacts) {
        return Fetch.message(this.token, this.v, phoneID, to, Build.contacts(contacts));
    }
}

exports.WhatsApp = WhatsAppAPI;
exports.Contacts = require('./contacts').contacts;
exports.Handlers = require('./requests').handlers;
