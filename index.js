const { Contacts } = require('./types/contacts');
const { Interactive } = require("./types/interactive");
const { Audio, Document, Image, Sticker, Video } = require('./types/media');
const Location = require('./types/location');
const { Template } = require('./types/template');
const Text = require('./types/text');

const fetch = require('./fetch');

/**
 * The main API object
 * 
 * @property {String} token The API token
 * @property {String} v The API version to use
 */
class WhatsAppAPI {
    /**
     * Initiate the Whatsapp API app
     * 
     * @param {String} token The API token, given at setup. It can be either a temporal token or a permanent one.
     * @param {String} v The version of the API, defaults to v13.0
     * @throws {Error} If token is not specified
     */
    constructor(token, v = "v13.0") {
        if (!token) throw new Error("Token must be specified");
        this.token = token;
        this.v = v;
    }

    /**
     * Send a Whatsapp message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive|Template)} object A Whatsapp component, built using the corresponding module for each type of message.
     * @param {String} [context] The message ID of the message to reply to
     * @returns {Promise} The fetch promise
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If to is not specified
     * @throws {Error} If object is not specified
     */ 
    sendMessage(phoneID, to, object, context = "") {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!to) throw new Error("To must be specified");
        if (!object) throw new Error("Message must have a message object");
        return fetch.sendMessage(this.token, this.v, phoneID, to, object, context);
    }

    /**
     * Mark a message as read
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} messageId The message ID
     * @returns {Promise} The fetch promise
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If messageId is not specified
     */
    markAsRead(phoneID, messageId) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!messageId) throw new Error("To must be specified");
        return fetch.readMessage(this.token, this.v, phoneID, messageId);
    }
    
    /**
     * Generate a QR code for sharing the bot
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} message The quick message on the QR code
     * @param {String} format The format of the QR code (png or svn)
     * @returns {Promise} The fetch promise
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If message is not specified
     * @throws {Error} If format is not either 'png' or 'svn'
     */
    createQR(phoneID, message, format = "png") {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!message) throw new Error("Message must be specified");
        if (!["png", "svg"].includes(format)) throw new Error("Format must be either 'png' or 'svg'");
        return fetch.makeQR(this.token, this.v, phoneID, message, format);
    }

    /**
     * Get one or many QR codes of the bot
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} [id] The QR's id to find. If not specified, all QRs will be returned
     * @returns {Promise} The fetch promise
     * @throws {Error} If phoneID is not specified
     */
    retrieveQR(phoneID, id) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        return fetch.getQR(this.token, this.v, phoneID, id);
    }

    /**
     * Update a QR code of the bot
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} id The QR's id to edit
     * @param {String} message The new quick message for the QR code
     * @returns {Promise} The fetch promise
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If id is not specified
     * @throws {Error} If message is not specified
     */
    updateQR(phoneID, id, message) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!id) throw new Error("ID must be specified");
        if (!message) throw new Error("Message must be specified");
        return fetch.updateQR(this.token, this.v, phoneID, id, message);
    }

    /**
     * Delete a QR code of the bot
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} id The QR's id to delete
     * @returns {Promise} The fetch promise
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If id is not specified
     */
    deleteQR(phoneID, id) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!id) throw new Error("ID must be specified");
        return fetch.deleteQR(this.token, this.v, phoneID, id);
    }
}

/**
 * @namespace Exports
 * @property {WhatsAppAPI}      WhatsAppAPI                     The main API object
 * @property {Object}           Handlers                        The handlers object
 * @property {Function}         Handlers.post                   The post handler
 * @property {Function}         Handlers.get                    The get handler
 * @property {Object}           Types                           The API types objects
 * @property {Object}           Types.Contacts                  The Contacts module
 * @property {Contacts}         Types.Contacts.Contacts         The API Contacts type object
 * @property {Address}          Types.Contacts.Address          The API Address type object
 * @property {Birthday}         Types.Contacts.Birthday         The API Birthday type object
 * @property {Email}            Types.Contacts.Email            The API Email type object
 * @property {Name}             Types.Contacts.Name             The API Name type object
 * @property {Organization}     Types.Contacts.Organization     The API Organization type object
 * @property {Phone}            Types.Contacts.Phone            The API Phone type object
 * @property {Url}              Types.Contacts.Url              The API Url type object
 * @property {Object}           Types.Interactive               The Interactive module
 * @property {Interactive}      Types.Interactive.Interactive   The API Interactive type object
 * @property {Body}             Types.Interactive.Body          The API Body type object
 * @property {Footer}           Types.Interactive.Footer        The API Footer type object
 * @property {Header}           Types.Interactive.Header        The API Header type object
 * @property {ActionList}       Types.Interactive.ActionList    The API Action type object
 * @property {Section}          Types.Interactive.Section       The API Section type object
 * @property {Row}              Types.Interactive.Row           The API Row type object
 * @property {ActionButtons}    Types.Interactive.ActionButtons The API Action type object
 * @property {Button}           Types.Interactive.Button        The API Button type object
 * @property {Location}         Types.Location                  The API Location type object
 * @property {Object}           Types.Media                     The Media module
 * @property {Media}            Types.Media.Media               Placeholder, don't use
 * @property {Audio}            Types.Media.Audio               The API Audio type object
 * @property {Document}         Types.Media.Document            The API Document type object
 * @property {Image}            Types.Media.Image               The API Image type object
 * @property {Sticker}          Types.Media.Sticker             The API Sticker type object
 * @property {Video}            Types.Media.Video               The API Video type object
 * @property {Object}           Types.Template                  The Template module
 * @property {Template}         Types.Template.Template         The API Template type object
 * @property {Language}         Types.Template.Language         The API Language type object
 * @property {ButtonComponent}  Types.Template.ButtonComponent  The API ButtonComponent type object
 * @property {ButtonParameter}  Types.Template.ButtonParameter  The API ButtonParameter type object
 * @property {HeaderComponent}  Types.Template.HeaderComponent  The API HeaderComponent type object
 * @property {BodyComponent}    Types.Template.BodyComponent    The API BodyComponent type object
 * @property {Parameter}        Types.Template.Parameter        The API Parameter type object
 * @property {Currency}         Types.Template.Currency         The API Currency type object
 * @property {DateTime}         Types.Template.DateTime         The API DateTime type object
 * @property {Text}             Types.Text                      The API Text type object
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
