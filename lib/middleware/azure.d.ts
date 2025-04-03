import { WhatsAppAPIMiddleware } from "./globals.js";
import type { HttpRequest } from "@azure/functions";
/**
 * Azure Function middleware for WhatsAppAPI
 *
 * @remark This middleware is identical to the Web Standard API middleware,
 * but uses the Azure Function's HttpRequest object which is a _subset_
 * of the Web Standard API's Request object.
 */
export declare class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for Azure Function
     *
     * @example
     * ```ts
     * import { app } from "@azure/functions";
     * import { WhatsAppAPI } from "whatsapp-api-js/middleware/azure";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * app.http('WhatsAppPOST', {
     *     methods: ['POST'],
     *     authLevel: 'anonymous',
     *     route: 'message',
     *     handler: async (req) => ({
     *         status: await Whatsapp.handle_post(req)
     *     })
     * });
     * ```
     *
     * @override
     * @param req - The request object from Azure Functions
     * @returns The status code to be sent to the client
     */
    handle_post(req: HttpRequest): Promise<number>;
    /**
     * GET request handler for Azure Function
     *
     * @example
     * ```ts
     * import { app } from "@azure/functions";
     * import { WhatsAppAPI } from "whatsapp-api-js/middleware/azure";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * app.http('WhatsAppGET', {
     *     methods: ['GET'],
     *     authLevel: 'anonymous',
     *     route: 'message',
     *     handler: async (req) => {
     *         try {
     *             return {
     *                 body: Whatsapp.handle_get(req)
     *             };
     *         } catch (e) {
     *             return {
     *                 status: e as number
     *             };
     *         }
     *     }
     * });
     * ```
     *
     * @override
     * @param req - The request object from Azure Functions
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: HttpRequest): string;
}
//# sourceMappingURL=azure.d.ts.map