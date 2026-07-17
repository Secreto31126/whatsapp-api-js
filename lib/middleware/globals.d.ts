import { WhatsAppAPI } from "../index.js";
/**
 * The abstract class for the middlewares, it extends the WhatsAppAPI class
 * and defines the handle_post and handle_get methods for its childs.
 */
export declare abstract class WhatsAppAPIMiddleware extends WhatsAppAPI<void> {
    /**
     * The max payload size received from the client.
     * If the message is longer than the limit, the API
     * will throw 413 to prevent a DoS attack.
     *
     * It's strongly advised not to increase this value
     * over 3mb, as it's the upper limit from the API, but
     * if you really have to, just edit this variable.
     *
     * Thanks @EQSTLab for the report!
     *
     * @see https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview#payload-size
     */
    static _MAX_PAYLOAD_SIZE: number;
    /**
     * This method should be called when the server receives a POST request.
     * Each child implements it differently depending on the framework.
     *
     * @returns The status code to be sent to the client
     */
    abstract handle_post(...a: unknown[]): Promise<number>;
    /**
     * This method should be called when the server receives a GET request.
     * Each child implements it differently depending on the framework.
     *
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    abstract handle_get(...a: unknown[]): string;
}
//# sourceMappingURL=globals.d.ts.map