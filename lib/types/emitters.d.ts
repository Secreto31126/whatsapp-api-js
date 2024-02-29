import type { ClientMessage, ClientMessageRequest, ServerMessage, ServerMessageResponse, ServerConversation, ServerPricing, ServerError, PostData } from "./types";
import type { WhatsAppAPI } from "./index";
/**
 * Callback for "sent" event
 *
 * @public
 * @param args - The arguments object
 */
export type OnSent = (args: OnSentArgs) => unknown;
/**
 * @public
 */
export type OnSentArgs = {
    /**
     * The bot's phoneID from where the message was sent
     */
    phoneID: string;
    /**
     * The user's phone number
     */
    to: string;
    /**
     * The message type
     */
    type: string;
    /**
     * The message object
     */
    message: ClientMessage;
    /**
     * The object sent to the server
     */
    request: ClientMessageRequest;
    /**
     * The message id, undefined if parsed is set to false
     */
    id?: string;
    /**
     * The parsed response from the server, undefined if parsed is set to false
     */
    response?: ServerMessageResponse;
};
/**
 * Callback for "message" event
 *
 * @public
 * @param args - The arguments object
 */
export type OnMessage = (args: OnMessageArgs) => unknown;
/**
 * @public
 */
export type OnMessageArgs = {
    /**
     * The bot's phoneID
     */
    phoneID: string;
    /**
     * The user's phone number
     */
    from: string;
    /**
     * The messages object
     */
    message: ServerMessage;
    /**
     * The username
     */
    name?: string;
    /**
     * The raw data from the API
     */
    raw: PostData;
    /**
     * A method to easily reply to the user who sent the message
     *
     * @param response - The message to send as a reply
     * @param context - Wether to mention the current message, defaults to false
     * @param biz_opaque_callback_data - An arbitrary 512B string, useful for tracking
     * @returns WhatsAppAPI.sendMessage return value
     */
    reply: (response: ClientMessage, context?: boolean, biz_opaque_callback_data?: string) => Promise<ServerMessageResponse | Response>;
    /**
     * The WhatsAppAPI instance that emitted the event
     */
    Whatsapp: InstanceType<typeof WhatsAppAPI>;
};
/**
 * Callback for "status" event
 *
 * @public
 * @param args - The arguments object
 */
export type OnStatus = (args: OnStatusArgs) => unknown;
/**
 * @public
 */
export type OnStatusArgs = {
    /**
     * The bot's phoneID
     */
    phoneID: string;
    /**
     * The user's phone number
     */
    phone: string;
    /**
     * The message status
     */
    status: string;
    /**
     * The message ID
     */
    id: string;
    /**
     * The conversation object
     */
    conversation?: ServerConversation;
    /**
     * The pricing object
     */
    pricing?: ServerPricing;
    /**
     * The error object
     */
    error?: ServerError;
    /**
     * Arbitrary string included in sent messages
     */
    biz_opaque_callback_data?: string;
    /**
     * The raw data from the API
     */
    raw: PostData;
};
//# sourceMappingURL=emitters.d.ts.map