import type { ClientMessage, ClientMessageNames } from "./types";
import type { Response, RequestInfo } from "undici/types/fetch";
import type { FormData } from "undici/types/formdata";

// TODO: Remove this
import { fetch } from "undici";
const req = fetch;

/**
 * Request API object
 * @internal
 */
class Request {
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

/**
 * The sendMessage response object
 */
export type SendMessageResponse = {
    /**
     * The fetch promise
     */
    promise: Promise<Response>;
    /**
     * The request sent to the server
     */
    request: Request;
};

/**
 * Make a message post request to the API
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param phoneID - The bot's phone id
 * @param to - The user's phone number
 * @param object - Each type of message requires a specific type of object, for example, the "image" type requires an url and optionally captions. Use the constructors for each specific type of message (contacts, interactive, location, media, template, text)
 * @param context - The message id to reply to
 * @returns An object with the sent request and the fetch promise
 */
export function sendMessage(
    token: string,
    v: string,
    phoneID: string,
    to: string,
    object: ClientMessage,
    context: string
): SendMessageResponse {
    const request = new Request(object, to, context);

    // Make the post request
    const promise = req(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    return { promise, request };
}

/**
 * Mark a message as read
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param phoneID - The bot's phone id
 * @param message_id - The message id
 * @returns The fetch promise
 */
export function readMessage(
    token: string,
    v: string,
    phoneID: string,
    message_id: string
): Promise<Response> {
    return req(`https://graph.facebook.com/${v}/${phoneID}/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            status: "read",
            message_id
        })
    });
}

/**
 * Generate a QR code for the bot
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param phoneID - The bot's phone id
 * @param message - The default message in the QR code
 * @param format - The image format of the QR code
 * @returns The fetch promise
 */
export function makeQR(
    token: string,
    v: string,
    phoneID: string,
    message: string,
    format: "png" | "svg"
): Promise<Response> {
    return req(
        `https://graph.facebook.com/${v}/${phoneID}/message_qrdls?generate_qr_image=${format}&prefilled_message=${message}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

/**
 * Get one or all the QR codes for the bot
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param phoneID - The bot's phone id
 * @param id - The QR's id to get. If not specified, all the QR codes will be returned
 * @returns The fetch promise
 */
export function getQR(
    token: string,
    v: string,
    phoneID: string,
    id?: string
): Promise<Response> {
    return req(
        `https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id ?? ""}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

/**
 * Update a QR code for the bot
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param phoneID - The bot's phone id
 * @param id - The QR's id to edit
 * @param message - The new message for the QR code
 * @returns The fetch promise
 */
export function updateQR(
    token: string,
    v: string,
    phoneID: string,
    id: string,
    message: string
): Promise<Response> {
    return req(
        `https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id}?prefilled_message=${message}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

/**
 * Delete a QR code
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param phoneID - The bot's phone id
 * @param id - The QR's id to delete
 * @returns - The fetch promise
 */
export function deleteQR(
    token: string,
    v: string,
    phoneID: string,
    id: string
): Promise<Response> {
    return req(
        `https://graph.facebook.com/${v}/${phoneID}/message_qrdls/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

/**
 * Get a Media object
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param id - The media's id
 * @param phone_number_id - The business phone number ID
 * @returns The fetch promise
 */
export function getMedia(
    token: string,
    v: string,
    id: string,
    phone_number_id?: string
): Promise<Response> {
    const params = phone_number_id ? `phone_number_id=${phone_number_id}` : "";

    return req(`https://graph.facebook.com/${v}/${id}?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

/**
 * Upload a Media object
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param phoneID - The bot's phone id
 * @param form - The media to upload in form format (multipart/form-data)
 * @returns The fetch promise
 */
export function uploadMedia(
    token: string,
    v: string,
    phoneID: string,
    form: FormData
): Promise<Response> {
    return req(
        `https://graph.facebook.com/${v}/${phoneID}/media?messaging_product=whatsapp`,
        {
            method: "POST",
            body: form,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );
}

/**
 * Delete a Media
 *
 * @internal
 * @param token - The API token
 * @param v - The API version
 * @param id - The media's id
 * @param phone_number_id - The business phone number ID
 * @returns The fetch promise
 */
export function deleteMedia(
    token: string,
    v: string,
    id: string,
    phone_number_id?: string
): Promise<Response> {
    const params = phone_number_id ? `phone_number_id=${phone_number_id}` : "";

    return req(`https://graph.facebook.com/${v}/${id}?${params}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

/**
 * Make a GET request to any url with the authorization header.
 * Be sure where you are sending the request since it contains the API token.
 *
 * @internal
 * @param token - The API token
 * @param url - The URL to fetch
 * @returns The fetch promise
 */
export function authenticatedRequest(
    token: string,
    url: string | RequestInfo
): Promise<Response> {
    return req(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
