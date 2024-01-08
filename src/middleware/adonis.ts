import { WhatsAppAPIMiddleware } from "./globals.js";
import { isInteger } from "../utils.js";

import type { Request } from "@adonisjs/http-server/build";
import type { GetParams, PostData } from "../types";

/**
 * AdonisJS middleware for WhatsAppAPI
 */
export default class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for AdonisJS
     *
     * @example
     * ```ts
     * import Route from "@ioc:Adonis/Core/Route";
     * import WhatsAppAPI from "whatsapp-api-js/middleware/adonis";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * Route.post('/', async ({ request, response }) => {
     *     response.status(await Whatsapp.handle_post(request));
     * });
     * ```
     *
     * @override
     * @param req - The request object from AdonisJS
     * @returns The status code to be sent to the client
     */
    async handle_post(req: Request) {
        try {
            return await this.post(
                req.body() as PostData,
                req.raw() ?? "",
                req.header("x-hub-signature-256") ?? ""
            );
        } catch (e) {
            // In case who knows what fails ¯\_(ツ)_/¯
            return isInteger(e) ? e : 500;
        }
    }

    /**
     * GET request handler for AdonisJS
     *
     * @example
     * ```ts
     * import Route from "@ioc:Adonis/Core/Route";
     * import WhatsAppAPI from "whatsapp-api-js/middleware/adonis";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * Route.get('/', ({ request, response }) => {
     *     try {
     *         return Whatsapp.handle_get(request);
     *     } catch (e) {
     *         response.status(e as number);
     *     }
     * });
     * ```
     *
     * @override
     * @param req - The request object from AdonisJS
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request) {
        try {
            return this.get(req.qs() as GetParams);
        } catch (e) {
            // In case who knows what fails ¯\_(ツ)_/¯
            throw isInteger(e) ? e : 500;
        }
    }
}
