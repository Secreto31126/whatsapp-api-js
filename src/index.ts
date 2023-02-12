import type {
    PostData,
    GetParams,
    ClientMessage,
    ServerMessageResponse,
    ServerMarkAsReadResponse,
    ServerMediaRetrieveResponse,
    ServerMediaUploadResponse,
    ServerMediaDeleteResponse
} from "./types";
import type { OnSentArgs } from "./emitters";

import type { fetch as FetchType, Response } from "undici/types/fetch";
import type { Blob } from "node:buffer";
import type { BinaryLike } from "node:crypto";

import * as api from "./fetch";
import { post, get } from "./requests";

import { FormData } from "undici/types/formdata";

import EventEmitter from "node:events";
import { createHmac } from "node:crypto";

/**
 * The main API Class
 */
export default class WhatsAppAPI extends EventEmitter {
    /**
     * The API token
     */
    token: string;
    /**
     * The app secret
     */
    appSecret: string;
    /**
     * The webhook verify token
     */
    webhookVerifyToken?: string;
    /**
     * The API version to use
     */
    v: string;
    /**
     * The fetch function for the requests
     */
    fetch: typeof FetchType;
    /**
     * If truthy, API operations will return the fetch promise instead. Intended for low level debugging.
     */
    parsed: boolean;
    /**
     *
     */
    secure: boolean;

    /**
     * Initiate the Whatsapp API app
     *
     * @param token - The API token, given at setup. It can be either a temporal token or a permanent one.
     * @param appSecret - The app secret, given at setup.
     * @param webhookVerifyToken - The webhook verify token, configured at setup.
     * @param v - The version of the API, defaults to v16.0
     * @param parsed - Whether to return a pre-processed response from the API or the raw fetch response. Intended for low level debugging.
     * @throws If token is not specified
     * @throws If fetch is not defined in the enviroment or the provided ponyfill isn't a function.
     */
    constructor({
        token,
        appSecret,
        webhookVerifyToken,
        v = "v16.0",
        parsed = true,
        secure = true,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - fetch might not be defined in the enviroment, hence giving the option to provide a ponyfill
        ponyfill = fetch
    }: {
        token: string;
        appSecret: string;
        webhookVerifyToken?: string;
        v: string;
        parsed: boolean;
        secure: boolean;
        ponyfill: typeof FetchType;
    }) {
        if (!token) throw new Error("Token must be specified");
        if (!ponyfill || typeof ponyfill !== "function")
            throw new Error(
                "fetch is not defined in the enviroment, please provide a ponyfill function with the parameter { ponyfill }."
            );

        super();

        this.token = token;
        this.appSecret = appSecret;
        this.webhookVerifyToken = webhookVerifyToken;
        this.v = v;
        this.fetch = ponyfill;
        this.parsed = parsed;
        this.secure = secure;
    }

    /**
     * Send a Whatsapp message
     *
     * @param phoneID - The bot's phone ID
     * @param to - The user's phone number
     * @param message - A Whatsapp component, built using the corresponding module for each type of message.
     * @param context - The message ID of the message to reply to
     * @returns The server response
     * @throws If phoneID is not specified
     * @throws If to is not specified
     * @throws If message is not specified
     */
    async sendMessage(
        phoneID: string,
        to: string,
        message: ClientMessage,
        context?: string
    ): Promise<ServerMessageResponse | Response> {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!to) throw new Error("To must be specified");
        if (!message) throw new Error("Message must be specified");

        const { request, promise } = api.sendMessage(
            this.token,
            this.v,
            phoneID,
            to,
            message,
            context
        );

        const response = this.parsed
            ? ((await (await promise).json()) as ServerMessageResponse)
            : undefined;

        this.emit("sent", {
            phoneID,
            to: request.to,
            message: JSON.parse(request[request.type] as string),
            request,
            id: response
                ? "messages" in response
                    ? response.messages[0].id
                    : undefined
                : undefined,
            response: response ? response : undefined
        } as OnSentArgs);

