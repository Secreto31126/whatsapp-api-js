const fetch = require('node-fetch');

/**
 * Make the post request to the API
 * 
 * @param token {String} The API token
 * @param v {String} The API version
 * @param phoneID {String} The bot's phone id
 * @param to {String} The user's phone number
 * @param object {Object} Each type of message requires a specific type of object, for example, the "image" type requires an url and optionally captions. Use the media constructors for each specific type (contacts*, interactive*, location, media, template*, text) *TBD
 */
function message(token, v, phoneID, to, object) {
    const body = JSON.stringify({
        messaging_product: "whatsapp",
        type: Object.keys(object)[0],
        to,
        ...object,
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

exports.fetch = { message };
