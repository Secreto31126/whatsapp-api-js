/** @module WhatsAppAPI */

import type {
    WhatsAppAPIConstructorArguments,
    PostData,
    GetParams,
    ClientMessage,
    ClientMessageRequest,
    ServerMessageResponse,
    ServerMarkAsReadResponse,
    ServerCreateQRResponse,
    ServerRetrieveQRResponse,
    ServerUpdateQRResponse,
    ServerDeleteQRResponse,
    ServerMediaRetrieveResponse,
    ServerMediaUploadResponse,
    ServerMediaDeleteResponse
} from "./types";
import type {
    OnMessage,
    OnMessageArgs,
    OnSent,
    OnSentArgs,
    OnStatus,
    OnStatusArgs
} from "./emitters";
import { escapeUnicode } from "./utils";

/**
 * The main API Class
 */
export default class WhatsAppAPI {
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
     * If true, API operations will return the fetch promise instead. Intended for low level debugging.
     */
    private parsed: boolean;
    /**
     * If false, the API will be used in a less secure way, reducing the need for appSecret. Defaults to true.
     */
    private secure: boolean;
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
    public on: {
        message?: OnMessage;
        sent?: OnSent;
        status?: OnStatus;
    } = {};
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
     * @throws If fetch is not defined in the enviroment and the provided ponyfill isn't a function
     * @throws If secure is true, crypto.subtle is not defined in the enviroment and the provided ponyfill isn't an object
     */
    constructor({
        token,
        appSecret,
        webhookVerifyToken,
        v = "v18.0",
        parsed = true,
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

        this.v = v;

        this.parsed = !!parsed;
    }

    //#region Message Operations

    /**
     * Send a Whatsapp message
     *
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js";
     * import Text from "whatsapp-api-js/messages/text";
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
     * @param biz_opaque_callback_data - An arbitrary 256B string, useful for tracking (length not checked by the framework)
     * @returns The server response
     */
    async sendMessage(
        phoneID: string,
        to: string,
        message: ClientMessage,
        context?: string,
        biz_opaque_callback_data?: string
    ): Promise<ServerMessageResponse | Response> {
        const type = message._type;

        const request = {
            messaging_product: "whatsapp",
            type,
            to
        } as ClientMessageRequest;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - TS dumb, the _type will always match the type
        request[type] =
            // Prettier will probably kill me, but this comment has a purpose.
            // It prevents ts-ignore from ignoring more than intended.
            message._build();

        if (context) request.context = { message_id: context };
        if (biz_opaque_callback_data)
            request.biz_opaque_callback_data = biz_opaque_callback_data;

        // Make the post request
        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${phoneID}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            }
        );

        const response = this.parsed
            ? ((await (await promise).json()) as ServerMessageResponse)
            : undefined;

        const args: OnSentArgs = {
            phoneID,
            to,
            type,
            message,
            request,
            id: response
                ? "messages" in response
                    ? response.messages[0].id
                    : undefined
                : undefined,
            response
        };

        this.offload(this.on?.sent, args);

