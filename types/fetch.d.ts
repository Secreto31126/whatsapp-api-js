/**
 * The sendMessage response object
 */
export type SendMessageResponse = {
    /**
     * The fetch promise
     */
    promise: Promise<Response | import("undici/types/fetch").Response>;
    /**
     * The request sent to the server
     */
    request: Request;
};
/**
 * The sendMessage response object
 *
 * @package
 * @ignore
 * @typedef {Object} SendMessageResponse
 * @property {Promise<Response|import("undici/types/fetch").Response>} promise The fetch promise
 * @property {Request} request The request sent to the server
 */
/**
 * Make a message post request to the API
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {String} to The user's phone number
 * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive|Template|Reaction)} object Each type of message requires a specific type of object, for example, the "image" type requires an url and optionally captions. Use the constructors for each specific type of message (contacts, interactive, location, media, template, text)
 * @param {String} context The message id to reply to
 * @returns {SendMessageResponse} An object with the sent request and the fetch promise
 */
export function sendMessage(token: string, v: string, phoneID: string, to: string, object: (Text | Audio | Document | Image | Sticker | Video | Location | Contacts | Interactive | Template | Reaction), context: string): SendMessageResponse;
/**
 * Mark a message as read
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {String} message_id The message id
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function readMessage(token: string, v: string, phoneID: string, message_id: string): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Generate a QR code for the bot
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {String} message The default message in the QR code
 * @param {"png"|"svg"} format The image format of the QR code
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function makeQR(token: string, v: string, phoneID: string, message: string, format: "png" | "svg"): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Get one or all the QR codes for the bot
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {String} [id] The QR's id to get. If not specified, all the QR codes will be returned
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function getQR(token: string, v: string, phoneID: string, id?: string): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Update a QR code for the bot
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {String} id The QR's id to edit
 * @param {String} message The new message for the QR code
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function updateQR(token: string, v: string, phoneID: string, id: string, message: string): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Delete a QR code
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {String} id The QR's id to delete
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function deleteQR(token: string, v: string, phoneID: string, id: string): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Get a Media object
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} id The media's id
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function getMedia(token: string, v: string, id: string): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Upload a Media object
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {(FormData|import("undici/types/formdata").FormData)} form The media to upload in form format (multipart/form-data)
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function uploadMedia(token: string, v: string, phoneID: string, form: (FormData | import("undici/types/formdata").FormData)): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Delete a Media
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} id The media's id
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function deleteMedia(token: string, v: string, id: string): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Make a GET request to any url with the authorization header.
 * Be sure where you are sending the request since it contains the API token.
 *
 * @package
 * @ignore
 * @param {String} token The API token
 * @param {(String|URL)} url The URL to fetch
 * @returns {Promise<Response|import("undici/types/fetch").Response>} The fetch promise
 */
export function authenticatedRequest(token: string, url: (string | URL)): Promise<Response | import("undici/types/fetch").Response>;
/**
 * Request API object
 *
 * @property {String} messaging_product The messaging product (always "whatsapp")
 * @property {String} type The type of message
 * @property {String} to The user's phone number
 * @property {Object} [context] The message to reply to
 * @property {String} context.message_id The message id to reply to
 * @property {String} [text] The text object stringified
 * @property {String} [audio] The audio object stringified
 * @property {String} [document] The document object stringified
 * @property {String} [image] The image object stringified
 * @property {String} [sticker] The sticker object stringified
 * @property {String} [video] The video object stringified
 * @property {String} [location] The location object stringified
 * @property {String} [contacts] The contacts object stringified
 * @property {String} [interactive] The interactive object stringified
 * @property {String} [template] The template object stringified
 * @property {String} [reaction] The reaction object stringified
 */
export class Request {
    /**
     * Create a Request object for the API
     *
     * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive|Template|Reaction)} object The object to send
     * @param {String} to The user's phone number
     * @param {String} [context] The message_id to reply to
     */
    constructor(object: (Text | Audio | Document | Image | Sticker | Video | Location | Contacts | Interactive | Template | Reaction), to: string, context?: string);
    messaging_product: string;
    type: string;
    to: string;
    context: {
        message_id: string;
    };
}
import Text = require("./messages/text");
import { Audio } from "./messages/media";
import { Document } from "./messages/media";
import { Image } from "./messages/media";
import { Sticker } from "./messages/media";
import { Video } from "./messages/media";
import Location = require("./messages/location");
import { Contacts } from "./messages/contacts";
import { Interactive } from "./messages/interactive";
import { Template } from "./messages/template";
import Reaction = require("./messages/reaction");
//# sourceMappingURL=fetch.d.ts.map