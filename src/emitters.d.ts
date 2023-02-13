import type {
    ServerMessageResponse,
    ServerConversation,
    ServerError,
    ServerMessage,
    ServerPricing,
    PostData
} from "./types";

/**
 * Callback for "sent" event
 *
 * @public
 * @param args - The arguments object
 */
export type OnSent = (args: OnSentArgs) => void;

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
     * The message object
     */
    message: ServerMessage;
    /**
     * The object sent to the server
     */
    request: object;
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
export type OnMessage = (args: OnMessageArgs) => void;

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
};

/**
 * Callback for "status" event
 *
 * @public
 * @param args - The arguments object
 */
export type OnStatus = (args: OnStatusArgs) => void;

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
     * The raw data from the API
     */
    raw: PostData;
};
