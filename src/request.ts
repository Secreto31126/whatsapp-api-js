import type { ClientMessage, ClientMessageNames } from "./types";

/**
 * Request API object
 * @internal
 */
export default class MessageRequest {
    /**
     * The messaging product
     */
    messaging_product: "whatsapp";
    /**
     * The type of message
     */
    type: ClientMessageNames;
    /**
     * The user's phone number
     */
    to: string;
    /**
     * Undocumented, optional (the framework doesn't use it)
     */
    recipient_type?: "individual";
    /**
     * The message to reply to
     */
    context?: {
        /**
         * The message id to reply to
         */
        message_id: string;
    };
    /**
     * The text object stringified
     */
    text?: string;
    /**
     * The audio object stringified
     */
    audio?: string;
    /**
     * The document object stringified
     */
    document?: string;
    /**
     * The image object stringified
     */
    image?: string;
    /**
     * The sticker object stringified
     */
    sticker?: string;
    /**
     * The video object stringified
     */
    video?: string;
    /**
     * The location object stringified
     */
    location?: string;
    /**
     * The contacts object stringified
     */
    contacts?: string;
    /**
     * The interactive object stringified
     */
    interactive?: string;
    /**
     * The template object stringified
     */
    template?: string;
    /**
     * The reaction object stringified
     */
    reaction?: string;

    /**
     * Create a Request object for the API
     *
     * @param object - The object to send
     * @param to - The user's phone number
     * @param context - The message_id to reply to
     */
    constructor(object: ClientMessage, to: string, context?: string) {
        const message = { ...object };

        if (!message._) {
            throw new Error(
                "Unexpected internal error (object._ is not defined)"
            );
        }

        this.messaging_product = "whatsapp";
        this.type = message._;
        delete message._;
        this.to = to;

        if (context) this.context = { message_id: context };

        // If the object contains its name as a property, it means it's an array, use it, else use the class
        // This horrible thing comes from Contacts, the only API element which must be an array instead of an object...
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - I'm not in the mood to fix this
        this[this.type] = JSON.stringify(message[this.type] ?? message);
    }
}
