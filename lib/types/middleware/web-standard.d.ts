import { WhatsAppAPIMiddleware } from "./globals.js";
import type { Request } from "undici";
/**
 * Web Standard API http server middleware for WhatsAppAPI (deno/bun/Hono/SvelteKit)
 *
 * Deno is used as the default example, but it should work with any
 * Web Standard API http server Request object.
 */
export default class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for Web Standard API http server
     *
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js/middleware/web-standard";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * Deno.serve(async (req) => {
     *     if (req.url === "/message" && req.method === "POST") {
     *         req.respond({ status: await Whatsapp.handle_post(req) });
     *     }
     * });
     * ```
     *
     * @override
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    handle_post(req: Request): Promise<number>;
    /**
     * GET request handler for Web Standard API http server
     *
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js/middleware/web-standard";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * Deno.serve(async (req) => {
     *     if (req.url === "/message" && req.method === "GET") {
     *         try {
     *             req.respond(await Whatsapp.handle_get(req));
     *         } catch (e) {
     *             req.respond({ status: e as number });
     *         }
     *     }
     * });
     * ```
     *
     * @override
     * @param req - The request object
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request): Promise<string>;
}
//# sourceMappingURL=web-standard.d.ts.map