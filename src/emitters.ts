import type {
    ClientMessage,
    ClientMessageRequest,
    ServerMessage,
    ServerMessageResponse,
    ServerConversation,
    ServerPricing,
    ServerError,
    PostData
} from "./types.d.ts";
import type { WhatsAppAPI } from "./index.d.ts";
import type { MaybePromise } from "./utils.d.ts";

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
     * If true, the message send was delayed until quality can be validated and it will
     * either be sent or dropped at this point. Undefined if parsed is set to false or
     * the message_status property is not present in the response.
     */
    held_for_quality_assessment?: boolean;
    /**
     * The parsed response from the server, undefined if parsed is set to false
     */
    response?: ServerMessageResponse;
    /**
     * Utility function for offloading code from the main thread,
     * useful for long running tasks such as AI generation
     */
    offload: typeof WhatsAppAPI.offload;
    /**
     * The WhatsAppAPI instance that emitted the event
     */
    Whatsapp: InstanceType<typeof WhatsAppAPI>;
};

/**
 * Callback for "message" event
 *
 * @public
 * @template Returns - The return type of the callback, defined by WhatsAppAPI generic parameter
 * @param args - The arguments object
 */
export type OnMessage<Returns> = (args: OnMessageArgs) => MaybePromise<Returns>;

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
     * @returns The {@link WhatsAppAPI.sendMessage} return value
     */
    reply: (
        response: ClientMessage,
        context?: boolean,
        biz_opaque_callback_data?: string
    ) => Promise<ServerMessageResponse | Response>;
    /**
     * Block the user who sent the message
     *
     * @returns The {@link WhatsAppAPI.blockUser} return value
     */
    block: () => ReturnType<WhatsAppAPI["blockUser"]>;
    /**
     * Utility function for offloading code from the main thread,
     * useful for long running tasks such as AI generation
     */
    offload: typeof WhatsAppAPI.offload;
    /**
     * The WhatsAppAPI instance that emitted the event
     */
    Whatsapp: InstanceType<typeof WhatsAppAPI>;
};

/**
 * Callback for "status" event
 *
 * @public
 * @template Returns - The return type of the callback, defined by WhatsAppAPI generic parameter
 * @param args - The arguments object
 */
export type OnStatus<Returns> = (args: OnStatusArgs) => MaybePromise<Returns>;

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
     * The message timestamp
     */
    timestamp: string;
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
    /**
     * Utility function for offloading code from the main thread,
     * useful for long running tasks such as AI generation
     */
    offload: typeof WhatsAppAPI.offload;
    /**
     * The WhatsAppAPI instance that emitted the event
     */
    Whatsapp: InstanceType<typeof WhatsAppAPI>;
};
