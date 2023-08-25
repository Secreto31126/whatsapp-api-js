import { default as ParentWhatsAppAPI } from "..";
import { isInteger } from "../utils";

import type { GetParams } from "../types";

export default class WhatsAppAPI extends ParentWhatsAppAPI {
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
     * @param req - The request object from Express.js
     * @returns The status code to be sent to the client
     */
    async handle_post(req: {
        body?: string;
        headers: unknown;
    }): Promise<number> {
        let code;
        try {
            code = await this.post(
                JSON.parse(req.body ?? "{}"),
                req.body,
                (
                    req.headers as {
                        "x-hub-signature-256"?: string;
                    }
                )["x-hub-signature-256"]
            );
        } catch (e) {
            // In case the JSON.parse fails ¯\_(ツ)_/¯
            code = isInteger(e) ? e : 500;
        }

        return code;
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
     *     res.sendStatus(await Whatsapp.handle_get(req));
     * });
     * ```
     *
     * @param req - The request object from Express.js
     * @returns The status code to be sent to the client
     */
    async handle_get(req: { query: unknown }) {
        try {
            return this.get(req.query as GetParams);
        } catch (e) {
            // In case who knows what fails ¯\_(ツ)_/¯
            return isInteger(e) ? e : 500;
        }
    }
}
