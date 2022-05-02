/**
 * GET helper, must be called inside the get function of your code.
 * Used once at the first webhook setup.
 * 
 * @ignore
 * @param {Object} params The GET request parameters in object format
 * @param {String} verify_token The verification token
 * @returns {String} The challenge string, it must be the http response body
 * @throws {Number} 403 if the verification tokens don't match
 */
function get(params, verify_token) {
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
}

/**
 * POST helper, must be called inside the post function of your code.
 * When setting up the webhook, only subscribe to messages. Other subscritions support might be added later.
 * 
 * @ignore
 * @param {Object} data The post data sent by Whatsapp, already parsed to object
 * @param {Function} callback The function to be called if the post request is valid. The callback is called with the bot's phoneID {String}, the user's phone number {String}, the messages object {Object}, the username {String}, and last the raw data from the API {Object}
 * @returns {Number} 200, it's the expected http/s response code
 * @throws {Number} 400 if the POST request isn't valid
 */
function post(data, callback) {
    // Validate the webhook
    if (data.object) {
        const value = data.entry[0].changes[0].value;

        const phoneID = value.metadata.phone_number_id;

        const contact = value.contacts[0];

        const phone = contact.wa_id;
        const name = contact.profile.name;

        const message = value.messages[0];

        callback(phoneID, phone, message, name, data);

        return 200;
    } else {
        // Return a "404 Not Found" if event is not from a whatsApp API
        throw 400;
    }
}

module.exports = { get, post };
