/** @module WhatsAppAPI */

import {
    ClientMessage,
    type WhatsAppAPIConstructorArguments,
    type PostData,
    type GetParams,
    type ClientMessageRequest,
    type ClientTypingIndicators,
    type ServerMessageResponse,
    type ServerMarkAsReadResponse,
    type ServerCreateQRResponse,
    type ServerRetrieveQRResponse,
    type ServerUpdateQRResponse,
    type ServerDeleteQRResponse,
    type ServerMediaRetrieveResponse,
    type ServerMediaUploadResponse,
    type ServerMediaDeleteResponse,
    type ServerBlockResponse,
    type ServerUnblockResponse,
    type ServerPreacceptCallResponse,
    type ServerAcceptCallResponse,
    type ServerTerminateCallResponse,
    type ServerRejectCallResponse,
    type ServerInitiateCallResponse
} from "./types.js";
import type {
    OnCallConnect,
    OnCallConnectArgs,
    OnCallStatus,
    OnCallStatusArgs,
    OnCallTerminate,
    OnCallTerminateArgs,
    OnMessage,
    OnMessageArgs,
    OnSent,
    OnSentArgs,
    OnStatus,
    OnStatusArgs
} from "./emitters.d.ts";

import { escapeUnicode, MaybePromise } from "./utils.js";
import { DEFAULT_API_VERSION } from "./types.js";
import {
    WhatsAppAPIMissingAppSecretError,
    WhatsAppAPIMissingCryptoSubtleError,
    WhatsAppAPIMissingRawBodyError,
    WhatsAppAPIMissingSignatureError,
    WhatsAppAPIMissingVerifyTokenError,
    WhatsAppAPIUnexpectedError,
    WhatsAppAPIFailedToVerifyError,
    WhatsAppAPIMissingSearchParamsError,
    WhatsAppAPIFailedToVerifyTokenError
} from "./errors.js";

/**
 * The main API Class
 *
 * @template EmittersReturnType - The return type of the emitters
 * ({@link OnMessage}, {@link OnStatus})
 */
