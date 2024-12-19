import { WhatsAppAPI as WebStandardMiddleware } from "./web-standard.js";
class WhatsAppAPI extends WebStandardMiddleware {
  /**
   * POST request handler for Deno server
   *
   * @example
   * ```ts
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/deno";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET",
   *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
   * });
   *
   * Deno.serve(async (req) => {
   *     if (req.url === "/message" && req.method === "POST") {
   *         return new Response(null, {
   *             status: await Whatsapp.handle_post(req)
   *         });
   *     }
   * });
   * ```
   *
   * @param req - The request object
   * @returns The status code to be sent to the client
   */
  async handle_post(req) {
    return super.handle_post(req);
  }
  /**
   * GET request handler for Deno server
   *
   * @example
   * ```ts
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/deno";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET",
   *     webhookVerifyToken: "YOUR_WEBHOOK_VERIFY_TOKEN"
   * });
   *
   * Deno.serve((req) => {
   *     if (req.url === "/message" && req.method === "GET") {
   *         try {
   *             return new Response(Whatsapp.handle_get(req));
   *         } catch (e) {
   *             return new Response(null, { status: e as number });
   *         }
   *     }
   * });
   * ```
   *
   * @param req - The request object
   * @returns The challenge string to be sent to the client
   * @throws The error code
   */
  handle_get(req) {
    return super.handle_get(req);
  }
}
export {
  WhatsAppAPI
};
//# sourceMappingURL=deno.js.map
