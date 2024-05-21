import { WhatsAppAPIMiddleware } from "./globals.js";
import { isInteger } from "../utils.js";
class WhatsAppAPI extends WhatsAppAPIMiddleware {
  /**
   * POST request handler for AdonisJS
   *
   * @example
   * ```ts
   * import Route from "@ioc:Adonis/Core/Route";
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/adonis";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET",
   *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
   * });
   *
   * Route.post('/', async ({ request, response }) => {
   *     response.status(await Whatsapp.handle_post(request));
   * });
   * ```
   *
   * @override
   * @param req - The request object from AdonisJS
   * @returns The status code to be sent to the client
   */
  async handle_post(req) {
    try {
      return await this.post(
        req.body(),
        req.raw() ?? "",
        req.header("x-hub-signature-256") ?? ""
      );
    } catch (e) {
      return isInteger(e) ? e : 500;
    }
  }
  /**
   * GET request handler for AdonisJS
   *
   * @example
   * ```ts
   * import Route from "@ioc:Adonis/Core/Route";
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/adonis";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET",
   *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
   * });
   *
   * Route.get('/', ({ request, response }) => {
   *     try {
   *         return Whatsapp.handle_get(request);
   *     } catch (e) {
   *         response.status(e as number);
   *     }
   * });
   * ```
   *
   * @override
   * @param req - The request object from AdonisJS
   * @returns The challenge string to be sent to the client
   * @throws The error code
   */
  handle_get(req) {
    try {
      return this.get(req.qs());
    } catch (e) {
      throw isInteger(e) ? e : 500;
    }
  }
}
export {
  WhatsAppAPI
};
//# sourceMappingURL=adonis.js.map
