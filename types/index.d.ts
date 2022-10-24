/**
 * The main API object
 *
 * @property {String} token The API token
 * @property {String} v The API version to use
 * @property {Boolean} parsed If truthy, API operations will return the fetch promise instead. Intended for low level debugging.
 */
export class WhatsAppAPI {
    /**
     * Initiate the Whatsapp API app
     *
     * @param {String} token The API token, given at setup. It can be either a temporal token or a permanent one.
     * @param {String} v The version of the API, defaults to v14.0
     * @param {Boolean} parsed Whether to return a pre-processed response from the API or the raw fetch response. Intended for low level debugging.
     * @throws {Error} If token is not specified
     */
    constructor(token: string, v?: string, parsed?: boolean);
    token: string;
    v: string;
    parsed: boolean;
    /**
     * @type {Logger}
     * @private
    */
    private _register;
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
    logSentMessages(callback?: (phoneID: string, to: string, object: (Text | Audio | Document | Image | Sticker | Video | Location | Contacts | Interactive | Template | Reaction), request: api.Request, id: (string | void), response: (any | void)) => any): WhatsAppAPI;
    /**
     * Send a Whatsapp message
     *
     * @param {String} phoneID The bot's phone ID
     * @param {String} to The user's phone number
     * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive|Template|Reaction)} object A Whatsapp component, built using the corresponding module for each type of message.
     * @param {String} [context] The message ID of the message to reply to
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If to is not specified
     * @throws {Error} If object is not specified
     */
    sendMessage(phoneID: string, to: string, object: (Text | Audio | Document | Image | Sticker | Video | Location | Contacts | Interactive | Template | Reaction), context?: string): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Mark a message as read
     *
     * @param {String} phoneID The bot's phone ID
     * @param {String} messageId The message ID
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If messageId is not specified
     */
    markAsRead(phoneID: string, messageId: string): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Generate a QR code for sharing the bot
     *
     * @param {String} phoneID The bot's phone ID
     * @param {String} message The quick message on the QR code
     * @param {("png"|"svg")} format The format of the QR code
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If message is not specified
     * @throws {Error} If format is not either 'png' or 'svn'
     */
    createQR(phoneID: string, message: string, format?: ("png" | "svg")): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Get one or many QR codes of the bot
     *
     * @param {String} phoneID The bot's phone ID
     * @param {String} [id] The QR's id to find. If not specified, all QRs will be returned
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If phoneID is not specified
     */
    retrieveQR(phoneID: string, id?: string): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Update a QR code of the bot
     *
     * @param {String} phoneID The bot's phone ID
     * @param {String} id The QR's id to edit
     * @param {String} message The new quick message for the QR code
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If id is not specified
     * @throws {Error} If message is not specified
     */
    updateQR(phoneID: string, id: string, message: string): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Delete a QR code of the bot
     *
     * @param {String} phoneID The bot's phone ID
     * @param {String} id The QR's id to delete
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If id is not specified
     */
    deleteQR(phoneID: string, id: string): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Get a Media object data with an ID
     *
     * @param {String} id The Media's ID
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If id is not specified
     */
    retrieveMedia(id: string): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Upload a Media to the server
     *
     * @param {String} phoneID The bot's phone ID
     * @param {(FormData|import("undici/types/formdata").FormData)} form The Media's FormData. Must have a 'file' property with the file to upload as a blob and a valid mime-type in the 'type' field of the blob. Example for Node ^18: new FormData().set("file", new Blob([stringOrFileBuffer], "image/png")); Previous versions of Node will need an external FormData, such as undici's, which is the ponyfill of this package for the fetch method. To use non spec complaints versions of FormData (eg: form-data) or Blob set the 'check' parameter to false.
     * @param {Boolean} check If the FormData should be checked before uploading. The FormData must have the method .get("name") to work with the checks. If it doesn't (for example, using the module "form-data"), set this to false.
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If phoneID is not specified
     * @throws {Error} If form is not specified
     * @throws {TypeError} If check is set to true, the FormData class exists in the enviroment and form is not a FormData
     * @throws {Error} If check is set to true and the form doesn't have valid required properties (file, type)
     * @throws {Error} If check is set to true and the form file is too big for the file type
     * @example
     * const { WhatsAppAPI } = require('./index');
     * const Whatsapp = new WhatsAppAPI("token");
     *
     * // If required:
     * // const formdata = require('undici').FormData;
     * // const blob = require("node:buffer").Blob;
     *
     * const form = new FormData();
     *
     * // If you don't mind reading the whole file into memory:
     * form.set("file", new Blob([fs.readFileSync("image.png")], "image/png"));
     *
     * // If you do, you will need to use streams. The module 'form-data',
     * // although not spec compliant (hence needing to set check to false),
     * // has an easy way to do this:
     * // form.append("file", fs.createReadStream("image.png"), { contentType: "image/png" });
     *
     * Whatsapp.uploadMedia("phoneID", form).then(console.log);
     * // Expected output: { id: "mediaID" }
     */
    uploadMedia(phoneID: string, form: (FormData | import("undici/types/formdata").FormData), check?: boolean): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Get a Media fetch from an url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @param {String} url The Media's url
     * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch raw response
     * @throws {TypeError} If url is not a valid url
     * @example
     * const { WhatsAppAPI } = require('whatsapp-api-js');
     * const Whatsapp = new WhatsAppAPI("token");
     *
     * const id = "mediaID";
     * const url = Whatsapp.retrieveMedia(id).then(data => {
     *     const response = Whatsapp.fetchMedia(data.url);
     * });
     */
    fetchMedia(url: string): Promise<Response | import("undici/types/fetch").Response>;
    /**
     * Delete a Media object with an ID
     *
     * @param {String} id The Media's ID
     * @returns {Promise<Object|Response|import("undici/types/fetch").Response>} The server response
     * @throws {Error} If id is not specified
     */
    deleteMedia(id: string): Promise<any | Response | import("undici/types/fetch").Response>;
    /**
     * Make an authenticated request to any url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @param {(URL|String)} url The url to request to
     * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch response
     * @throws {Error} If url is not specified
     */
    _authenicatedRequest(url: (URL | string)): Promise<Response | import("undici/types/fetch").Response>;
}
import Text_2 = require("./messages/text");
import { Audio } from "./messages/media";
import { Document } from "./messages/media";
import { Image } from "./messages/media";
import { Sticker } from "./messages/media";
import { Video } from "./messages/media";
import Location_2 = require("./messages/location");
import { Contacts_1 } from "./messages/contacts";
import { Interactive_1 } from "./messages/interactive";
import { Template_1 } from "./messages/template";
import Reaction_2 = require("./messages/reaction");
import api = require("./fetch");
export declare const Handlers: typeof import("./requests");
export declare namespace Types {
    const Contacts: typeof import("./messages/contacts");
    const Interactive: typeof import("./messages/interactive");
    const Location: typeof import("./messages/location");
    const Media: typeof import("./messages/media");
    const Reaction: typeof import("./messages/reaction");
    const Template: typeof import("./messages/template");
    const Text: typeof import("./messages/text");
}
//# sourceMappingURL=index.d.ts.map