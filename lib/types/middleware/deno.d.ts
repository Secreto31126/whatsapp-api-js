import WebStandardMiddleware from "./web-standard.js";
import type { Request } from "undici-types";
/**
 * Deno server middleware for WhatsAppAPI
 */
export default class WhatsAppAPI extends WebStandardMiddleware {
    /**
     * POST request handler for Deno server
     *
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js/middleware/deno";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * Deno.serve(async (req) => {
     *     if (req.url === "/message" && req.method === "POST") {
     *         return new Response(null, {
     *             status: await Whatsapp.handle_post(req)
     *         });
     *     }
     * });
     * ```
     *
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    handle_post(req: Request): Promise<number>;
    /**
     * GET request handler for Deno server
     *
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js/middleware/deno";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * Deno.serve((req) => {
     *     if (req.url === "/message" && req.method === "GET") {
     *         try {
     *             return new Response(Whatsapp.handle_get(req));
     *         } catch (e) {
     *             return new Response(null, { status: e as number });
     *         }
     *     }
     * });
     * ```
     *
     * @param req - The request object
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request): string;
}
//# sourceMappingURL=deno.d.ts.map