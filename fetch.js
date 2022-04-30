const fetch = require('node-fetch');

/**
 * Make a message post request to the API
 * 
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {String} to The user's phone number
 * @param {Object} object Each type of message requires a specific type of object, for example, the "image" type requires an url and optionally captions. Use the constructors for each specific type of message (contacts, interactive, location, media, template*, text) *TBD
 * @returns {Promise} The fetch promise
 */
function messages(token, v, phoneID, to, object) {
    const type = object._;
    delete object._;

    const body = JSON.stringify({
        messaging_product: "whatsapp",
        type,
        to,
        // If the object contains its name as a property, it means it's an array, use it, else use the class
        // This horrible thing comes from Contacts, the only API element which must be an array instead of an object...
        [type]: JSON.stringify(object[type] ?? object),
    });

    // Make the post request
    return fetch(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
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
 * @param {String} token The API token
 * @param {String} v The API version
 * @param {String} phoneID The bot's phone id
 * @param {String} message_id The message id
 * @returns {Promise} The fetch promise
 */
function read(token, v, phoneID, message_id) {
    return fetch(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: {
            messaging_product: "whatsapp",
            status: "read",
            message_id,
        }
    });
}

exports.fetch = { messages, read };
