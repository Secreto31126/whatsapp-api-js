import WhatsAppAPI from "../index.js";

/**
 * The abstract class for the middlewares, it extends the WhatsAppAPI class
 * and defines the handle_post and handle_get methods for its childs.
 */
export abstract class WhatsAppAPIMiddleware extends WhatsAppAPI {
    /**
     * @returns The status code to be sent to the client
     */
    abstract handle_post(...a: unknown[]): Promise<number>;

    /**
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    abstract handle_get(...a: unknown[]): Promise<string>;
}
