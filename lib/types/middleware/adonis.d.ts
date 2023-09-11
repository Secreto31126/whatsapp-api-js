import { WhatsAppAPIMiddleware } from "./globals.js";
import type { Request } from "@adonisjs/http-server/build/standalone";
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
    handle_post(req: Request): Promise<number>;
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
    handle_get(req: Request): string;
}
//# sourceMappingURL=adonis.d.ts.map