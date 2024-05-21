import { WhatsAppAPIMiddleware } from "./globals.js";
import { isInteger } from "../utils.js";
class WhatsAppAPI extends WhatsAppAPIMiddleware {
  /**
   * POST request handler for node:http server
   *
   * @example
   * ```ts
   * import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/node-http";
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
  async handle_post(req) {
    async function parseBody(readable) {
      const chunks = [];
      for await (const chunk of readable) {
        chunks.push(
          typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
      }
      return Buffer.concat(chunks).toString("utf-8");
    }
    try {
      const body = await parseBody(req);
      const signature = req.headers["x-hub-signature-256"];
      if (typeof signature !== "string")
        throw 400;
      return this.post(JSON.parse(body || "{}"), body, signature);
    } catch (e) {
      return isInteger(e) ? e : 500;
    }
  }
  /**
   * GET request handler for node:http server
   *
   * @example
   * ```ts
   * import { createServer, IncomingMessage, ServerResponse } from 'node:http';
   * import { WhatsAppAPI } from "whatsapp-api-js/middleware/node-http";
   *
   * const server = createServer((request: IncomingMessage, response: ServerResponse) => {
   *     if (request.url === "/message" && request.method === "GET") {
   *         try {
   *             response.statusCode = 200;
   *             response.end(Whatsapp.handle_get(request));
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
  handle_get(req) {
    try {
      return this.get(
        Object.fromEntries(
          new URL(req.url, `http://${req.headers.host}`).searchParams
        )
      );
    } catch (e) {
      throw isInteger(e) ? e : 500;
    }
  }
}
export {
  WhatsAppAPI
};
//# sourceMappingURL=node-http.js.map