        return response ?? promise;
    }

    /**
     * Mark a message as read
     *
     * @param phoneID - The bot's phone ID
     * @param messageId - The message ID
     * @returns The server response
     * @throws If phoneID is not specified
     * @throws If messageId is not specified
     */
    async markAsRead(
        phoneID: string,
        messageId: string
    ): Promise<ServerMarkAsReadResponse | Response> {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!messageId) throw new Error("To must be specified");
        const promise = api.readMessage(this.token, this.v, phoneID, messageId);
        return this.parsed
            ? ((await (await promise).json()) as ServerMarkAsReadResponse)
            : promise;
    }

    /**
     * Generate a QR code for sharing the bot
     *
     * @param phoneID - The bot's phone ID
     * @param message - The quick message on the QR code
     * @param format - The format of the QR code
     * @returns The server response
     * @throws If phoneID is not specified
     * @throws If message is not specified
     * @throws If format is not either 'png' or 'svn'
     */
    async createQR(
        phoneID: string,
        message: string,
        format: "png" | "svg" = "png"
    ): Promise<object | Response> {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!message) throw new Error("Message must be specified");
        if (!["png", "svg"].includes(format))
            throw new Error("Format must be either 'png' or 'svg'");
        const promise = api.makeQR(
            this.token,
            this.v,
            phoneID,
            message,
            format
        );
        return this.parsed ? ((await (await promise).json()) as {}) : promise;
    }

    /**
     * Get one or many QR codes of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to find. If not specified, all QRs will be returned
     * @returns The server response
     * @throws If phoneID is not specified
     */
    async retrieveQR(phoneID: string, id?: string): Promise<object | Response> {
        if (!phoneID) throw new Error("Phone ID must be specified");
        const promise = api.getQR(this.token, this.v, phoneID, id);
        return this.parsed ? ((await (await promise).json()) as {}) : promise;
    }

    /**
     * Update a QR code of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to edit
     * @param message - The new quick message for the QR code
     * @returns The server response
     * @throws If phoneID is not specified
     * @throws If id is not specified
     * @throws If message is not specified
     */
    async updateQR(
        phoneID: string,
        id: string,
        message: string
    ): Promise<object | Response> {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!id) throw new Error("ID must be specified");
        if (!message) throw new Error("Message must be specified");
        const promise = api.updateQR(this.token, this.v, phoneID, id, message);
        return this.parsed ? ((await (await promise).json()) as {}) : promise;
    }

    /**
     * Delete a QR code of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to delete
     * @returns The server response
     * @throws If phoneID is not specified
     * @throws If id is not specified
     */
    async deleteQR(phoneID: string, id: string): Promise<object | Response> {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!id) throw new Error("ID must be specified");
        const promise = api.deleteQR(this.token, this.v, phoneID, id);
        return this.parsed ? ((await (await promise).json()) as {}) : promise;
    }

    /**
     * Get a Media object data with an ID
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     * @throws If id is not specified
     */
    async retrieveMedia(
        id: string,
        phoneID?: string
    ): Promise<ServerMediaRetrieveResponse | Response> {
        if (!id) throw new Error("ID must be specified");
        const promise = api.getMedia(this.token, this.v, id, phoneID);
        return this.parsed
            ? (promise.then((e) =>
                  e.json()
              ) as Promise<ServerMediaRetrieveResponse>)
            : promise;
    }

    /**
     * Upload a Media to the server
     *
     * @param phoneID - The bot's phone ID
     * @param form - The Media's FormData. Must have a 'file' property with the file to upload as a blob and a valid mime-type in the 'type' field of the blob. Example for Node ^18: new FormData().set("file", new Blob([stringOrFileBuffer], "image/png")); Previous versions of Node will need an external FormData, such as undici's. To use non spec complaints versions of FormData (eg: form-data) or Blob set the 'check' parameter to false.
     * @param check - If the FormData should be checked before uploading. The FormData must have the method .get("name") to work with the checks. If it doesn't (for example, using the module "form-data"), set this to false.
     * @returns The server response
     * @throws If phoneID is not specified
     * @throws If form is not specified
     * @throws If check is set to true and form is not a FormData
     * @throws If check is set to true and the form doesn't have valid required properties (file, type)
     * @throws If check is set to true and the form file is too big for the file type
     * @example
     * const \{ WhatsAppAPI \} = require("whatsapp-api-js");
     * const Whatsapp = new WhatsAppAPI("token");
     *
     * // If required:
     * // const formdata = require("undici").FormData;
     * // const blob = require("node:buffer").Blob;
     *
     * const form = new FormData();
     *
     * // If you don't mind reading the whole file into memory:
     * form.set("file", new Blob([fs.readFileSync("image.png")], "image/png"));
     *
     * // If you do, you will need to use streams. The module "form-data",
     * // although not spec compliant (hence needing to set check to false),
     * // has an easy way to do this:
     * // form.append("file", fs.createReadStream("image.png"), \{ contentType: "image/png" \});
     *
     * Whatsapp.uploadMedia("phoneID", form).then(console.log);
     * // Expected output: \{ id: "mediaID" \}
     */
    async uploadMedia(
        phoneID: string,
        form: FormData,
        check = true
    ): Promise<ServerMediaUploadResponse | Response> {
        if (!phoneID) throw new Error("Phone ID must be specified");
        if (!form) throw new Error("Form must be specified");

        if (check) {
            if (!(form instanceof FormData))
                throw new TypeError(
                    "File's Form must be an instance of FormData"
                );

            const file = form.get("file") as Blob;

            if (!file.type)
                throw new Error("File's Blob must have a type specified");

            const validMediaTypes = [
                "audio/aac",
                "audio/mp4",
                "audio/mpeg",
                "audio/amr",
                "audio/ogg",
                "text/plain",
                "application/pdf",
                "application/vnd.ms-powerpoint",
                "application/msword",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "image/jpeg",
                "image/png",
                "video/mp4",
                "video/3gp",
                "image/webp"
            ];

            if (!validMediaTypes.includes(file.type))
                throw new Error(`Invalid media type: ${file.type}`);

            const validMediaSizes = {
                audio: 16_000_000,
                text: 100_000_000,
                application: 100_000_000,
                image: 5_000_000,
                video: 16_000_000,
                sticker: 500_000
            };

            const mediaType =
                file.type === "image/webp"
                    ? "sticker"
                    : (file.type.split("/")[0] as keyof typeof validMediaSizes);

            if (!(mediaType in validMediaSizes))
                throw new Error(`Invalid media type: ${file.type}`);

            if (file.size && file.size > validMediaSizes[mediaType])
                throw new Error(
                    `File is too big (${file.size} bytes) for a ${mediaType} (${validMediaSizes[mediaType]} bytes limit)`
                );
        }

        const promise = api.uploadMedia(this.token, this.v, phoneID, form);
        return this.parsed
            ? ((await (await promise).json()) as ServerMediaUploadResponse)
            : promise;
    }

    /**
     * Get a Media fetch from an url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @param url - The Media's url
     * @returns The fetch raw response
     * @throws If url is not a valid url
     * @example
     * const \{ WhatsAppAPI \} = require("whatsapp-api-js");
     * const Whatsapp = new WhatsAppAPI("token");
     *
     * const id = "mediaID";
     * const url = Whatsapp.retrieveMedia(id).then(data =\> \{
     *     const response = Whatsapp.fetchMedia(data.url);
     * \});
     */
    fetchMedia(url: string): Promise<Response> {
        // Hacky way to check if the url is valid and throw if invalid
        return this._authenicatedRequest(new URL(url));
    }

    /**
     * Delete a Media object with an ID
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     * @throws If id is not specified
     */
    async deleteMedia(
        id: string,
        phoneID?: string
    ): Promise<ServerMediaDeleteResponse | Response> {
        if (!id) throw new Error("ID must be specified");
        const promise = api.deleteMedia(this.token, this.v, id, phoneID);
        return this.parsed
            ? ((await (await promise).json()) as ServerMediaDeleteResponse)
            : promise;
    }

    /**
     * Make an authenticated request to any url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @internal
     * @param url - The url to request to
     * @returns The fetch response
     * @throws If url is not specified
     */
    _authenicatedRequest(url: URL | string): Promise<Response> {
        if (!url) throw new Error("URL must be specified");
        return api.authenticatedRequest(this.token, url);
    }

    /**
     * POST helper, must be called inside the post function of your code.
     * When setting up the webhook, only subscribe to messages. Other subscritions support might be added later.
     *
     * @param request - The request object sent by Whatsapp
     * @returns 200, it's the expected http/s response code
     * @throws 400 if the POST request isn't valid
     */
    post(request: PostData, signature?: string, rawBody?: BinaryLike): number {
        //Validating payload
        if (this.secure) {
            if (!signature || !rawBody) throw 400;

            const hash = createHmac("sha256", this.appSecret)
                .update(rawBody)
                .digest("hex");

            if (signature.split("=")[1] !== hash) throw 400;
        }

        return post(
            request,
            (message) => {
                this.emit("message", message);
            },
            (status) => {
                this.emit("status", status);
            }
        );
    }

    /**
     * GET helper, must be called inside the get function of your code.
     * Used once at the first webhook setup.
     *
     * @param request - The request object sent by Whatsapp
     * @returns The challenge string, it must be the http response body
     * @throws 500 if webhookVerifyToken is not specified
     * @throws 400 if the request is missing data
     * @throws 403 if the verification tokens don't match
     */
    get(request: GetParams): string {
        if (!this.webhookVerifyToken) throw 500;
        return get(request, this.webhookVerifyToken);
    }
}
