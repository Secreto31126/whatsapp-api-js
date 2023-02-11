import type {
    ServerConversation,
    ServerError,
    ServerMessage,
    ServerPricing,
    PostData
} from "./types";

/**
 * Callback for "sent" event
 *
 * @param phoneID - The bot's phoneID from where the message was sent
 * @param to - The user's phone number
 * @param object - The message object
 * @param request - The object sent to the server
 * @param id - The message id, undefined if parsed is set to false
 * @param response - The parsed response from the server, undefined if parsed is set to false
 */
export type OnSent = ({
    phoneID,
    to,
    object,
    request,
    id,
    response
}: {
    phoneID: string;
    to: string;
    object: ServerMessage;
    request: any;
    id?: string;
    response?: any;
}) => void;

/**
 * Callback for "message" event
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
    raw: PostData
) => void;

/**
 * Callback for "status" event
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
    raw: PostData
) => void;
