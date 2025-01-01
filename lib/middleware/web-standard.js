import { WhatsAppAPIMiddleware } from "./globals.js";
import { WhatsAppAPIError } from "../errors.js";
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
      throw e instanceof WhatsAppAPIError ? e.httpStatus : 500;
    }
  }
}
export {
  WhatsAppAPI
};
//# sourceMappingURL=web-standard.js.map
