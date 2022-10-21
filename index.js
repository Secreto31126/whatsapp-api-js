// Most of these imports are here only for types checks

const { Contacts } = require('./types/contacts');
const { Interactive } = require("./types/interactive");
const { Audio, Document, Image, Sticker, Video } = require('./types/media');
const Location = require('./types/location');
const Reaction = require('./types/reaction');
const { Template } = require('./types/template');
const Text = require('./types/text');

const api = require('./fetch');

/**
 * The main API object
 * 
 * @property {String} token The API token
 * @property {String} v The API version to use
 * @property {Boolean} parsed If truthy, API operations will return the fetch promise instead. Intended for low level debugging.
 */
class WhatsAppAPI {
    /**
     * Initiate the Whatsapp API app
     * 
     * @param {String} token The API token, given at setup. It can be either a temporal token or a permanent one.
     * @param {String} v The version of the API, defaults to v14.0
     * @param {Boolean} parsed Whether to return a pre-processed response from the API or the raw fetch response. Intended for low level debugging.
     * @throws {Error} If token is not specified
     */
    constructor(token, v = "v15.0", parsed = true) {
        if (!token) throw new Error("Token must be specified");
        
        this.token = token;
        this.v = v;
        this.parsed = !!parsed;

        /** @type {Logger} */
        this._register = (..._) => {};
    }

    /**
     * Callback function after a sendMessage request is sent
     *
     * @callback Logger
     * @param {String} phoneID The bot's phoneID from where the message was sent
     * @param {String} to The user's phone number
     * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive|Template|Reaction)} object The message object
     * @param {api.Request} request The object sent to the server
     * @param {(String|Void)} id The message id, undefined if parsed is set to false
     * @param {(Object|Void)} response The parsed response from the server, undefined if parsed is set to false
     */

    /**
     * Set a callback function for sendMessage
     * 
     * @param {Logger} callback The callback function to set
     * @returns {WhatsAppAPI} The API object, for chaining
     * @throws {Error} If callback is truthy and is not a function
     */
    logSentMessages(callback = (..._) => {}) {
        if (typeof callback !== "function") throw new TypeError("Callback must be a function. To unset, call the function without parameters.");
        this._register = callback;
        return this;
    }

    /**
     * Send a Whatsapp message
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive|Template|Reaction)} object A Whatsapp component, built using the corresponding module for each type of message.
     * @param {String} [context] The message ID of the message to reply to
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If to is not specified
     * @throws {Error} If object is not specified
     */
    sendMessage(phoneID, to, object, context = "") {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!to) throw new Error("To must be specified");
        if (!object) throw new Error("Message must have a message object");

        const { request, promise } = api.sendMessage(this.token, this.v, phoneID, to, object, context);
        const response = this.parsed ? promise.then(e => e.json()) : undefined;


        if (response) {
            response.then(data => {
                const id = data?.messages ? data.messages[0]?.id : undefined;
                this._register(phoneID, request.to, JSON.parse(request[request.type]), request, id, data);
            });
        } else {
            this._register(phoneID, request.to, JSON.parse(request[request.type]), request, undefined, undefined);
        }

