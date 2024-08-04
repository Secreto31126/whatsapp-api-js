import { WhatsAppAPI as WebStandardMiddleware } from "./web-standard.js";

/**
 * NextJS App Router Endpoints middleware for WhatsAppAPI
 */
export class WhatsAppAPI extends WebStandardMiddleware {
    /**
     * POST request handler for NextJS App Router
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from 'whatsapp-api-js/middleware/next';
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * export async function POST(request: Request) {
     *     return new Response(null, {
     *         status: await Whatsapp.handle_post(request)
     *     });
     * }
     * ```
     *
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    async handle_post(req: Request) {
        return super.handle_post(req);
    }

    /**
     * GET request handler for NextJS App Router
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from 'whatsapp-api-js/middleware/next';
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * export async function GET(request: Request) {
     *     try {
     *         return new Response(Whatsapp.handle_get(request));
     *     } catch (e) {
     *         return new Response(null, { status: e as number });
     *     }
     * }
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