export class WhatsAppAPI<EmittersReturnType = void> {
    //#region Properties
    /**
     * The API token
     */
    private token: string;
    /**
     * The app secret
     */
    private appSecret?: string;
    /**
     * The webhook verify token
     */
    private webhookVerifyToken?: string;
    /**
     * The API version to use
     */
    private v: string;
    /**
     * The fetch function for the requests
     */
    private fetch: typeof fetch;
    /**
     * The CryptoSubtle library for checking the signatures
     */
    private subtle?: Pick<typeof crypto.subtle, "importKey" | "sign">;
    /**
     * If false, the API will be used in a less secure way, removing the need for appSecret. Defaults to true.
     */
    private secure: boolean;
    /**
     * The callbacks for the events (message, sent, status, call)
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
     * // If you need to disable the callback:
     * // Whatsapp.on.message = undefined;
     * ```
     */
    public on: {
        message?: OnMessage<EmittersReturnType>;
        sent?: OnSent;
        status?: OnStatus<EmittersReturnType>;
        call: {
            connect?: OnCallConnect<EmittersReturnType>;
            terminate?: OnCallTerminate<EmittersReturnType>;
            status?: OnCallStatus<EmittersReturnType>;
        };
    } = {
        call: {}
    };
    //#endregion

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
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js";
     *
     * const Whatsapp = new WhatsAppAPI({
     *    token: "YOUR_TOKEN",
     *    appSecret: "YOUR_APP_SECRET"
     * });
     * ```
     *
     * @template EmittersReturnType - The return type of the emitters
     * ({@link OnMessage}, {@link OnStatus})
     *
     * @throws If fetch is not defined in the enviroment and the provided ponyfill isn't a function
     * @throws If secure is true, crypto.subtle is not defined in the enviroment and the provided ponyfill isn't an object
     */
    constructor({
        token,
        appSecret,
        webhookVerifyToken,
        v,
        secure = true,
        ponyfill = {}
    }: WhatsAppAPIConstructorArguments) {
        this.token = token;
        this.secure = !!secure;

        if (this.secure) {
            this.appSecret = appSecret;

            if (
                typeof ponyfill.subtle !== "object" &&
                (typeof crypto !== "object" ||
                    typeof crypto?.subtle !== "object")
            ) {
                throw new Error(
                    "subtle is not defined in the enviroment. Consider using a setup helper," +
                        " defined at 'whatsapp-api-js/setup', or provide a valid ponyfill" +
                        " object with the argument 'ponyfill.subtle'."
                );
            }

            // Let's hope the user is using a valid ponyfill
            this.subtle = ponyfill.subtle || crypto.subtle;
        }

        if (webhookVerifyToken) this.webhookVerifyToken = webhookVerifyToken;

        if (
            typeof ponyfill.fetch !== "function" &&
            typeof fetch !== "function"
        ) {
            throw new Error(
                "fetch is not defined in the enviroment. Consider using a setup helper," +
                    " defined at 'whatsapp-api-js/setup', or provide a valid ponyfill" +
                    " object with the argument 'ponyfill.fetch'."
            );
        }

        // Let's hope the user is using a valid ponyfill
        this.fetch = ponyfill.fetch || fetch;

        if (v) this.v = v;
        else {
            console.warn(
                `[whatsapp-api-js] Cloud API version not defined. In production, it's strongly recommended pinning it to the desired version with the "v" argument. Defaulting to "${DEFAULT_API_VERSION}".`
            );
            this.v = DEFAULT_API_VERSION;
        }
    }

    //#region Message Operations

    /**
     * Send a Whatsapp message
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js";
     * import { Text } from "whatsapp-api-js/messages/text";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET"
     * });
     *
     * Whatsapp.sendMessage(
     *     "BOT_PHONE_ID",
     *     "USER_PHONE",
     *     new Text("Hello World")
     * ).then(console.log);
     * ```
     *
     * @param phoneID - The bot's phone ID
     * @param to - The user's phone number
     * @param message - A Whatsapp message, built using the corresponding module for each type of message.
     * @param context - The message ID of the message to reply to
     * @param biz_opaque_callback_data - An arbitrary 512B string, useful for tracking (length not checked by the framework)
     * @returns The server response
     */
    async sendMessage(
        phoneID: string,
        to: string,
        message: ClientMessage,
        context?: string,
        biz_opaque_callback_data?: string
    ): Promise<ServerMessageResponse> {
        const type = message._type;

        const request = {
            messaging_product: "whatsapp",
            type,
            to
        } as ClientMessageRequest;

        request[type] = message;

        if (context) request.context = { message_id: context };
        if (biz_opaque_callback_data)
            request.biz_opaque_callback_data = biz_opaque_callback_data;

        // Make the post request
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            }
        );

        const response = await this.getBody<ServerMessageResponse>(promise);
        const has_msg = "messages" in response;

        const args: OnSentArgs = {
            phoneID,
            to,
            type,
            message,
            request,
            id: has_msg ? response.messages[0].id : undefined,
            held_for_quality_assessment: has_msg
                ? "message_status" in response.messages[0]
                    ? response.messages[0].message_status ===
                      "held_for_quality_assessment"
                    : undefined
                : undefined,
            response,
            offload: WhatsAppAPI.offload,
            Whatsapp: this
        };

        try {
            await this.on?.sent?.(args);
        } catch (error) {
            // Eh... I don't like it nor hate it
            console.error(error);
        }

        return response ?? promise;
    }

    /**
     * Send a Whatsapp message to multiple phone numbers.
     *
     * In order to avoid reaching the
     * [API rate limit](https://developers.facebook.com/docs/whatsapp/cloud-api/overview?locale=en_US#throughput),
     * this method will send the messages in batches of 50 per second by default,
     * but this can be changed using the `batch_size` and `delay` parameters.
     *
     * The API rate limit can be increased by contacting Facebook as explained
     * [here](https://developers.facebook.com/docs/whatsapp/cloud-api/overview?locale=en_US#throughput).
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js";
     * import { Text } from "whatsapp-api-js/messages/text";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET"
     * });
     *
     * const phoneID = "YOUR_BOT_NUMBER";
     * const users = ["YOUR_USER1_NUMBER", "YOUR_USER2_NUMBER"];
     * const message = new Text("Hello World");
     *
     * const responses = Whatsapp.broadcastMessage(phoneID, users, message);
     *
     * Promise.all(responses).then(console.log);
     * ```
     *
     * @param phoneID - The bot's phone ID
     * @param to - The users' phone numbers
     * @param message - A Whatsapp message, built using the corresponding module for each type of message.
     * @param batch_size - The number of messages to send per batch
     * @param delay - The delay between each batch of messages in milliseconds
     * @returns The server's responses
     * @throws if batch_size is lower than 1
     * @throws if delay is lower than 0
     */
    broadcastMessage(
        phoneID: string,
        to: string[],
        message: ClientMessage,
        batch_size: number,
        delay: number
    ): Array<ReturnType<WhatsAppAPI["sendMessage"]>>;

    /**
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js";
     * import { Text } from "whatsapp-api-js/messages/text";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET"
     * });
     *
     * const phoneID = "YOUR_BOT_NUMBER";
     * const users = [{ user: "USER1_ID" }, { user: "USER2_ID" }];
     * const message_builder = ({ user }) => [DB.fetch(user).phone, new Text(`Hello ${user}`)];
     *
     * const responses = Whatsapp.broadcastMessage(phoneID, users, message);
     *
     * Promise.all(responses).then(console.log);
     * ```
     *
     * @typeParam T - The type of the data to be used in the message builder
     * @param phoneID - The bot's phone ID
     * @param to - The users' data
     * @param message_builder - A Whatsapp message builder, it returns an array with the phone number and the message.
     * @param batch_size - The number of messages to send per batch
     * @param delay - The delay between each batch of messages in milliseconds
     * @returns The server's responses
     * @throws if batch_size is lower than 1
     * @throws if delay is lower than 0
     */
    broadcastMessage<T>(
        phoneID: string,
        to: T[],
        message_builder: (data: T) => [string, ClientMessage],
        batch_size: number,
        delay: number
    ): Array<ReturnType<WhatsAppAPI["sendMessage"]>>;

    broadcastMessage<T>(
        phoneID: string,
        to: string[] | T[],
        message_builder:
            | ClientMessage
            | ((data: T) => MaybePromise<[string, ClientMessage]>),
        batch_size = 50,
        delay = 1000
    ): Array<ReturnType<WhatsAppAPI["sendMessage"]>> {
        const responses = [] as ReturnType<WhatsAppAPI["sendMessage"]>[];

        if (batch_size < 1) {
            throw new RangeError("batch_size must be greater than 0");
        }

        if (delay < 0) {
            throw new RangeError("delay must be greater or equal to 0");
        }

        to.forEach((data, i) => {
            responses.push(
                new Promise((resolve) => {
                    setTimeout(
                        async () => {
                            let phone: string;
                            let message: ClientMessage;

                            if (message_builder instanceof ClientMessage) {
                                phone = data as string;
                                message = message_builder;
                            } else {
                                [phone, message] = await message_builder(
                                    data as T
                                );
                            }

                            this.sendMessage(phoneID, phone, message).then(
                                resolve
                            );
                        },
                        delay * ((i / batch_size) | 0)
                    );
                })
            );
        });

        return responses;
    }

    /**
     * Mark a message as read, and optionally include a reply indicator
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/typing-indicators
     *
     * @param phoneID - The bot's phone ID
     * @param messageId - The message ID
     * @param indicator - The type of reply indicator
     * @returns The server response
     */
    async markAsRead(
        phoneID: string,
        messageId: string,
        indicator?: ClientTypingIndicators
    ): Promise<ServerMarkAsReadResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    status: "read",
                    message_id: messageId,
                    typing_indicator: indicator
                        ? { type: indicator }
                        : undefined
                })
            }
        );

        return this.getBody<ServerMarkAsReadResponse>(promise);
    }

    //#endregion

    //#region Call Operations

    /**
     * Initiate a call.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#initiate-call
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param to - The callee phone number
     * @param sdp - The SDP invitation string (RFC 8866)
     * @param biz_opaque_callback_data - An arbitrary 512B string, useful for tracking (length not checked by the framework)
     * @returns The server response
     */
    async initiateCall(
        phoneID: string,
        to: string,
        sdp: string,
        biz_opaque_callback_data?: string
    ): Promise<ServerInitiateCallResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${phoneID}/calls`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to,
                    action: "connect",
                    biz_opaque_callback_data,
                    session: {
                        sdp_type: "offer",
                        sdp
                    }
                })
            }
        );

        return this.getBody<ServerInitiateCallResponse>(promise);
    }

    /**
     * Pre-accept a call, before attempting to open the WebRTC connection.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param callID - The call ID
     * @param sdp - The SDP invitation string (RFC 8866)
     * @returns The server response
     */
    async preacceptCall(
        phoneID: string,
        callID: `wacid.${string}`,
        sdp: string
    ): Promise<ServerPreacceptCallResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${phoneID}/calls`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    call_id: callID,
                    action: "pre_accept",
                    session: {
                        sdp_type: "offer",
                        sdp
                    }
                })
            }
        );

        return this.getBody<ServerPreacceptCallResponse>(promise);
    }

    /**
     * Reject a call, before attempting to open the WebRTC connection.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param callID - The call ID
     * @returns The server response
     */
    async rejectCall(
        phoneID: string,
        callID: `wacid.${string}`
    ): Promise<ServerRejectCallResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${phoneID}/calls`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    call_id: callID,
                    action: "reject"
                })
            }
        );

        return this.getBody<ServerRejectCallResponse>(promise);
    }

    /**
     * Accept a call, after opening the WebRTC connection.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param callID - The call ID
     * @param sdp - The SDP invitation string (RFC 8866)
     * @param biz_opaque_callback_data - An arbitrary 512B string, useful for tracking (length not checked by the framework)
     * @returns The server response
     */
    async acceptCall(
        phoneID: string,
        callID: `wacid.${string}`,
        sdp: string,
        biz_opaque_callback_data?: string
    ): Promise<ServerAcceptCallResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${phoneID}/calls`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    call_id: callID,
                    action: "accept",
                    biz_opaque_callback_data,
                    session: {
                        sdp_type: "offer",
                        sdp
                    }
                })
            }
        );

        return this.getBody<ServerAcceptCallResponse>(promise);
    }

    /**
     * Terminate a call.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param callID - The call ID
     * @returns The server response
     */
    async terminateCall(
        phoneID: string,
        callID: `wacid.${string}`
    ): Promise<ServerTerminateCallResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${phoneID}/calls`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    call_id: callID,
                    action: "terminate"
                })
            }
        );

        return this.getBody<ServerTerminateCallResponse>(promise);
    }

    //#endregion

    //#region QR Operations

    /**
     * Generate a QR code for sharing the bot
     *
     * @param phoneID - The bot's phone ID
     * @param message - The quick message on the QR code
     * @param format - The format of the QR code
     * @returns The server response
     */
    async createQR(
        phoneID: string,
        message: string,
        format: "png" | "svg" = "png"
    ): Promise<ServerCreateQRResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls?generate_qr_image=${format}&prefilled_message=${message}`,
            {
                method: "POST"
            }
        );

        return this.getBody<ServerCreateQRResponse>(promise);
    }

    /**
     * Get one or many QR codes of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to find. If not specified, all QRs will be returned
     * @returns The server response
     */
    async retrieveQR(
        phoneID: string,
        id?: string
    ): Promise<ServerRetrieveQRResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id ?? ""}`
        );

        return this.getBody<ServerRetrieveQRResponse>(promise);
    }

    /**
     * Update a QR code of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to edit
     * @param message - The new quick message for the QR code
     * @returns The server response
     */
    async updateQR(
        phoneID: string,
        id: string,
        message: string
    ): Promise<ServerUpdateQRResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id}?prefilled_message=${message}`,
            {
                method: "POST"
            }
        );

        return this.getBody<ServerUpdateQRResponse>(promise);
    }

    /**
     * Delete a QR code of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to delete
     * @returns The server response
     */
    async deleteQR(
        phoneID: string,
        id: string
    ): Promise<ServerDeleteQRResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id}`,
            {
                method: "DELETE"
            }
        );

        return this.getBody<ServerDeleteQRResponse>(promise);
    }

    //#endregion

    //#region Media Operations

    /**
     * Get a Media object data with an ID
     *
     * @see {@link fetchMedia}
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     */
    async retrieveMedia(
        id: string,
        phoneID?: string
    ): Promise<ServerMediaRetrieveResponse> {
        const params = phoneID ? `phone_number_id=${phoneID}` : "";
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${id}?${params}`
        );

        return this.getBody<ServerMediaRetrieveResponse>(promise);
    }

    /**
     * Upload a Media to the API server
     *
     * @example
     * ```ts
     * // author ekoeryanto on issue #322
     * import { WhatsAppAPI } from "whatsapp-api-js";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     *
     * const Whatsapp = new WhatsAppAPI({ token, appSecret });
     *
     * const url = "https://example.com/image.png";
     *
     * const image = await fetch(url);
     * const blob = await image.blob();
     *
     * // If required:
     * // import FormData from "undici";
     *
     * const form = new FormData();
     * form.set("file", blob);
     *
     * console.log(await Whatsapp.uploadMedia("phoneID", form));
     * // Expected output: { id: "mediaID" }
     * ```
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js";
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
     *
     * @param phoneID - The bot's phone ID
     * @param form - The Media's FormData. Must have a 'file' property with the file to upload as a blob and a valid mime-type in the 'type' field of the blob. Example for Node ^18: `new FormData().set("file", new Blob([stringOrFileBuffer], "image/png"));` Previous versions of Node will need an external FormData, such as undici's. To use non spec complaints versions of FormData (eg: form-data) or Blob set the 'check' parameter to false.
     * @param check - If the FormData should be checked before uploading. The FormData must have the method .get("name") to work with the checks. If it doesn't (for example, using the module "form-data"), set this to false.
     * @returns The server response
     * @throws If check is set to true and form is not a FormData
     * @throws If check is set to true and the form doesn't have valid required properties (file, type)
     * @throws If check is set to true and the form file is too big for the file type
     */
    async uploadMedia(
        phoneID: string,
        form: unknown,
        check = true
    ): Promise<ServerMediaUploadResponse> {
        if (check) {
            if (
                !form ||
                typeof form !== "object" ||
                !("get" in form) ||
                typeof form.get !== "function"
            )
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

            if (file.size && file.size > validMediaSizes[mediaType])
                throw new Error(
                    `File is too big (${file.size} bytes) for a ${mediaType} (${validMediaSizes[mediaType]} bytes limit)`
                );
        }

        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/media?messaging_product=whatsapp`,
            {
                method: "POST",
                body: form as FormData
            }
        );

        return this.getBody<ServerMediaUploadResponse>(promise);
    }

    /**
     * Get a Media fetch from an url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js";
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
     *
     * @param url - The Media's url
     * @returns The fetch raw response
     * @throws If url is not a valid url
     */
    fetchMedia(url: string): Promise<Response> {
        /**
         * Hacky way to check if the url is valid and throw if invalid
         *
         * @see https://github.com/Secreto31126/whatsapp-api-js/issues/335#issuecomment-2103814359
         */
        return this.$$apiFetch$$(new URL(url), {
            headers: {
                // Thanks @tecoad
                "User-Agent":
                    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
            }
        });
    }

    /**
     * Delete a Media object with an ID
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     */
    async deleteMedia(
        id: string,
        phoneID?: string
    ): Promise<ServerMediaDeleteResponse> {
        const params = phoneID ? `phone_number_id=${phoneID}` : "";
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${id}?${params}`,
            {
                method: "DELETE"
            }
        );

        return this.getBody<ServerMediaDeleteResponse>(promise);
    }

    // #endregion

    // #region Block Operations

    /**
     * Block a user from sending messages to the bot
     *
     * The block API has 2 restrictions:
     *  - You can only block users that have messaged your business in the last 24 hours
     *  - You can only block up to 64k users
     *
     * @param phoneID - The bot's phone ID from which to block
     * @param users - The user phone numbers to block (the API doesn't fail if it's empty)
     * @returns The server response
     */
    async blockUser(
        phoneID: string,
        ...users: string[]
    ): Promise<ServerBlockResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${phoneID}/block_users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    block_users: users.map((user) => ({ user }))
                })
            }
        );

        return this.getBody<ServerBlockResponse>(promise);
    }

    /**
     * Unblock a user from the bot's block list
     *
     * @remarks Contrary to blocking, unblocking isn't restricted by the 24 hours rule
     *
     * @param phoneID - The bot's phone ID from which to unblock
     * @param users - The user phone numbers to unblock (the API doesn't fail if it's empty)
     * @returns The server response
     */
    async unblockUser(
        phoneID: string,
        ...users: string[]
    ): Promise<ServerUnblockResponse> {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${phoneID}/block_users`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    block_users: users.map((user) => ({ user }))
                })
            }
        );

        return this.getBody<ServerUnblockResponse>(promise);
    }

    // #endregion

    // #region Webhooks

    /**
     * POST helper, must be called inside the post function of your server.
     * When setting up the webhook, you can subscribe to messages and calls.
     * Unexpected events will throw an {@link WhatsAppAPIUnexpectedError}.
     *
     * raw_body and signature are required when secure is `true` on initialization (default).
     *
     * @example
     * ```ts
     * // author arivanbastos on issue #114
     * // Simple http example implementation with Whatsapp.post() on Node@^19
     * import { WhatsAppAPI } from "whatsapp-api-js";
     * import { WhatsAppAPIError } from "whatsapp-api-js/errors";
     * import { NodeNext } from "whatsapp-api-js/setup/node";
     *
     * import { createServer } from "http";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     * const Whatsapp = new WhatsAppAPI<number>(NodeNext({ token, appSecret }));
     *
     * function handler(req, res) {
     *     if (req.method == "POST") {
     *         const chunks = [];
     *         req.on("data", (chunk) => chunks.push(chunk));
     *
     *         req.on("end", async () => {
     *             const body = Buffer.concat(chunks).toString();
     *
     *             try {
     *                 const response = await Whatsapp.post(JSON.parse(body), body, req.headers["x-hub-signature-256"]);
     *                 res.writeHead(response);
     *             } catch (err) {
     *                 res.writeHead(err instanceof WhatsAppAPIError ? err.httpStatus : 500);
     *             }
     *
     *             res.end();
     *         });
     *     } else res.writeHead(501).end();
     * };
     *
     * Whatsapp.on.message = ({ phoneID, from, message, name, reply, offload }) => {
     *     console.log(`User ${name} (${from}) sent to bot ${phoneID} a(n) ${message.type}`);
     *     offload(() => reply(new Text("Hello!")));
     *     return 202;
     * };
     *
     * const server = createServer(handler);
     * server.listen(3000);
     * ```
     *
     * @param data - The POSTed data object sent by Whatsapp
     * @param raw_body - The raw body of the POST request
     * @param signature - The x-hub-signature-256 header signature sent by Whatsapp
     * @returns The emitter's return value, undefined if the corresponding emitter isn't set
     * @throws Class {@link WhatsAppAPIMissingRawBodyError} if the raw body is missing
     * @throws Class {@link WhatsAppAPIMissingSignatureError} if the signature is missing
     * @throws Class {@link WhatsAppAPIMissingAppSecretError} if the appSecret isn't defined
     * @throws Class {@link WhatsAppAPIMissingCryptoSubtleError} if crypto.subtle or ponyfill isn't available
     * @throws Class {@link WhatsAppAPIFailedToVerifyError} if the signature doesn't match the hash
     * @throws Class {@link WhatsAppAPIUnexpectedError} if the POSTed data is not a valid Whatsapp API request
     * @throws Any error generated within the user's callbacks
     * @throws Class {@link WhatsAppAPIUnexpectedError} if the POSTed data is valid but not a message or status update (ignored)
     */
    async post(
        data: PostData,
        raw_body: string,
        signature: string
    ): Promise<EmittersReturnType | undefined>;

    /**
     * POST helper, must be called inside the post function of your server.
     * When setting up the webhook, you can subscribe to messages and calls.
     * Unexpected events will throw an {@link WhatsAppAPIUnexpectedError}.
     *
     * raw_body and signature are NOT required when secure is `false` on initialization.
     *
     * @deprecated The method isn't deprecated, but it's strongly discouraged to use
     * the server without signature verification. It's a security risk.
     *
     * Provide an `appSecret` and set `secure` to true on {@link WhatsAppAPI} initialization.
     *
     * @param data - The POSTed data object sent by Whatsapp
     * @returns The emitter's return value, undefined if the corresponding emitter isn't set
     * @throws Class {@link WhatsAppAPIUnexpectedError} if the POSTed data is not a valid Whatsapp API request
     * @throws Any error generated within the user's callbacks
     * @throws Class {@link WhatsAppAPIUnexpectedError} if the POSTed data is valid but not a message or status update (ignored)
     */
    async post(data: PostData): Promise<EmittersReturnType | undefined>;

    async post(
        data: PostData,
        raw_body?: string,
        signature?: string
    ): Promise<EmittersReturnType | undefined> {
        // Validating the payload
        if (this.secure) {
            if (!raw_body) throw new WhatsAppAPIMissingRawBodyError();
            if (!signature) throw new WhatsAppAPIMissingSignatureError();

            if (!(await this.verifyRequestSignature(raw_body, signature))) {
                throw new WhatsAppAPIFailedToVerifyError();
            }
        }

        // Throw "400 Bad Request" if data is not a valid WhatsApp API request
        if (!data.object) {
            throw new WhatsAppAPIUnexpectedError("Invalid payload", 400);
        }

        const { field, value } = data.entry[0].changes[0];
        const phoneID = value.metadata.phone_number_id;

        // Check if the message is a message or a status update
        if (field === "messages") {
            if (field in value) {
                const message = value.messages[0];

                const contact = value.contacts?.[0];

                const from = contact?.wa_id ?? message.from;
                const name = contact?.profile.name;

                const args: OnMessageArgs = {
                    phoneID,
                    from,
                    message,
                    name,
                    raw: data,
                    reply: (
                        response,
                        context = false,
                        biz_opaque_callback_data
                    ) =>
                        this.sendMessage(
                            phoneID,
                            from,
                            response,
                            context ? message.id : undefined,
                            biz_opaque_callback_data
                        ),
                    received: (i) => this.markAsRead(phoneID, message.id, i),
                    block: () => this.blockUser(phoneID, from),
                    offload: WhatsAppAPI.offload,
                    Whatsapp: this
                };

                return this.on?.message?.(args);
            } else if ("statuses" in value) {
                const statuses = value.statuses[0];

                const phone = statuses.recipient_id;
                const status = statuses.status;
                const id = statuses.id;
                const timestamp = statuses.timestamp;
                const conversation = statuses.conversation;
                const pricing = statuses.pricing;
                const error = statuses.errors?.[0];
                const biz_opaque_callback_data =
                    statuses.biz_opaque_callback_data;

                const args: OnStatusArgs = {
                    phoneID,
                    phone,
                    status,
                    id,
                    timestamp,
                    conversation,
                    pricing,
                    error,
                    biz_opaque_callback_data,
                    raw: data,
                    offload: WhatsAppAPI.offload,
                    Whatsapp: this
                };

                return this.on?.status?.(args);
            }
        } else if (field === "calls") {
            if (field in value) {
                const call = value.calls[0];

                const contact = value.contacts?.[0];

                const from = contact?.wa_id ?? call.from;
                const name = contact?.profile.name;

                if (call.event === "connect") {
                    const args: OnCallConnectArgs = {
                        phoneID,
                        from,
                        call,
                        name,
                        raw: data,
                        preaccept: () =>
                            this.preacceptCall(
                                phoneID,
                                call.id,
                                call.session.sdp
                            ),
                        accept: (biz_opaque_callback_data) =>
                            this.acceptCall(
                                phoneID,
                                call.id,
                                call.session.sdp,
                                biz_opaque_callback_data
                            ),
                        reject: () => this.rejectCall(phoneID, call.id),
                        terminate: () => this.terminateCall(phoneID, call.id),
                        offload: WhatsAppAPI.offload,
                        Whatsapp: this
                    };

                    return this.on?.call?.connect?.(args);
                } else if (call.event === "terminate") {
                    const args: OnCallTerminateArgs = {
                        phoneID,
                        from,
                        call,
                        name,
                        raw: data,
                        offload: WhatsAppAPI.offload,
                        Whatsapp: this
                    };

                    return this.on?.call?.terminate?.(args);
                }
            } else if ("statuses" in value) {
                const statuses = value.statuses[0];

                const phone = statuses.recipient_id;
                const status = statuses.status;
                const id = statuses.id;
                const timestamp = statuses.timestamp;
                const biz_opaque_callback_data =
                    statuses.biz_opaque_callback_data;

                const args: OnCallStatusArgs = {
                    phoneID,
                    phone,
                    status,
                    id,
                    timestamp,
                    biz_opaque_callback_data,
                    raw: data,
                    offload: WhatsAppAPI.offload,
                    Whatsapp: this
                };

                return this.on?.call?.status?.(args);
            }
        }

        // If unknown payload, just ignore it
        // Facebook doesn't care about your server's opinion
        throw new WhatsAppAPIUnexpectedError("Unexpected payload", 200);
    }

    /**
     * GET helper, must be called inside the get function of your code.
     * Used once at the first webhook setup.
     *
     * @example
     * ```ts
     * // Simple http example implementation with Whatsapp.get() on Node@^19
     * import { WhatsAppAPI } from "whatsapp-api-js";
     * import { WhatsAppAPIError } from "whatsapp-api-js/errors";
     * import { NodeNext } from "whatsapp-api-js/setup/node";
     *
     * import { createServer } from "http";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     * const Whatsapp = new WhatsAppAPI(NodeNext({ token, appSecret }));
     *
     * function handler(req, res) {
     *     if (req.method == "GET") {
     *         const params = new URLSearchParams(req.url.split("?")[1]);
     *
     *         try {
     *             const response = Whatsapp.get(Object.fromEntries(params));
     *             res.writeHead(200, {"Content-Type": "text/html"});
     *             res.write(response);
     *         } catch (err) {
     *             res.writeHead(err instanceof WhatsAppAPIError ? err.httpStatus : 500);
     *         }
     *
     *         res.end();
     *     } else res.writeHead(501).end();
     * };
     *
     * const server = createServer(handler);
     * server.listen(3000);
     * ```
     *
     * @param params - The request object sent by Whatsapp
     * @returns The challenge string, it must be the http response body
     * @throws Class {@link WhatsAppAPIMissingVerifyTokenError} if webhookVerifyToken is not specified
     * @throws Class {@link WhatsAppAPIMissingSearchParamsError} if the request is missing data
     * @throws Class {@link WhatsAppAPIFailedToVerifyTokenError} if the verification tokens don't match
     */
    get(params: GetParams): string {
        if (!this.webhookVerifyToken) {
            throw new WhatsAppAPIMissingVerifyTokenError();
        }

        // Parse params from the webhook verification request
        const {
            "hub.mode": mode,
            "hub.verify_token": token,
            "hub.challenge": challenge
        } = params;

        // Check if a token and mode were sent
        if (!mode || !token) {
            throw new WhatsAppAPIMissingSearchParamsError();
        }

        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === this.webhookVerifyToken) {
            return challenge;
        }

        // Responds with "403 Forbidden" if verify tokens do not match
        throw new WhatsAppAPIFailedToVerifyTokenError();
    }

    // #endregion

    /**
     * Make an authenticated request to any url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * It's strongly recommended NOT using this method as you might risk exposing your API key accidentally,
     * but it's here in case you need a specific API operation which is not implemented by the library.
     *
     * @param url - The url to fetch
     * @param options - The fetch options (headers.Authorization is already included)
     * @returns The fetch response
     */
    async $$apiFetch$$(
        url: string | URL | Request,
        options: RequestInit = {}
    ): Promise<Response> {
        return this.fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.token}`,
                ...options.headers
            }
        });
    }

    /**
     * Verify the signature of a request
     *
     * @param raw_body - The raw body of the request
     * @param signature - The signature to validate
     * @returns If the signature is valid
     * @throws Class {@link WhatsAppAPIMissingAppSecretError} if the appSecret isn't defined
     * @throws Class {@link WhatsAppAPIMissingCryptoSubtleError} if crypto.subtle or ponyfill isn't available
     */
    async verifyRequestSignature(
        raw_body: string,
        signature: string
    ): Promise<boolean> {
        if (!this.appSecret) throw new WhatsAppAPIMissingAppSecretError();
        if (!this.subtle) throw new WhatsAppAPIMissingCryptoSubtleError();

        signature = signature.split("sha256=")[1];
        if (!signature) return false;

        const encoder = new TextEncoder();
        const keyBuffer = encoder.encode(this.appSecret);

        const key = await this.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "HMAC", hash: "SHA-256" },
            true,
            ["sign", "verify"]
        );

        const data = encoder.encode(escapeUnicode(raw_body));
        const result = await this.subtle.sign("HMAC", key, data);
        const result_array = Array.from(new Uint8Array(result));

        // Convert an array of bytes to a hex string
        const check = result_array
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        return signature === check;
    }

    /**
     * Get the body of a fetch response
     *
     * @internal
     * @param promise - The fetch response
     * @returns The json body parsed
     */
    private async getBody<T>(promise: Promise<Response>): Promise<T> {
        return (await promise).json();
    }

    /**
     * Offload a function to the next tick of the event loop
     *
     * @param f - The function to offload from the main thread
     */
    static offload(f: () => unknown) {
        // Thanks @RahulLanjewar93
        Promise.resolve().then(f);
    }
}
