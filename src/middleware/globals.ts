import WhatsAppAPI from "../index.js";

/**
 * The abstract class for the middlewares, it extends the WhatsAppAPI class
 * and defines the handle_post and handle_get methods for its childs.
 */
export abstract class WhatsAppAPIMiddleware extends WhatsAppAPI {
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
