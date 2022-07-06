/**
 * GET helper, must be called inside the get function of your code.
 * Used once at the first webhook setup.
 * 
 * @param {Object} params The GET request parameters in object format
 * @param {String} verify_token The verification token
 * @returns {String} The challenge string, it must be the http response body
 * @throws {Number} 500 if verify_token is not specified
 * @throws {Number} 400 if the request is missing data
 * @throws {Number} 403 if the verification tokens don't match
 */
function get(params, verify_token) {
    // verify_token is required
    if (!verify_token) throw 500;

    // Parse params from the webhook verification request
    let mode = params["hub.mode"];
    let token = params["hub.verify_token"];
    let challenge = params["hub.challenge"];

    // Check if a token and mode were sent
    if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === verify_token) {
            // Respond with 200 OK and challenge token from the request
            return challenge;
        } else {
            // Responds with "403 Forbidden" if verify tokens do not match
            throw 403;
        }
    }

    // Responds with "400 Bad Request" if it's missing data
    throw 400;
}

/**
 * POST helper callback for messages
 *
 * @callback onMessage
 * @param {String} phoneID The bot's phoneID
 * @param {String} phone The user's phone number
 * @param {Object} message The messages object
 * @param {String} name The username
 * @param {Object} raw The raw data from the API
 */

/**
 * POST helper callback for statuses
 *
 * @callback onStatus
 * @param {String} phoneID The bot's phoneID
 * @param {String} phone The user's phone number
 * @param {String} status The message status
 * @param {String} messageID The message ID
 * @param {Object} conversation The conversation object
 * @param {Object} pricing The pricing object
 * @param {Object} raw The raw data from the API
 */

/**
 * POST helper, must be called inside the post function of your code.
 * When setting up the webhook, only subscribe to messages. Other subscritions support might be added later.
 * 
 * @param {Object} data The post data sent by Whatsapp, already parsed to object
 * @param {onMessage} onMessage The function to be called if the post request is a valid message
 * @param {onStatus} [onStatus] The function to be called if the post request is a valid status update
 * @returns {Number} 200, it's the expected http/s response code
 * @throws {Number} 400 if the POST request isn't valid
 */
function post(data, onMessage, onStatus) {
    // Validate the webhook
    if (data.object) {
        const value = data.entry[0].changes[0].value;
        const phoneID = value.metadata.phone_number_id;

        // Check if the message is a message or a status update
        if (value.messages) {
            const contact = value.contacts[0];

            const phone = contact.wa_id;
            const name = contact.profile.name;

            const message = value.messages[0];

            onMessage(phoneID, phone, message, name, data);
        } else if (value.statuses && onStatus) {
            const statuses = value.statuses[0];
            
            const phone = statuses.recipient_id;
            const status = statuses.status;
            const messageID = statuses.id;
            const conversation = statuses.conversation;
            const pricing = statuses.pricing;
            
            onStatus(phoneID, phone, status, messageID, conversation, pricing, data);
        }

        return 200;
    } else {
        // Throw "400 Bad Request" if data is not a valid WhatsApp API request
        throw 400;
    }
}

module.exports = { get, post };
