/** @module WhatsAppAPI */
/// <reference types="node" resolution-mode="require"/>
import type { WhatsAppAPIConstructorArguments, PostData, GetParams, ClientMessage, ClientMessageBuiltin, ServerMessageResponse, ServerMarkAsReadResponse, ServerCreateQRResponse, ServerRetrieveQRResponse, ServerUpdateQRResponse, ServerDeleteQRResponse, ServerMediaRetrieveResponse, ServerMediaUploadResponse, ServerMediaDeleteResponse } from "./types.js";
import type { OnMessage, OnSent, OnStatus } from "./emitters.js";
import type { Request, Response } from "undici";
/**
 * The main API Class
 */
export default class WhatsAppAPI {
    /**
     * The API token
     */
    private token;
    /**
     * The app secret
     */
    private appSecret?;
    /**
     * The webhook verify token
     */
    private webhookVerifyToken?;
    /**
     * The API version to use
     */
    private v;
    /**
     * The fetch function for the requests
     */
    private fetch;
    /**
     * The CryptoSubtle library for checking the signatures
     */
    private subtle?;
    /**
     * If true, API operations will return the fetch promise instead. Intended for low level debugging.
     */
    private parsed;
    /**
     * If false, the API will be used in a less secure way, reducing the need for appSecret. Defaults to true.
     */
    private secure;
    /**
     * The callbacks for the events (message, sent, status)
     *
     * @example
     * ```ts
     * const Whatsapp = new WhatsAppAPI({
     *     token: "my-token",
     *     appSecret: "my-app-secret"
     * });
     *
     * // Set the callback
     * Whatsapp.on.message = ({ from, phoneID }) => console.log(`Message from ${from} to bot ${phoneID}`);
     *
     * // Remove the callback
     * Whatsapp.on.message = undefined;
     * ```
     */
    on: {
        message?: OnMessage;
        sent?: OnSent;
        status?: OnStatus;
    };
    /**
     * Main entry point for the API.
     *
     * It's highly recommended reading the named parameters docs at
     * {@link types.TheBasicConstructorArguments},
     * at least for `token`, `appSecret` and `webhookVerifyToken` properties,
     * which are the most common in normal usage.
     *
     * The other parameters are used for fine tunning the framework,
     * such as `ponyfill`, which allows the code to execute on platforms
     * that are missing standard APIs such as fetch and crypto.
     *
     * @throws If fetch is not defined in the enviroment and the provided ponyfill isn't a function
     * @throws If secure is true, crypto.subtle is not defined in the enviroment and the provided ponyfill isn't an object
     */
    constructor({ token, appSecret, webhookVerifyToken, v, parsed, secure, ponyfill }: WhatsAppAPIConstructorArguments);
    /**
     * Send a Whatsapp message
     *
     * @param phoneID - The bot's phone ID
     * @param to - The user's phone number
     * @param message - A Whatsapp component, built using the corresponding module for each type of message.
     * @param context - The message ID of the message to reply to
     * @returns The server response
     */
    sendMessage(phoneID: string, to: string, message: ClientMessage | ClientMessageBuiltin, context?: string): Promise<ServerMessageResponse | Response>;
    /**
     * Mark a message as read
     *
     * @param phoneID - The bot's phone ID
     * @param messageId - The message ID
     * @returns The server response
     */
    markAsRead(phoneID: string, messageId: string): Promise<ServerMarkAsReadResponse | Response>;
    /**
     * Generate a QR code for sharing the bot
     *
     * @param phoneID - The bot's phone ID
     * @param message - The quick message on the QR code
     * @param format - The format of the QR code
     * @returns The server response
     */
    createQR(phoneID: string, message: string, format?: "png" | "svg"): Promise<ServerCreateQRResponse | Response>;
    /**
     * Get one or many QR codes of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to find. If not specified, all QRs will be returned
     * @returns The server response
     */
    retrieveQR(phoneID: string, id?: string): Promise<ServerRetrieveQRResponse | Response>;
    /**
     * Update a QR code of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to edit
     * @param message - The new quick message for the QR code
     * @returns The server response
     */
    updateQR(phoneID: string, id: string, message: string): Promise<ServerUpdateQRResponse | Response>;
    /**
     * Delete a QR code of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to delete
     * @returns The server response
     */
    deleteQR(phoneID: string, id: string): Promise<ServerDeleteQRResponse | Response>;
    /**
     * Get a Media object data with an ID
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     */
    retrieveMedia(id: string, phoneID?: string): Promise<ServerMediaRetrieveResponse | Response>;
    /**
     * Upload a Media to the server
     *
     * @param phoneID - The bot's phone ID
     * @param form - The Media's FormData. Must have a 'file' property with the file to upload as a blob and a valid mime-type in the 'type' field of the blob. Example for Node ^18: new FormData().set("file", new Blob([stringOrFileBuffer], "image/png")); Previous versions of Node will need an external FormData, such as undici's. To use non spec complaints versions of FormData (eg: form-data) or Blob set the 'check' parameter to false.
     * @param check - If the FormData should be checked before uploading. The FormData must have the method .get("name") to work with the checks. If it doesn't (for example, using the module "form-data"), set this to false.
     * @returns The server response
     * @throws If check is set to true and form is not a FormData
     * @throws If check is set to true and the form doesn't have valid required properties (file, type)
     * @throws If check is set to true and the form file is too big for the file type
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     *
     * const Whatsapp = new WhatsAppAPI({ token, appSecret });
     *
     * // If required:
     * // import FormData from "undici";
     * // import { Blob } from "node:buffer";
     *
     * const form = new FormData();
     *
     * // If you don't mind reading the whole file into memory:
     * form.set("file", new Blob([fs.readFileSync("image.png")], "image/png"));
     *
     * // If you do, you will need to use streams. The module "form-data",
     * // although not spec compliant (hence needing to set check to false),
     * // has an easy way to do this:
     * // form.append("file", fs.createReadStream("image.png"), { contentType: "image/png" });
     *
     * console.log(await Whatsapp.uploadMedia("phoneID", form));
     * // Expected output: { id: "mediaID" }
     * ```
     */
    uploadMedia(phoneID: string, form: unknown, check?: boolean): Promise<ServerMediaUploadResponse | Response>;
    /**
     * Get a Media fetch from an url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @param url - The Media's url
     * @returns The fetch raw response
     * @throws If url is not a valid url
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     *
     * const Whatsapp = new WhatsAppAPI({ token, appSecret });
     *
     * const id = "mediaID";
     * const { url } = await Whatsapp.retrieveMedia(id);
     * const response = Whatsapp.fetchMedia(url);
     * ```
     */
    fetchMedia(url: string): Promise<Response>;
    /**
     * Delete a Media object with an ID
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     */
    deleteMedia(id: string, phoneID?: string): Promise<ServerMediaDeleteResponse | Response>;
    /**
     * POST helper, must be called inside the post function of your code.
     * When setting up the webhook, only subscribe to messages. Other subscritions support might be added later.
     *
     * @param data - The POSTed data object sent by Whatsapp
     * @param raw_body - The raw body of the POST request
     * @param signature - The X-Hub-Signature-256 header signature sent by Whatsapp
     * @returns 200, it's the expected http/s response code
     * @throws 500 if secure and the appSecret isn't specified
     * @throws 501 if secure and crypto.subtle verify method or ponyfill isn't available
     * @throws 400 if secure and the rawBody is missing
     * @throws 401 if secure and the signature is missing
     * @throws 401 if secure and the signature doesn't match the hash
     * @throws 400 if the POSTed data is not a valid Whatsapp API request
     */
    post(data: PostData, raw_body?: string, signature?: string): Promise<200>;
    /**
     * GET helper, must be called inside the get function of your code.
     * Used once at the first webhook setup.
     *
     * @param params - The request object sent by Whatsapp
     * @returns The challenge string, it must be the http response body
     * @throws 500 if webhookVerifyToken is not specified
     * @throws 400 if the request is missing data
     * @throws 403 if the verification tokens don't match
     */
    get(params: GetParams): string;
    /**
     * Make an authenticated request to any url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @internal
     * @param url - The url to request to
     * @returns The fetch response
     * @throws If url is not specified
     */
    _authenicatedRequest(url: string | URL | Request): Promise<Response>;
    private getBody;
}
//# sourceMappingURL=index.d.ts.map