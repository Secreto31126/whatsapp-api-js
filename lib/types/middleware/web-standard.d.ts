import { WhatsAppAPIMiddleware } from "./globals.js";
/**
 * Web Standard API http server middleware for WhatsAppAPI (deno/bun/SvelteKit/NextJS/Hono)
 */
export declare class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for Web Standard API http server
     *
     * @override
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    handle_post(req: Request): Promise<number>;
    /**
     * GET request handler for Web Standard API http server
     *
     * @override
     * @param req - The request object
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request): string;
}
//# sourceMappingURL=web-standard.d.ts.map