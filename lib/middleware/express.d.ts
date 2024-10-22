import { WhatsAppAPIMiddleware } from "./globals.js";
import type { Request } from "express";
/**
 * Express.js middleware for WhatsAppAPI
 */
export declare class WhatsAppAPI extends WhatsAppAPIMiddleware {
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
     * import { WhatsAppAPI } from "whatsapp-api-js/middleware/express";
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
     * // The `express.text({ type: '*\/*' })` is optional if you are NOT using `express.json()`.
     * app.post("/message", express.text({ type: '*\/*' }), async (req, res) => {
     *     res.sendStatus(await Whatsapp.handle_post(req));
     * });
     * ```
     *
     * @override
     * @param req - The request object from Express.js
     * @returns The status code to be sent to the client
     */
    handle_post(req: Request): Promise<number>;
    /**
     * GET request handler for Express.js
     *
     * @example
     * ```ts
     * import express from "express";
     * import { WhatsAppAPI } from "whatsapp-api-js/middleware/express";
     *
     * const app = express();
     * const Whatsapp = new WhatsAppAPI({
     *     token: "YOUR_TOKEN",
     *     appSecret: "YOUR_APP_SECRET",
     *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
     * });
     *
     * app.get("/message", (req, res) => {
     *     try {
     *         res.send(Whatsapp.handle_get(req));
     *     } catch (e) {
     *         res.sendStatus(e as number);
     *     }
     * });
     * ```
     *
     * @override
     * @param req - The request object from Express.js
     * @returns The challenge string to be sent to the client
     * @throws The error code
     */
    handle_get(req: Request): string;
}
//# sourceMappingURL=express.d.ts.map