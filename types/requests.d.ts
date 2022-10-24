/**
 * POST helper callback for messages
 */
export type onMessage = (phoneID: string, phone: string, message: any, name: string, raw: any) => any;
/**
 * POST helper callback for statuses
 */
export type onStatus = (phoneID: string, phone: string, status: string, messageID: string, conversation: any, pricing: any, raw: any) => any;
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
export function get(params: any, verify_token: string): string;
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
export function post(data: any, onMessage: onMessage, onStatus?: onStatus): number;
//# sourceMappingURL=requests.d.ts.map