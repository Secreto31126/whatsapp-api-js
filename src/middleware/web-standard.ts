import { WhatsAppAPIMiddleware } from "./globals.js";
import { isInteger } from "../utils.js";

import type { Request } from "undici";
import type { GetParams } from "../types";

/**
 * Web Standard API http server middleware for WhatsAppAPI (deno/bun/SvelteKit/Hono)
 */
export default class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for Web Standard API http server
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
     * @override
     * @param req - The request object
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request) {
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
