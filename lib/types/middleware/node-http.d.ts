import { WhatsAppAPIMiddleware } from "./globals.js";
import type { IncomingMessage } from "node:http";
/**
 * node:http server middleware for WhatsAppAPI
 */
export declare class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for node:http server
     *
     * @example
     * ```ts
     * import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
     * import { WhatsAppAPI } from "whatsapp-api-js/middleware/node-http";
     *
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
     *     if (request.url === "/message" && request.method === "POST") {
     *         response.statusCode = await Whatsapp.handle_post(request);
     *         response.end();
     *     }
     * });
     *
     * server.listen(5000);
     * ```
     *
     * @override
     * @param req - The request object
     * @returns The status code to be sent to the client
     */
    handle_post(req: IncomingMessage): Promise<number>;
    /**
     * GET request handler for node:http server
     *
     * @example
     * ```ts
     * import { createServer, IncomingMessage, ServerResponse } from 'node:http';
     * import { WhatsAppAPI } from "whatsapp-api-js/middleware/node-http";
     *
     * const server = createServer((request: IncomingMessage, response: ServerResponse) => {
     *     if (request.url === "/message" && request.method === "GET") {
     *         try {
     *             response.statusCode = 200;
     *             response.end(Whatsapp.handle_get(request));
     *         } catch (e) {
     *             response.statusCode = e as number;
     *             response.end();
     *         }
     *     }
     * });
     *
     * server.listen(5000);
     * ```
     *
     * @override
     * @param req - The request object
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: IncomingMessage): string;
}
//# sourceMappingURL=node-http.d.ts.map