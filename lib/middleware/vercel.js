import { WhatsAppAPI as NodeHTTPMiddleware } from "./node-http.js";
import { WhatsAppAPIError } from "../errors.js";
class WhatsAppAPI extends NodeHTTPMiddleware {
  /**
   * POST request handler for Vercel serverless functions
   *
   * @remarks This method expects the request body to be the original string, not a parsed body
   * @see https://vercel.com/guides/how-do-i-get-the-raw-body-of-a-serverless-function
   *
   * @example
   * ```ts
   * import type { VercelRequest, VercelResponse } from "@vercel/node";
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/vercel";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET",
   *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
   * });
   *
   * // The `bodyParser: false` is required for the middleware to work
   * export const config = {
   *     api: {
   *        bodyParser: false
   *     }
   * };
   *
   * export default async (req: VercelRequest, res: VercelResponse) => {
   *     if (req.method === "POST") {
   *         res.status(await Whatsapp.handle_post(req));
   *         res.end();
   *     }
   * };
   * ```
   *
   * @param req - The request object
   * @returns The status code to be sent to the client
   */
  handle_post(req) {
    return super.handle_post(req);
  }
  /**
   * GET request handler for Vercel serverless functions
   *
   * @example
   * ```ts
   * import type { VercelRequest, VercelResponse } from "@vercel/node";
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/vercel";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET",
   *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
   * });
   *
   * export default (req: VercelRequest, res: VercelResponse) => {
   *     if (req.method === "GET") {
   *         try {
   *             res.end(Whatsapp.handle_get(req));
   *             res.status(200);
   *         } catch (e) {
   *             res.status(e as number).end();
   *         }
   *     }
   * };
   * ```
   *
   * @override
   * @param req - The request object
   * @returns The challenge string to be sent to the client
   * @throws The error code
   */
  handle_get(req) {
    try {
      return this.get(req.query);
    } catch (e) {
      throw e instanceof WhatsAppAPIError ? e.httpStatus : 500;
    }
  }
}
export {
  WhatsAppAPI
};
//# sourceMappingURL=vercel.js.map
