import WebStandardMiddleware from "./web-standard.js";

/**
 * Bun server middleware for WhatsAppAPI
 */
export default class WhatsAppAPI extends WebStandardMiddleware {
    /**
     * POST request handler for Bun server
     *
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js/middleware/bun";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * Bun.serve({
     *     fetch: async (req) => {
     *         if (req.url === "/message" && req.method === "POST") {
     *             req.respond({ status: await Whatsapp.handle_post(req) });
     *         }
     *     }
     * });
     * ```
     *
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    async handle_post(req: Request) {
        return super.handle_post(req);
    }

    /**
     * GET request handler for Bun server
     *
     * @example
     * ```ts
     * import WhatsAppAPI from "whatsapp-api-js/middleware/bun";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * Bun.serve({
     *     fetch: (req) => {
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
    handle_get(req: Request) {
        return super.handle_get(req);
    }
}
