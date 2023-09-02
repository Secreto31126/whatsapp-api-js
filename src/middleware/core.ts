import WhatsAppAPIMiddleware from ".";
import { isInteger } from "../utils";

import type { IncomingMessage } from "node:http";
import type { GetParams } from "../types";

export default class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for core JS http server
     *
     * @example
     * ```ts
     * import { createServer, IncomingMessage, ServerResponse } from 'node:http';
     * import WhatsAppAPI from "whatsapp-api-js/middleware/core";
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
        function getBody(req: IncomingMessage): Promise<string> {
            return new Promise((resolve) => {
                const chunks = [] as Buffer[];

                req.on("data", (chunk) => {
                    chunks.push(chunk);
                });

                req.on("end", () => {
                    resolve(Buffer.concat(chunks).toString());
                });
            });
        }

        try {
            const body = await getBody(req);
            return this.post(
                JSON.parse(body ?? "{}"),
                body,
                // Edge case: if the header is duplicated, an array
                // is returned and the code will likely fail
                (req.headers["x-hub-signature-256"] as string) ?? ""
            );
        } catch (e) {
            // In case the JSON.parse fails ¯\_(ツ)_/¯
            return isInteger(e) ? e : 500;
        }
    }

    /**
     * GET request handler for core JS http server
     *
     * @example
     * ```ts
     * import { createServer, IncomingMessage, ServerResponse } from 'node:http';
     * import WhatsAppAPI from "whatsapp-api-js/middleware/core";
     *
     * const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
     *     if (request.url === "/message" && request.method === "GET") {
     *         try {
     *             response.statusCode = 200;
     *             response.end(await Whatsapp.handle_get(request));
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
    async handle_get(req: IncomingMessage) {
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
