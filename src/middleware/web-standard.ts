import { WhatsAppAPIMiddleware } from "./globals.js";
import { WhatsAppAPIError } from "../errors.js";

import type { GetParams } from "../types.d.ts";

/**
 * Web Standard API http server middleware for WhatsAppAPI (deno/bun/SvelteKit/NextJS/Hono)
 */
export class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for Web Standard API http server
     *
     * @override
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    async handle_post(req: Request): Promise<number> {
        try {
            const body = await req.text();

            await this.post(
                JSON.parse(body || "{}"),
                body,
                req.headers.get("x-hub-signature-256") ?? ""
            );

            return 200;
        } catch (e) {
            // In case the JSON.parse fails ¯\_(ツ)_/¯
            return e instanceof WhatsAppAPIError ? e.httpStatus : 500;
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
    handle_get(req: Request): string {
        try {
            return this.get(
                Object.fromEntries(new URL(req.url).searchParams) as GetParams
            );
        } catch (e) {
            // In case who knows what fails ¯\_(ツ)_/¯
            throw e instanceof WhatsAppAPIError ? e.httpStatus : 500;
        }
    }
}