        return response ?? promise;
    }

    /**
     * Mark a message as read
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} messageId The message ID
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If messageId is not specified
     */
    markAsRead(phoneID, messageId) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!messageId) throw new Error("To must be specified");
        const promise = api.readMessage(this.token, this.v, phoneID, messageId);
        return this.parsed ? promise.then(e => e.json()) : promise;
    }

    /**
     * Generate a QR code for sharing the bot
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} message The quick message on the QR code
     * @param {String} format The format of the QR code (png or svn)
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If message is not specified
     * @throws {Error} If format is not either 'png' or 'svn'
     */
    createQR(phoneID, message, format = "png") {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!message) throw new Error("Message must be specified");
        if (!["png", "svg"].includes(format)) throw new Error("Format must be either 'png' or 'svg'");
        const promise = api.makeQR(this.token, this.v, phoneID, message, format);
        return this.parsed ? promise.then(e => e.json()) : promise;
    }

    /**
     * Get one or many QR codes of the bot
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} [id] The QR's id to find. If not specified, all QRs will be returned
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If phoneID is not specified
     */
    retrieveQR(phoneID, id) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        const promise = api.getQR(this.token, this.v, phoneID, id);
        return this.parsed ? promise.then(e => e.json()) : promise;
    }

    /**
     * Update a QR code of the bot
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} id The QR's id to edit
     * @param {String} message The new quick message for the QR code
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If id is not specified
     * @throws {Error} If message is not specified
     */
    updateQR(phoneID, id, message) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!id) throw new Error("ID must be specified");
        if (!message) throw new Error("Message must be specified");
        const promise = api.updateQR(this.token, this.v, phoneID, id, message);
        return this.parsed ? promise.then(e => e.json()) : promise;
    }

    /**
     * Delete a QR code of the bot
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {String} id The QR's id to delete
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If id is not specified
     */
    deleteQR(phoneID, id) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!id) throw new Error("ID must be specified");
        const promise = api.deleteQR(this.token, this.v, phoneID, id);
        return this.parsed ? promise.then(e => e.json()) : promise;
    }

    /**
     * Get a Media object data with an ID
     * 
     * @param {String} id The Media's ID
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If id is not specified
     */
    getMedia(id) {
        if (!id) throw new Error("ID must be specified");
        const promise = api.getMedia(this.token, this.v, id);
        return this.parsed ? promise.then(e => e.json()) : promise;
    }

    /**
     * Upload a Media to the server
     * 
     * @param {String} phoneID The bot's phone ID
     * @param {(FormData|import("formdata-node").FormData)} form The Media's FormData. Must have a 'file' property with the file to upload as a blob and a valid mime-type in the 'type' field of the blob. Example for Node ^18: form.append("file", new Blob([stringOrFileBuffer], "image/png")); Previous versions of Node will need a polyfill for FormData. Consider using formdata-node, since it is compliant with the standard implementation. form-data is also supported, but it doesn't have the get() method, so to use it you must set the check parameter to false. *
     * @param {Boolean} check If the FormData should be checked before uploading. The FormData must have the method .get("name") to work with the checks. If it doesn't (for example, using the module "form-data"), set this to false.
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If form is not specified
     * @throws {TypeError} If check is set to true, the FormData class exists in the enviroment and form is not a FormData
     * @throws {Error} If check is set to true and the form doesn't have valid required properties (file, type)
     * @throws {Error} If check is set to true and the form file is too big for the file type
     */
    uploadMedia(phoneID, form, check = true) {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!form) throw new Error("Form must be specified");
        
        if (check) {
            if (typeof FormData !== "undefined" && !(form instanceof FormData)) throw new TypeError(`File's Blob must be an instance of Blob, received ${form.constructor.name}`);
            
            /** @type {(Blob|import("formdata-node").Blob)} */
            // @ts-ignore
            const file = form.get("file");

            if (!file.type) throw new Error("File's Blob must have a type specified");

            const validMediaTypes = [
                "audio/aac",
                "audio/mp4",
                "audio/mpeg",
                "audio/amr",
                "audio/ogg",
                "text/plain",
                "application/pdf",
                "application/vnd.ms-powerpoint",
                "application/msword",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "image/jpeg",
                "image/png",
                "video/mp4",
                "video/3gp",
                "image/webp"
            ];

            if (!validMediaTypes.includes(file.type)) throw new Error(`Invalid media type: ${file.type}`);

            const validMediaSizes = {
                audio: 16_000_000,
                text: 100_000_000,
                application: 100_000_000,
                image: 5_000_000,
                video: 16_000_000,
                sticker: 500_000,
            };

            const mediaType = file.type === "image/webp" ? "sticker" : file.type.split("/")[0];
            if (file.size && file.size > validMediaSizes[mediaType]) throw new Error(`File is too big (${file.size} bytes) for a ${mediaType} (${validMediaSizes[mediaType]} bytes limit)`);
        }

        const promise = api.uploadMedia(this.token, this.v, phoneID, form);
        return this.parsed ? promise.then(e => e.json()) : promise;
    }

    /**
     * Get a Media fetch from an url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     * 
     * @param {String} url The Media's url
     * @returns {Promise<Response>} The fetch raw response
     * @throws {TypeError} If url is not a valid url
     */
    fetchMedia(url) {
        // Hacky way to check if the url is valid and throw if invalid
        return this._authenicatedRequest(new URL(url));
    }

    /**
     * Delete a Media object with an ID
     * 
     * @param {String} id The Media's ID
     * @returns {Promise<Object|Response>} The server response
     * @throws {Error} If id is not specified
     */
    deleteMedia(id) {
        if (!id) throw new Error("ID must be specified");
        const promise = api.deleteMedia(this.token, this.v, id);
        return this.parsed ? promise.then(e => e.json()) : promise;
    }

    /**
     * Make an authenticated request to any url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     * 
     * @param {URL} url The url to request to
     * @returns {Promise<Response>} The fetch response
     * @throws {Error} If url is not specified
     */
    _authenicatedRequest(url) {
        if (!url) throw new Error("URL must be specified");
        return api.authenticatedRequest(this.token, url);
    }
}

