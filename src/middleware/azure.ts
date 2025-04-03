import { WhatsAppAPIMiddleware } from "./globals.js";
import { WhatsAppAPIError } from "../errors.js";

import type { HttpRequest } from "@azure/functions";
import type { GetParams } from "../types.d.ts";

/**
 * Azure Function middleware for WhatsAppAPI
 *
 * @remark This middleware is identical to the Web Standard API middleware,
 * but uses the Azure Function's HttpRequest object which is a _subset_
 * of the Web Standard API's Request object.
 */
export class WhatsAppAPI extends WhatsAppAPIMiddleware {
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
     * @param req - The request object from Express.js
     * @returns The status code to be sent to the client
     */
    async handle_post(req: HttpRequest): Promise<number> {
        try {
            const body = await req.text();

            await this.post(
                JSON.parse(body || "{}"),
                body,
                req.headers.get("x-hub-signature-256") ?? ""
            );

            return 200;
        } catch (e) {
            // In case the JSON.parse fails ¯\_(ツ)_/¯
            return e instanceof WhatsAppAPIError ? e.httpStatus : 500;
        }
    }

    /**
     * GET request handler for Express.js
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
     * @param req - The request object from Express.js
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request): string {
        try {
            return this.get(
                Object.fromEntries(new URL(req.url).searchParams) as GetParams
            );
        } catch (e) {
            // In case who knows what fails ¯\_(ツ)_/¯
            throw e instanceof WhatsAppAPIError ? e.httpStatus : 500;
        }
    }
}