        return response ?? promise;
    }

    /**
     * Send the same Whatsapp message to multiple phone numbers.
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
     * import WhatsAppAPI from "whatsapp-api-js";
     * import Text from "whatsapp-api-js/messages/text";
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
     * @returns The server response
     * @throws if batch_size is lower than 1
     * @throws if delay is lower than 0
     */
    async broadcastMessage(
        phoneID: string,
        to: string[],
        message: ClientMessage,
        batch_size = 50,
        delay = 1000
    ): Promise<Array<ReturnType<typeof this.sendMessage>>> {
        const responses = [] as ReturnType<typeof this.sendMessage>[];

        if (batch_size < 1) {
            throw new RangeError("batch_size must be greater than 0");
        }

        if (delay < 0) {
            throw new RangeError("delay must be greater or equal to 0");
        }

        for (let i = 0; i < to.length; i += batch_size) {
            if (i !== 0) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            for (const u of to.slice(i, i + batch_size)) {
                responses.push(this.sendMessage(phoneID, u, message));
            }
        }

        return responses;
    }

    /**
     * Mark a message as read
     *
     * @param phoneID - The bot's phone ID
     * @param messageId - The message ID
     * @returns The server response
     */
    async markAsRead(
        phoneID: string,
        messageId: string
    ): Promise<ServerMarkAsReadResponse | Response> {
        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${phoneID}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    status: "read",
                    message_id: messageId
                })
            }
        );

        return this.getBody<ServerMarkAsReadResponse>(promise);
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
    ): Promise<ServerCreateQRResponse | Response> {
        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls?generate_qr_image=${format}&prefilled_message=${message}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
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
    ): Promise<ServerRetrieveQRResponse | Response> {
        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${
                id ?? ""
            }`,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
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
    ): Promise<ServerUpdateQRResponse | Response> {
        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id}?prefilled_message=${message}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
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
    ): Promise<ServerDeleteQRResponse | Response> {
        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return this.getBody<ServerDeleteQRResponse>(promise);
    }

    //#endregion

    //#region Media Operations

    /**
     * Get a Media object data with an ID
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     */
    async retrieveMedia(
        id: string,
        phoneID?: string
    ): Promise<ServerMediaRetrieveResponse | Response> {
        const params = phoneID ? `phone_number_id=${phoneID}` : "";
        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${id}?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return this.getBody<ServerMediaRetrieveResponse>(promise);
    }

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
    async uploadMedia(
        phoneID: string,
        form: unknown,
        check = true
    ): Promise<ServerMediaUploadResponse | Response> {
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

        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${phoneID}/media?messaging_product=whatsapp`,
            {
                method: "POST",
                body: form as FormData,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return this.getBody<ServerMediaUploadResponse>(promise);
    }

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
     */
    async deleteMedia(
        id: string,
        phoneID?: string
    ): Promise<ServerMediaDeleteResponse | Response> {
        const params = phoneID ? `phone_number_id=${phoneID}` : "";
        const promise = this.fetch(
            `https://graph.facebook.com/${this.v}/${id}?${params}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return this.getBody<ServerMediaDeleteResponse>(promise);
    }

    // #endregion

    // #region Webhooks

    /**
     * POST helper, must be called inside the post function of your code.
     * When setting up the webhook, only subscribe to messages. Other subscritions support might be added later.
     *
     * @example
     * ```ts
     * // author arivanbastos on issue #114
     * // Simple http example implementation with Whatsapp.post() on Node@^19
     * import WhatsAppAPI from "whatsapp-api-js";
     * import { NodeNext } from "whatsapp-api-js/setup/node";
     *
     * import { createServer } from "http";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     * const Whatsapp = new WhatsAppAPI(NodeNext({ token, appSecret }));
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
     *                 res.writeHead(err);
     *             }
     *
     *             res.end();
     *         });
     *     } else res.writeHead(501).end();
     * };
     *
     * Whatsapp.on.message = ({ phoneID, from, message, name }) => {
     *     console.log(`User ${name} (${from}) sent to bot ${phoneID} a(n) ${message.type}`);
     * };
     *
     * const server = createServer(handler);
     * server.listen(3000);
     * ```
     *
     * @param data - The POSTed data object sent by Whatsapp
     * @param raw_body - The raw body of the POST request
     * @param signature - The x-hub-signature-256 (all lowercase) header signature sent by Whatsapp
     * @returns 200, it's the expected http/s response code
     * @throws 500 if secure and the appSecret isn't specified
     * @throws 501 if secure and crypto.subtle or ponyfill isn't available
     * @throws 400 if secure and the raw body is missing
     * @throws 401 if secure and the signature is missing
     * @throws 401 if secure and the signature doesn't match the hash
     * @throws 400 if the POSTed data is not a valid Whatsapp API request
     */
    async post(
        data: PostData,
        raw_body?: string,
        signature?: string
    ): Promise<200> {
        //Validating the payload
        if (this.secure) {
            if (!this.appSecret) throw 500;
            if (!this.subtle) throw 501;

            if (!raw_body) throw 400;

            signature = signature?.split("sha256=")[1];
            if (!signature) throw 401;

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
            const result = await this.subtle.sign("HMAC", key, data.buffer);
            const result_array = Array.from(new Uint8Array(result));

            // Convert an array of bytes to a hex string
            const check = result_array
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            if (signature !== check) throw 401;
        }

        // Throw "400 Bad Request" if data is not a valid WhatsApp API request
        if (!data.object) throw 400;

        const value = data.entry[0].changes[0].value;
        const phoneID = value.metadata.phone_number_id;

        // Check if the message is a message or a status update
        if ("messages" in value) {
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
                reply: (response, context = false, biz_opaque_callback_data) =>
                    this.sendMessage(
                        phoneID,
                        from,
                        response,
                        context ? message.id : undefined,
                        biz_opaque_callback_data
                    ),
                Whatsapp: this
            };

            this.offload(this.on?.message, args);
        } else if ("statuses" in value) {
            const statuses = value.statuses[0];

            const phone = statuses.recipient_id;
            const status = statuses.status;
            const id = statuses.id;
            const conversation = statuses.conversation;
            const pricing = statuses.pricing;
            const error = statuses.errors?.[0];
            const biz_opaque_callback_data = statuses.biz_opaque_callback_data;

            const args: OnStatusArgs = {
                phoneID,
                phone,
                status,
                id,
                conversation,
                pricing,
                error,
                biz_opaque_callback_data,
                raw: data
            };

            this.offload(this.on?.status, args);
        }
        // If unknown payload, just ignore it
        // Facebook doesn't care about your server's opinion

        return 200;
    }

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
    get(params: GetParams): string {
        if (!this.webhookVerifyToken) throw 500;

        // Parse params from the webhook verification request
        const {
            "hub.mode": mode,
            "hub.verify_token": token,
            "hub.challenge": challenge
        } = params;

        // Check if a token and mode were sent
        if (!mode || !token) {
            // Responds with "400 Bad Request" if it's missing data
            throw 400;
        }

        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === this.webhookVerifyToken) {
            // Respond with 200 OK and challenge token from the request
            return challenge;
        }

        // Responds with "403 Forbidden" if verify tokens do not match
        throw 403;
    }

    // #endregion

    /**
     * Make an authenticated request to any url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @internal
     * @param url - The url to request to
     * @returns The fetch response
     * @throws If url is not specified
     */
    _authenicatedRequest(url: string | URL | Request): Promise<Response> {
        // Keep the check to ensure on runtime that no weird stuff happens
        if (!url) throw new Error("URL must be specified");

        return this.fetch(url, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }

    /**
     * Get the body of a fetch response
     *
     * @param promise - The fetch response
     * @returns The json body parsed
     */
    private async getBody<T>(
        promise: Promise<Response>
    ): Promise<T | Response> {
        return this.parsed ? ((await (await promise).json()) as T) : promise;
    }

    /**
     * Offload a function to the next tick of the event loop
     *
     * @internal
     * @param f - The function to offload from the main thread
     * @param a - The arguments to pass to the function
     */
    private offload<A, F extends ((...a: A[]) => unknown) | undefined>(
        f: F,
        ...a: A[]
    ) {
        if (f) {
            // Thanks @RahulLanjewar93
            Promise.resolve().then(() => f(...a));
        }
    }
}
