import { WhatsAppAPIMiddleware } from "./globals.js";
import { isInteger } from "../utils.js";

import type { IncomingMessage } from "node:http";
import type { Readable } from "node:stream";

import type { GetParams } from "../types";

/**
 * node:http server middleware for WhatsAppAPI
 */
export class WhatsAppAPI extends WhatsAppAPIMiddleware {
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
    async handle_post(req: IncomingMessage) {
        /**
         * Copy pasted from an issue on Deno's repository :)
         *
         * @internal
         * @param readable - The readable stream
         * @returns The parsed body
         */
        async function parseBody(readable: Readable) {
            const chunks = [];

            for await (const chunk of readable) {
                chunks.push(
                    typeof chunk === "string" ? Buffer.from(chunk) : chunk
                );
            }

            return Buffer.concat(chunks).toString("utf-8");
        }

        try {
            const body = await parseBody(req);
            const signature = req.headers["x-hub-signature-256"];

            if (typeof signature !== "string") throw 400;

            await this.post(JSON.parse(body || "{}"), body, signature);

            return 200;
        } catch (e) {
            // In case the JSON.parse fails ¯\_(ツ)_/¯
            return isInteger(e) ? e : 500;
        }
    }

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
    handle_get(req: IncomingMessage) {
        try {
            return this.get(
                Object.fromEntries(
                    new URL(req.url!, `http://${req.headers.host}`).searchParams
                ) as GetParams
            );
        } catch (e) {
            // In case who knows what fails ¯\_(ツ)_/¯
            throw isInteger(e) ? e : 500;
        }
    }
}
