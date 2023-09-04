import { WhatsAppAPIMiddleware } from "./globals.js";
import { isInteger } from "../utils.js";

import type { Request } from "express";
import type { GetParams } from "../types";

/**
 * Express.js middleware for WhatsAppAPI
 */
export default class WhatsAppAPI extends WhatsAppAPIMiddleware {
    /**
     * POST request handler for Express.js
     *
     * @remarks This method expects the request body to be the original string, not a parsed body
     * @see https://expressjs.com/en/guide/using-middleware.html#middleware.router
     * @see https://expressjs.com/en/4x/api.html#express.text
     *
     * @example
     * ```ts
     * import express from "express";
     * import WhatsAppAPI from "whatsapp-api-js/middleware/express";
     *
     * const app = express();
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * // Your app shall use any express middleware, as long as the entry point where `handle_post`
     * // is called has the request body as a string, not a parsed body.
     * app.use(express.json());
     *
     * // The `express.text()` is optional if you are NOT using `express.json()`.
     * app.post("/message", express.text(), async (req, res) => {
     *     res.sendStatus(await Whatsapp.handle_post(req));
     * });
     * ```
     *
     * @override
     * @param req - The request object from Express.js
     * @returns The status code to be sent to the client
     */
    async handle_post(req: Request): Promise<number> {
        try {
            return this.post(
                JSON.parse(req.body ?? "{}"),
                req.body,
                req.header("x-hub-signature-256")
            );
        } catch (e) {
            // In case the JSON.parse fails ¯\_(ツ)_/¯
            return isInteger(e) ? e : 500;
        }
    }

    /**
     * GET request handler for Express.js
     *
     * @example
     * ```ts
     * import express from "express";
     * import WhatsAppAPI from "whatsapp-api-js/middleware/express";
     *
     * const app = express();
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * app.get("/message", async (req, res) => {
     *     try {
     *         res.send(await Whatsapp.handle_get(req));
     *     } catch (e) {
     *         res.sendStatus(e as number);
     *     }
     * });
     * ```
     *
     * @override
     * @param req - The request object from Express.js
     * @returns The status code to be sent to the client
     * @throws The error code
     */
    async handle_get(req: Request) {
        try {
            return this.get(req.query as GetParams);
        } catch (e) {
            // In case who knows what fails ¯\_(ツ)_/¯
            throw isInteger(e) ? e : 500;
        }
    }
}
