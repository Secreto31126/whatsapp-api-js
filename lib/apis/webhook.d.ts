import type { GetParams, PostData } from "../types";
export interface API<EmittersReturnType> {
    /**
     * POST helper, must be called inside the post function of your server.
     * When setting up the webhook, you can subscribe to messages and calls.
     * Unexpected events will throw an {@link Errors.WhatsAppAPIUnexpectedError}.
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
     * @throws Class {@link Errors.WhatsAppAPIMissingRawBodyError} if the raw body is missing
     * @throws Class {@link Errors.WhatsAppAPIMissingSignatureError} if the signature is missing
     * @throws Class {@link Errors.WhatsAppAPIMissingAppSecretError} if the appSecret isn't defined
     * @throws Class {@link Errors.WhatsAppAPIMissingCryptoSubtleError} if crypto.subtle or ponyfill isn't available
     * @throws Class {@link Errors.WhatsAppAPIFailedToVerifyError} if the signature doesn't match the hash
     * @throws Class {@link Errors.WhatsAppAPIUnexpectedError} if the POSTed data is not a valid Whatsapp API request
     * @throws Any error generated within the user's callbacks
     * @throws Class {@link Errors.WhatsAppAPIUnexpectedError} if the POSTed data is valid but not a message or status update (ignored)
     */
    post(data: PostData, raw_body: string, signature: string): Promise<EmittersReturnType | undefined>;
    /**
     * POST helper, must be called inside the post function of your server.
     * When setting up the webhook, you can subscribe to messages and calls.
     * Unexpected events will throw an {@link Errors.WhatsAppAPIUnexpectedError}.
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
     * @throws Class {@link Errors.WhatsAppAPIUnexpectedError} if the POSTed data is not a valid Whatsapp API request
     * @throws Any error generated within the user's callbacks
     * @throws Class {@link Errors.WhatsAppAPIUnexpectedError} if the POSTed data is valid but not a message, call or status update (ignored)
     */
    post(data: PostData): Promise<EmittersReturnType | undefined>;
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
     * @throws Class {@link Errors.WhatsAppAPIMissingVerifyTokenError} if webhookVerifyToken is not specified
     * @throws Class {@link Errors.WhatsAppAPIMissingSearchParamsError} if the request is missing data
     * @throws Class {@link Errors.WhatsAppAPIFailedToVerifyTokenError} if the verification tokens don't match
     */
    get(params: GetParams): string;
}
//# sourceMappingURL=webhook.d.ts.map