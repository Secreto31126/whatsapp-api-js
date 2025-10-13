import { WhatsAppAPI as WebStandardMiddleware } from "./web-standard.js";
/**
 * Cloudflare worker middleware for WhatsAppAPI
 */
export declare class WhatsAppAPI extends WebStandardMiddleware {
    /**
     * POST request handler for Cloudflare worker
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js/middleware/cloudflare";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * export default {
     *     async fetch(request, env, ctx): Promise<Response> {
     *         if (request.url === "/message" && request.method === "POST") {
     *             return new Response(null, { status: await Whatsapp.handle_post(request) });
     *         }
     *
     *         return new Response('Not Found', { status: 404 });
     *     },
     * } satisfies ExportedHandler<Env>;
     * ```
     *
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    handle_post(req: Request): Promise<number>;
    /**
     * GET request handler for Cloudflare worker
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js/middleware/cloudflare";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * export default {
     *     async fetch(request, env, ctx): Promise<Response> {
     *         if (request.url === "/message" && request.method === "GET") {
     *             try {
     *                 return new Response(Whatsapp.handle_get(request));
     *             } catch (e) {
     *                 return new Response(null, { status: e as number });
     *             }
     *         }
     *
     *         return new Response('Not Found', { status: 404 });
     *     },
     * } satisfies ExportedHandler<Env>;
     * ```
     *
     * @param req - The request object
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request): string;
}
//# sourceMappingURL=cloudflare.d.ts.map