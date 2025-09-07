import type { ClientMessage, ClientMessageRequest, ClientTypingIndicators, ServerMessage, ServerMessageResponse, ServerConversation, ServerPricing, ServerError, ServerCallConnect, ServerCallTerminate, PostData } from "./types.d.ts";
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
     * The message id
     */
    id?: string;
    /**
     * If true, the message send was delayed until quality can be validated and it will
     * either be sent or dropped at this point. Undefined if the message_status property
     * is not present in the response.
     */
    held_for_quality_assessment?: boolean;
    /**
     * The response from the server
     */
    response: ServerMessageResponse;
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
    reply: (response: ClientMessage, context?: boolean, biz_opaque_callback_data?: string) => Promise<ServerMessageResponse | Response>;
    /**
     * Mark the received message as read, and optionally display a typing indicator
     *
     * @param indicator - The type of reply indicator
     * @returns The {@link WhatsAppAPI.markAsRead} return value
     */
    received: (indicator?: ClientTypingIndicators) => ReturnType<WhatsAppAPI["markAsRead"]>;
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
/**
 * Callback for "call connect" event
 *
 * @public
 * @template Returns - The return type of the callback, defined by WhatsAppAPI generic parameter
 * @param args - The arguments object
 */
export type OnCallConnect<Returns> = (args: OnCallConnectArgs) => MaybePromise<Returns>;
/**
 * @public
 */
export type OnCallConnectArgs = {
    /**
     * The bot's phoneID
     */
    phoneID: string;
    /**
     * The user's phone number
     */
    from: string;
    /**
     * The connection call object
     */
    call: ServerCallConnect;
    /**
     * The username
     */
    name?: string;
    /**
     * The raw data from the API
     */
    raw: PostData;
    /**
     * A method to easily preaccept the call, before establishing the WebRTC connection.
     *
     * @returns The {@link WhatsAppAPI.preacceptCall} return value
     */
    preaccept: () => ReturnType<WhatsAppAPI["preacceptCall"]>;
    /**
     * A method to easily reject the call, before establishing the WebRTC connection.
     *
     * @returns The {@link WhatsAppAPI.rejectCall} return value
     */
    reject: () => ReturnType<WhatsAppAPI["rejectCall"]>;
    /**
     * A method to easily accept the call after the WebRTC connection.
     * It's strongly recommended to call {@link OnCallConnectArgs.preaccept} first
     *
     * @param biz_opaque_callback_data - An arbitrary 512B string, useful for tracking
     * @returns The {@link WhatsAppAPI.acceptCall} return value
     */
    accept: (biz_opaque_callback_data?: string) => ReturnType<WhatsAppAPI["acceptCall"]>;
    /**
     * A method to easily terminate the call, after establishing the WebRTC connection.
     *
     * @remarks This shouldn't be used within the OnCall callback, unless you expect your
     * calls to be super short, wants to lock the main loop, or will pass the function as
     * a callback to another method.
     *
     * @returns The {@link WhatsAppAPI.rejectCall} return value
     */
    terminate: () => ReturnType<WhatsAppAPI["rejectCall"]>;
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
 * Callback for "call terminate" event
 *
 * @public
 * @template Returns - The return type of the callback, defined by WhatsAppAPI generic parameter
 * @param args - The arguments object
 */
export type OnCallTerminate<Returns> = (args: OnCallTerminateArgs) => MaybePromise<Returns>;
/**
 * @public
 */
export type OnCallTerminateArgs = {
    /**
     * The bot's phoneID
     */
    phoneID: string;
    /**
     * The user's phone number
     */
    from: string;
    /**
     * The terminated call object
     */
    call: ServerCallTerminate;
    /**
     * The username
     */
    name?: string;
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
/**
 * Callback for "call status" event, triggered while initiating a call
 *
 * @public
 * @template Returns - The return type of the callback, defined by WhatsAppAPI generic parameter
 * @param args - The arguments object
 */
export type OnCallStatus<Returns> = (args: OnCallStatusArgs) => MaybePromise<Returns>;
/**
 * @public
 */
export type OnCallStatusArgs = {
    /**
     * The bot's phoneID
     */
    phoneID: string;
    /**
     * The user's phone number
     */
    phone: string;
    /**
     * The call status
     */
    status: "RINGING" | "ACCEPTED" | "REJECTED";
    /**
     * The call ID
     */
    id: `wacid.${string}`;
    /**
     * The call timestamp
     */
    timestamp: string;
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
//# sourceMappingURL=emitters.d.ts.map