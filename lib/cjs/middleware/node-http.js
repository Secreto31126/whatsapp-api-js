"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var node_http_exports = {};
__export(node_http_exports, {
  WhatsAppAPI: () => WhatsAppAPI
});
module.exports = __toCommonJS(node_http_exports);
var import_globals = require("./globals.js");
var import_utils = require("../utils.js");
class WhatsAppAPI extends import_globals.WhatsAppAPIMiddleware {
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
      if (typeof signature !== "string") throw 400;
      await this.post(JSON.parse(body || "{}"), body, signature);
      return 200;
    } catch (e) {
      return (0, import_utils.isInteger)(e) ? e : 500;
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
      throw (0, import_utils.isInteger)(e) ? e : 500;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WhatsAppAPI
});
//# sourceMappingURL=node-http.js.map
