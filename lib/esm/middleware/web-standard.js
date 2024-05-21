import { WhatsAppAPIMiddleware } from "./globals.js";
import { isInteger } from "../utils.js";
class WhatsAppAPI extends WhatsAppAPIMiddleware {
  /**
   * POST request handler for Web Standard API http server
   *
   * @override
   * @param req - The request object
   * @returns The status code to be sent to the client
   */
  async handle_post(req) {
    try {
      const body = await req.text();
      return this.post(
        JSON.parse(body || "{}"),
        body,
        req.headers.get("x-hub-signature-256") ?? ""
      );
    } catch (e) {
      return isInteger(e) ? e : 500;
    }
  }
  /**
   * GET request handler for Web Standard API http server
   *
   * @override
   * @param req - The request object
   * @returns The challenge string to be sent to the client
   * @throws The error code
   */
  handle_get(req) {
    try {
      return this.get(
        Object.fromEntries(new URL(req.url).searchParams)
      );
    } catch (e) {
      throw isInteger(e) ? e : 500;
    }
  }
}
export {
  WhatsAppAPI
};
//# sourceMappingURL=web-standard.js.map
