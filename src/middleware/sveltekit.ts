import WebStandardMiddleware from "./web-standard.js";

import type { Request } from "undici";

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
     *         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
     *         // @ts-ignore - Unfortunately, undici request type and SvelteKit request type are not fully compatible
     *         status: await Whatsapp.handle_post(request)
     *     });
     * };
     * ```
     *
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    async handle_post(req: Request) {
        return super.handle_post(req);
    }

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
     * export const GET: RequestHandler = async ({ request, url }) => {
     *     try {
     *         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
     *         // @ts-ignore - Unfortunately, undici Request type and SvelteKit Request type are not fully compatible
     *         return new Response(await Whatsapp.handle_get(request));
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
    async handle_get(req: Request) {
        return super.handle_get(req);
    }
}
