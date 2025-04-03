import { WhatsAppAPIMiddleware } from "./globals.js";
import { WhatsAppAPIError } from "../errors.js";
class WhatsAppAPI extends WhatsAppAPIMiddleware {
  /**
   * POST request handler for Azure Function
   *
   * @example
   * ```ts
   * import { app } from "@azure/functions";
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/azure";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET",
   *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
   * });
   *
   * app.http('WhatsAppPOST', {
   *     methods: ['POST'],
   *     authLevel: 'anonymous',
   *     route: 'message',
   *     handler: async (req) => ({
   *         status: await Whatsapp.handle_post(req)
   *     })
   * });
   * ```
   *
   * @override
   * @param req - The request object from Azure Functions
   * @returns The status code to be sent to the client
   */
  async handle_post(req) {
    try {
      const body = await req.text();
      await this.post(
        JSON.parse(body || "{}"),
        body,
        req.headers.get("x-hub-signature-256") ?? ""
      );
      return 200;
    } catch (e) {
      return e instanceof WhatsAppAPIError ? e.httpStatus : 500;
    }
  }
  /**
   * GET request handler for Azure Function
   *
   * @example
   * ```ts
   * import { app } from "@azure/functions";
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/azure";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET",
   *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
   * });
   *
   * app.http('WhatsAppGET', {
   *     methods: ['GET'],
   *     authLevel: 'anonymous',
   *     route: 'message',
   *     handler: async (req) => {
   *         try {
   *             return {
   *                 body: Whatsapp.handle_get(req)
   *             };
   *         } catch (e) {
   *             return {
   *                 status: e as number
   *             };
   *         }
   *     }
   * });
   * ```
   *
   * @override
   * @param req - The request object from Azure Functions
   * @returns The challenge string to be sent to the client
   * @throws The error code
   */
  handle_get(req) {
    try {
      return this.get(
        Object.fromEntries(new URL(req.url).searchParams)
      );
    } catch (e) {
      throw e instanceof WhatsAppAPIError ? e.httpStatus : 500;
    }
  }
}
export {
  WhatsAppAPI
};
//# sourceMappingURL=azure.js.map
