const { Contacts } = require('./types/contacts');
const { Interactive } = require("./types/interactive");
const { Audio, Document, Image, Sticker, Video } = require('./types/media');
const Location = require('./types/location');
const { Template } = require('./types/template');
const Text = require('./types/text');

const req = typeof fetch === "undefined" ? require('cross-fetch') : fetch;

/**
 * The sendMessage request object
 * 
 * @package
 * @ignore
 * @typedef {Object} Request
 * @property {String} messaging_product The messaging product (whatsapp)
 * @property {String} type The type of message
 * @property {String} to The user's phone number
 * @property {Object} [context] The message to reply to
 * @property {String} context.message_id The message id to reply to
 * @property {Text} [text] The text to send
 * @property {Audio} [audio] The audio to send
 * @property {Document} [document] The document to send
 * @property {Image} [image] The image to send
 * @property {Sticker} [sticker] The sticker to send
 * @property {Video} [video] The video to send
 * @property {Location} [location] The location to send
 * @property {Contacts} [contacts] The contacts to send
 * @property {Interactive} [interactive] The interactive to send
 * @property {Template} [template] The template to send
 */

/**
 * The sendMessage response object
 * 
 * @package
 * @ignore
 * @typedef {Object} SendMessageResponse
 * @property {Promise} promise The fetch promise
 * @property {Request} request The request sent to the server
 * @property {String} phoneID The bot's phone id
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
 * @param {(Text|Audio|Document|Image|Sticker|Video|Location|Contacts|Interactive|Template)} object Each type of message requires a specific type of object, for example, the "image" type requires an url and optionally captions. Use the constructors for each specific type of message (contacts, interactive, location, media, template, text)
 * @param {String} context The message id to reply to
 * @returns {SendMessageResponse} An object with the promise, request and phoneID
 */
function sendMessage(token, v, phoneID, to, object, message_id) {
    const type = object._;
    delete object._;

    const reply = message_id ? {
        context: {
            message_id,
        }
    } : {};

    /** @type {Request} */
    const request = {
        messaging_product: "whatsapp",
        type,
        to,
        ...reply,
        // If the object contains its name as a property, it means it's an array, use it, else use the class
        // This horrible thing comes from Contacts, the only API element which must be an array instead of an object...
        [type]: JSON.stringify(object[type] ?? object),
    };

    // Make the post request
    const promise = req(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    return { promise, request, phoneID };
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
 * @returns {Promise} The fetch promise
 */
function readMessage(token, v, phoneID, message_id) {
    return req(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            status: "read",
            message_id,
        }),
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
 * @param {String} format The image format of the QR code (png or svg)
 * @returns {Promise} The fetch promise
 */
function makeQR(token, v, phoneID, message, format) {
    const params = {
        generate_qr_image: format,
        prefilled_message: message,
    };

    return req(`https://graph.facebook.com/${v}/${phoneID}/message_qrdls?${new URLSearchParams(params)}`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
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
 * @returns {Promise} The fetch promise
 */
function getQR(token, v, phoneID, id) {
    return req(`https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id ?? ""}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
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
 * @returns {Promise} The fetch promise
 */
function updateQR(token, v, phoneID, id, message) {
    return req(`https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id}?prefilled_message=${encodeURI(message)}`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
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
 * @returns {Promise} The fetch promise
 */
function deleteQR(token, v, phoneID, id) {
    return req(`https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
}

module.exports = { sendMessage, readMessage, makeQR, getQR, updateQR, deleteQR };
