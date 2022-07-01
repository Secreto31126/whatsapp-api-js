const { Contacts } = require('./types/contacts');
const { Interactive } = require("./types/interactive");
const { Audio, Document, Image, Sticker, Video } = require('./types/media');
const Location = require('./types/location');
const { Template } = require('./types/template');
const Text = require('./types/text');

const { req } = require('./fetch-picker');

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
 * @returns {Promise} The fetch promise
 */
function sendMessage(token, v, phoneID, to, object, message_id) {
    const type = object._;
    delete object._;

    const reply = message_id ? {
        context: {
            message_id,
        }
    } : {};

    const body = JSON.stringify({
        messaging_product: "whatsapp",
        type,
        to,
        ...reply,
        // If the object contains its name as a property, it means it's an array, use it, else use the class
        // This horrible thing comes from Contacts, the only API element which must be an array instead of an object...
        [type]: JSON.stringify(object[type] ?? object),
    });

    // Make the post request
    return req(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body,
    });
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
    const params = {
        prefilled_message: message,
    };

    return req(`https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id}?${new URLSearchParams(params)}`, {
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
