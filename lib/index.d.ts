/** @module WhatsAppAPI */
import { ClientMessage, type WhatsAppAPIConstructorArguments, type PostData, type GetParams, type ClientTypingIndicators, type ServerMessageResponse, type ServerMarkAsReadResponse, type ServerCreateQRResponse, type ServerRetrieveQRResponse, type ServerUpdateQRResponse, type ServerDeleteQRResponse, type ServerMediaRetrieveResponse, type ServerMediaUploadResponse, type ServerMediaDeleteResponse, type ServerBlockResponse, type ServerUnblockResponse, type ServerPreacceptCallResponse, type ServerAcceptCallResponse, type ServerTerminateCallResponse, type ServerRejectCallResponse, type ServerInitiateCallResponse } from "./types.js";
import type { OnCallConnect, OnCallStatus, OnCallTerminate, OnMessage, OnSent, OnStatus } from "./emitters.d.ts";
import * as Cloud from "./apis/index.js";
/**
 * The main API Class
 *
 * @template EmittersReturnType - The return type of the emitters
 * ({@link OnMessage}, {@link OnStatus})
 */
export declare class WhatsAppAPI<EmittersReturnType = void> implements Cloud.Message.API, Cloud.Call.API, Cloud.QR.API, Cloud.Media.API, Cloud.Block.API, Cloud.Webhook.API<EmittersReturnType> {
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
     * If false, the API will be used in a less secure way, removing the need for appSecret. Defaults to true.
     */
    private secure;
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
    on: {
        message?: OnMessage<EmittersReturnType>;
        sent?: OnSent;
        status?: OnStatus<EmittersReturnType>;
        call: {
            connect?: OnCallConnect<EmittersReturnType>;
            terminate?: OnCallTerminate<EmittersReturnType>;
            status?: OnCallStatus<EmittersReturnType>;
        };
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
    constructor({ token, appSecret, webhookVerifyToken, v, secure, ponyfill }: WhatsAppAPIConstructorArguments);
    sendMessage(phoneID: string, to: string, message: ClientMessage, context?: string, biz_opaque_callback_data?: string): Promise<ServerMessageResponse>;
    broadcastMessage(phoneID: string, to: string[], message: ClientMessage, batch_size: number, delay: number): Array<ReturnType<WhatsAppAPI["sendMessage"]>>;
    broadcastMessage<T>(phoneID: string, to: T[], message_builder: (data: T) => [string, ClientMessage], batch_size: number, delay: number): Array<ReturnType<WhatsAppAPI["sendMessage"]>>;
    markAsRead(phoneID: string, messageId: string, indicator?: ClientTypingIndicators): Promise<ServerMarkAsReadResponse>;
    initiateCall(phoneID: string, to: string, sdp: string, biz_opaque_callback_data?: string): Promise<ServerInitiateCallResponse>;
    preacceptCall(phoneID: string, callID: `wacid.${string}`, sdp: string): Promise<ServerPreacceptCallResponse>;
    rejectCall(phoneID: string, callID: `wacid.${string}`): Promise<ServerRejectCallResponse>;
    acceptCall(phoneID: string, callID: `wacid.${string}`, sdp: string, biz_opaque_callback_data?: string): Promise<ServerAcceptCallResponse>;
    terminateCall(phoneID: string, callID: `wacid.${string}`): Promise<ServerTerminateCallResponse>;
    createQR(phoneID: string, message: string, format?: "png" | "svg"): Promise<ServerCreateQRResponse>;
    retrieveQR(phoneID: string, id?: string): Promise<ServerRetrieveQRResponse>;
    updateQR(phoneID: string, id: string, message: string): Promise<ServerUpdateQRResponse>;
    deleteQR(phoneID: string, id: string): Promise<ServerDeleteQRResponse>;
    retrieveMedia(id: string, phoneID?: string): Promise<ServerMediaRetrieveResponse>;
    uploadMedia(phoneID: string, form: unknown, check?: boolean): Promise<ServerMediaUploadResponse>;
    fetchMedia(url: string): Promise<Response>;
    deleteMedia(id: string, phoneID?: string): Promise<ServerMediaDeleteResponse>;
    blockUser(phoneID: string, ...users: string[]): Promise<ServerBlockResponse>;
    unblockUser(phoneID: string, ...users: string[]): Promise<ServerUnblockResponse>;
    post(data: PostData, raw_body: string, signature: string): Promise<EmittersReturnType | undefined>;
    post(data: PostData): Promise<EmittersReturnType | undefined>;
    get(params: GetParams): string;
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
    $$apiFetch$$(url: string | URL | Request, options?: RequestInit): Promise<Response>;
    /**
     * Verify the signature of a request
     *
     * @param raw_body - The raw body of the request
     * @param signature - The signature to validate
     * @returns If the signature is valid
     * @throws Class {@link WhatsAppAPIMissingAppSecretError} if the appSecret isn't defined
     * @throws Class {@link WhatsAppAPIMissingCryptoSubtleError} if crypto.subtle or ponyfill isn't available
     */
    verifyRequestSignature(raw_body: string, signature: string): Promise<boolean>;
    /**
     * Get the body of a fetch response
     *
     * @internal
     * @param promise - The fetch response
     * @returns The json body parsed
     */
    private getBody;
    /**
     * Offload a function to the next tick of the event loop
     *
     * @param f - The function to offload from the main thread
     */
    static offload(f: () => unknown): void;
}
//# sourceMappingURL=index.d.ts.map