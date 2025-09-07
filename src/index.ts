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

import * as Cloud from "./apis/index.js";

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
export class WhatsAppAPI<EmittersReturnType = void>
    implements
        Cloud.Message.API,
        Cloud.Call.API,
        Cloud.QR.API,
        Cloud.Media.API,
        Cloud.Block.API,
        Cloud.Webhook.API<EmittersReturnType>
{
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

    async sendMessage(
        phoneID: string,
        to: string,
        message: ClientMessage,
        context?: string,
        biz_opaque_callback_data?: string
    ) {
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

    broadcastMessage<T>(
        phoneID: string,
        to: string[] | T[],
        message_builder:
            | ClientMessage
            | ((data: T) => MaybePromise<[string, ClientMessage]>),
        batch_size = 50,
        delay = 1000
    ) {
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

    async markAsRead(
        phoneID: string,
        messageId: string,
        indicator?: ClientTypingIndicators
    ) {
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

    async initiateCall(
        phoneID: string,
        to: string,
        sdp: string,
        biz_opaque_callback_data?: string
    ) {
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

    async preacceptCall(
        phoneID: string,
        callID: `wacid.${string}`,
        sdp: string
    ) {
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

    async rejectCall(phoneID: string, callID: `wacid.${string}`) {
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

    async acceptCall(
        phoneID: string,
        callID: `wacid.${string}`,
        sdp: string,
        biz_opaque_callback_data?: string
    ) {
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

    async terminateCall(phoneID: string, callID: `wacid.${string}`) {
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

    async createQR(
        phoneID: string,
        message: string,
        format: "png" | "svg" = "png"
    ) {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls?generate_qr_image=${format}&prefilled_message=${message}`,
            {
                method: "POST"
            }
        );

        return this.getBody<ServerCreateQRResponse>(promise);
    }

    async retrieveQR(phoneID: string, id?: string) {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id ?? ""}`
        );

        return this.getBody<ServerRetrieveQRResponse>(promise);
    }

    async updateQR(phoneID: string, id: string, message: string) {
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id}?prefilled_message=${message}`,
            {
                method: "POST"
            }
        );

        return this.getBody<ServerUpdateQRResponse>(promise);
    }

    async deleteQR(phoneID: string, id: string) {
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

    async retrieveMedia(id: string, phoneID?: string) {
        const params = phoneID ? `phone_number_id=${phoneID}` : "";
        const promise = this.$$apiFetch$$(
            `https://graph.facebook.com/${this.v}/${id}?${params}`
        );

        return this.getBody<ServerMediaRetrieveResponse>(promise);
    }

    async uploadMedia(phoneID: string, form: unknown, check = true) {
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

    fetchMedia(url: string) {
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

    async deleteMedia(id: string, phoneID?: string) {
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

    async blockUser(phoneID: string, ...users: string[]) {
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

    async unblockUser(phoneID: string, ...users: string[]) {
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

    async post(data: PostData, raw_body?: string, signature?: string) {
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

    get(params: GetParams) {
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
