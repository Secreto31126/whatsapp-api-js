import type { OnMessage, OnStatus } from "./emitters";
import type { GetParams, PostData } from "./types";

/**
 * GET helper, must be called inside the get function of your code.
 * Used once at the first webhook setup.
 *
 * @param params - The GET request parameters in object format
 * @param verify_token - The verification token
 * @returns The challenge string, it must be the http response body
 * @throws 500 if verify_token is not specified
 * @throws 400 if the request is missing data
 * @throws 403 if the verification tokens don't match
 */
export function get(params: GetParams, verify_token: string): string {
    // verify_token is required
    if (!verify_token) throw 500;

    // Parse params from the webhook verification request
    const mode = params["hub.mode"];
    const token = params["hub.verify_token"];
    const challenge = params["hub.challenge"];

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
 * POST helper, must be called inside the post function of your code.
 * When setting up the webhook, only subscribe to messages. Other subscritions support might be added later.
 *
 * @param data - The POSTed data sent by Whatsapp, already parsed to object
 * @param onMessage - The function to be called if the post request is a valid message
 * @param onStatus - The function to be called if the post request is a valid status update
 * @returns 200, it's the expected http/s response code
 * @throws 400 if the POST request isn't valid
 */
export function post(
    data: PostData,
    onMessage: OnMessage,
    onStatus: OnStatus
): number {
    // Validate the webhook
    if (data.object) {
        const value = data.entry[0].changes[0].value;
        const phoneID = value.metadata.phone_number_id;

        // Check if the message is a message or a status update
        if ("messages" in value) {
            const contact = value.contacts[0];

            const from = contact.wa_id;
            const name = contact.profile.name;

            const message = value.messages[0];

            onMessage({ phoneID, from, message, name, raw: data });
        } else if ("statuses" in value) {
            const statuses = value.statuses[0];

            const phone = statuses.recipient_id;
            const status = statuses.status;
            const id = statuses.id;
            const conversation = statuses.conversation;
            const pricing = statuses.pricing;
            const error = statuses.errors?.[0];

            onStatus({
                phoneID,
                phone,
                status,
                id,
                conversation,
                pricing,
                error,
                raw: data
            });
        }

        return 200;
    } else {
        // Throw "400 Bad Request" if data is not a valid WhatsApp API request
        throw 400;
    }
}
