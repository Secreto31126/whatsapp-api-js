import { WhatsAppAPIMiddleware } from "./globals.js";
import { isInteger } from "../utils.js";

import type { Request } from "undici";
import type { GetParams } from "../types";

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
    async handle_post(req: Request) {
        try {
            const body = await req.text();

            return this.post(
                JSON.parse(body || "{}"),
                body,
                req.headers.get("x-hub-signature-256") ?? ""
            );
        } catch (e) {
            // In case the JSON.parse fails ¯\_(ツ)_/¯
            return isInteger(e) ? e : 500;
        }
    }

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
    async handle_get(req: Request) {
        try {
            return this.get(
                Object.fromEntries(new URL(req.url).searchParams) as GetParams
            );
        } catch (e) {
            // In case who knows what fails ¯\_(ツ)_/¯
            throw isInteger(e) ? e : 500;
        }
    }
}
