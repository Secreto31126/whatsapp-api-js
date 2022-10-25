const { Contacts } = require("./messages/contacts");
const { Interactive } = require("./messages/interactive");
const { Audio, Document, Image, Sticker, Video } = require("./messages/media");
const Location = require("./messages/location");
const Reaction = require("./messages/reaction");
const { Template } = require("./messages/template");
const Text = require("./messages/text");

const req = require("./ponyfill").pickFetch();

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
class Request {
    /**
     * Create a Request object for the API
     *
     * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive|Template|Reaction)} object The object to send
     * @param {String} to The user's phone number
     * @param {String} [context] The message_id to reply to
     */
    constructor(object, to, context) {
        let message = { ...object };
        this.messaging_product = "whatsapp";
        this.type = message._;
        delete message._;
        this.to = to;

        if (context) this.context = { message_id: context };

        // If the object contains its name as a property, it means it's an array, use it, else use the class
        // This horrible thing comes from Contacts, the only API element which must be an array instead of an object...
        this[this.type] = JSON.stringify(message[this.type] ?? message);
    }
}

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
function sendMessage(token, v, phoneID, to, object, context) {
    const request = new Request(object, to, context);

    // Make the post request
    const promise = req(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    return { promise, request };
}

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
function readMessage(token, v, phoneID, message_id) {
    return req(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            status: "read",
            message_id
        })
    });
}

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
function makeQR(token, v, phoneID, message, format) {
    const params = {
        generate_qr_image: format,
        prefilled_message: message
    };

    return req(
        `https://graph.facebook.com/${v}/${phoneID}/message_qrdls?${new URLSearchParams(
            params
        )}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

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
function getQR(token, v, phoneID, id) {
    return req(
        `https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id ?? ""}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

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
function updateQR(token, v, phoneID, id, message) {
    const params = {
        prefilled_message: message
    };

    return req(
        `https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id}?${new URLSearchParams(
            params
        )}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

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
function deleteQR(token, v, phoneID, id) {
    return req(
        `https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

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
function getMedia(token, v, id) {
    return req(`https://graph.facebook.com/${v}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

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
function uploadMedia(token, v, phoneID, form) {
    return req(
        `https://graph.facebook.com/${v}/${phoneID}/media?messaging_product=whatsapp`,
        {
            method: "POST",
            // @ts-ignore
            body: form,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );
}

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
function deleteMedia(token, v, id) {
    return req(`https://graph.facebook.com/${v}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

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
function authenticatedRequest(token, url) {
    return req(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

module.exports = {
    sendMessage,
    readMessage,
    makeQR,
    getQR,
    updateQR,
    deleteQR,
    getMedia,
    uploadMedia,
    deleteMedia,
    authenticatedRequest,
    Request
};
