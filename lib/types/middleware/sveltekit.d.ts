import WebStandardMiddleware from "./web-standard.js";
/**
 * SvelteKit Endpoints middleware for WhatsAppAPI
 *
 * @see https://kit.svelte.dev/docs/routing#server
 */
export default class WhatsAppAPI extends WebStandardMiddleware {
    /**
     * POST request handler for SvelteKit RequestHandler
     *
     * @example
     * ```ts
     * import WhatsAppAPI from 'whatsapp-api-js/middleware/sveltekit';
     *
     * import type { RequestHandler } from './$types';
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * export const POST: RequestHandler = async ({ request }) => {
     *     return new Response(null, {
     *         status: await Whatsapp.handle_post(request)
     *     });
     * };
     * ```
     *
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    handle_post(req: Request): Promise<number>;
    /**
     * GET request handler for SvelteKit RequestHandler
     *
     * @example
     * ```ts
     * import WhatsAppAPI from 'whatsapp-api-js/middleware/sveltekit';
     *
     * import type { RequestHandler } from './$types';
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * export const GET: RequestHandler = ({ request, url }) => {
     *     try {
     *         return new Response(Whatsapp.handle_get(request));
     *     } catch (e) {
     *         return new Response(null, { status: e as number });
     *     }
     * };
     * ```
     *
     * @param req - The request object
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request): string;
}
//# sourceMappingURL=sveltekit.d.ts.map