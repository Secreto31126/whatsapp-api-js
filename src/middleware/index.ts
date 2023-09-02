import WhatsAppAPI from "..";

export default abstract class WhatsAppAPIMiddleware extends WhatsAppAPI {
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

export { default as ExpressMiddleware } from "./express";
export { default as AdonisMiddleware } from "./adonis";
export { default as CoreMiddleware } from "./core";
