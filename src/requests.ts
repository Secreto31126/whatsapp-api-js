import type {
    ServerContacts,
    ServerConversation,
    ServerError,
    ServerMessage,
    ServerPricing,
    ServerStatus
} from "./types";

type Params = {
    "hub.mode": "subscribe";
    "hub.verify_token": string;
    "hub.challenge": string;
};

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
export function get(params: Params, verify_token: string): string {
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
 * POST helper callback for messages
 *
 * @param phoneID - The bot's phoneID
 * @param phone - The user's phone number
 * @param message - The messages object
 * @param name - The username
 * @param raw - The raw data from the API
 */
export type OnMessage = (
    phoneID: string,
    phone: string,
    message: ServerMessage,
    name: string | undefined,
    raw: Data
) => void;

/**
 * POST helper callback for statuses
 *
 * @param phoneID - The bot's phoneID
 * @param phone - The user's phone number
 * @param status - The message status
 * @param messageID - The message ID
 * @param conversation - The conversation object
 * @param pricing - The pricing object
 * @param error - The error object
 * @param raw - The raw data from the API
 */
export type OnStatus = (
    phoneID: string,
    phone: string,
    status: string,
    messageID: string,
    conversation: ServerConversation | undefined,
    pricing: ServerPricing | undefined,
    error: ServerError | undefined,
    raw: Data
) => void;

export type Data = {
    object: string;
    entry: {
        id: string;
        changes: {
            value:
                | {
                      messaging_product: "whatsapp";
                      metadata: {
                          display_phone_number: string;
                          phone_number_id: string;
                      };
                  } & (
                      | {
                            contacts: [ServerContacts];
                            messages: [ServerMessage];
                        }
                      | {
                            statuses: [
                                {
                                    id: string;
                                    status: ServerStatus;
                                    timestamp: string;
                                    recipient_id: string;
                                } & (
                                    | {
                                          conversation: ServerConversation;
                                          pricing: ServerPricing;
                                          errors: undefined;
                                      }
                                    | {
                                          conversation: undefined;
                                          pricing: undefined;
                                          errors: [ServerError];
                                      }
                                )
                            ];
                        }
                  );
            field: "messages";
        }[];
    }[];
};

/**
 * POST helper, must be called inside the post function of your code.
 * When setting up the webhook, only subscribe to messages. Other subscritions support might be added later.
 *
 * @param data - The post data sent by Whatsapp, already parsed to object
 * @param onMessage - The function to be called if the post request is a valid message
 * @param onStatus - The function to be called if the post request is a valid status update
 * @returns 200, it's the expected http/s response code
 * @throws 400 if the POST request isn't valid
 */
export function post(
    data: Data,
    onMessage: OnMessage,
    onStatus?: OnStatus
): number {
    // Validate the webhook
    if (data.object) {
        const value = data.entry[0].changes[0].value;
        const phoneID = value.metadata.phone_number_id;

        // Check if the message is a message or a status update
        if ("messages" in value) {
            const contact = value.contacts[0];

            const phone = contact.wa_id;
            const name = contact.profile.name;

            const message = value.messages[0];

            onMessage(phoneID, phone, message, name, data);
        } else if ("statuses" in value && onStatus) {
            const statuses = value.statuses[0];

            const phone = statuses.recipient_id;
            const status = statuses.status;
            const messageID = statuses.id;
            const conversation = statuses.conversation;
            const pricing = statuses.pricing;
            const error = statuses.errors?.[0];

            onStatus(
                phoneID,
                phone,
                status,
                messageID,
                conversation,
                pricing,
                error,
                data
            );
        }

        return 200;
    } else {
        // Throw "400 Bad Request" if data is not a valid WhatsApp API request
        throw 400;
    }
}