/**
 * @namespace Exports
 * @property {WhatsAppAPI}      WhatsAppAPI                         The main API object
 * @property {Object}           Handlers                            The handlers object
 * @property {Function}         Handlers.post                       The post handler
 * @property {Function}         Handlers.get                        The get handler
 * @property {Object}           Types                               The API types objects
 * @property {Object}           Types.Contacts                      The Contacts module
 * @property {Contacts}         Types.Contacts.Contacts             The API Contacts type object
 * @property {Address}          Types.Contacts.Address              The API Address type object
 * @property {Birthday}         Types.Contacts.Birthday             The API Birthday type object
 * @property {Email}            Types.Contacts.Email                The API Email type object
 * @property {Name}             Types.Contacts.Name                 The API Name type object
 * @property {Organization}     Types.Contacts.Organization         The API Organization type object
 * @property {Phone}            Types.Contacts.Phone                The API Phone type object
 * @property {Url}              Types.Contacts.Url                  The API Url type object
 * @property {Object}           Types.Interactive                   The Interactive module
 * @property {Interactive}      Types.Interactive.Interactive       The API Interactive type object
 * @property {Body}             Types.Interactive.Body              The API Body type object
 * @property {Footer}           Types.Interactive.Footer            The API Footer type object
 * @property {Header}           Types.Interactive.Header            The API Header type object
 * @property {ActionButtons}    Types.Interactive.ActionButtons     The API Action type object
 * @property {Button}           Types.Interactive.Button            The API Button type object
 * @property {ActionList}       Types.Interactive.ActionList        The API Action type object
 * @property {ListSection}      Types.Interactive.ListSection       The API Section type object
 * @property {Row}              Types.Interactive.Row               The API Row type object
 * @property {ActionCatalog}    Types.Interactive.ActionCatalog     The API Action type object
 * @property {ProductSection}   Types.Interactive.ProductSection    The API Section type object
 * @property {Product}          Types.Interactive.Product           The API Product type object
 * @property {Location}         Types.Location                      The API Location type object
 * @property {Object}           Types.Media                         The Media module
 * @property {Media}            Types.Media.Media                   Placeholder, don't use
 * @property {Audio}            Types.Media.Audio                   The API Audio type object
 * @property {Document}         Types.Media.Document                The API Document type object
 * @property {Image}            Types.Media.Image                   The API Image type object
 * @property {Sticker}          Types.Media.Sticker                 The API Sticker type object
 * @property {Video}            Types.Media.Video                   The API Video type object
 * @property {Reaction}         Types.Reaction                      The API Reaction type object
 * @property {Object}           Types.Template                      The Template module
 * @property {Template}         Types.Template.Template             The API Template type object
 * @property {Language}         Types.Template.Language             The API Language type object
 * @property {ButtonComponent}  Types.Template.ButtonComponent      The API ButtonComponent type object
 * @property {ButtonParameter}  Types.Template.ButtonParameter      The API ButtonParameter type object
 * @property {HeaderComponent}  Types.Template.HeaderComponent      The API HeaderComponent type object
 * @property {BodyComponent}    Types.Template.BodyComponent        The API BodyComponent type object
 * @property {Parameter}        Types.Template.Parameter            The API Parameter type object
 * @property {Currency}         Types.Template.Currency             The API Currency type object
 * @property {DateTime}         Types.Template.DateTime             The API DateTime type object
 * @property {Text}             Types.Text                          The API Text type object
 * @property {Object}           Extras                              The extras object
 * @property {Blob}             Extras.Blob                         A Blob ponyfill
 */
module.exports = {
    WhatsAppAPI,
    Handlers: require('./requests'),
    Types: {
        Contacts: require('./types/contacts'),
        Interactive: require('./types/interactive'),
        Location: require('./types/location'),
        Media: require('./types/media'),
        Reaction: require('./types/reaction'),
        Template: require('./types/template'),
        Text: require('./types/text'),
    },
    Extras: {
        Blob: require('./ponyfill').pickForm().Blob,
    }
};
