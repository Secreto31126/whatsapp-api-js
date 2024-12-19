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
var vercel_exports = {};
__export(vercel_exports, {
  WhatsAppAPI: () => WhatsAppAPI
});
module.exports = __toCommonJS(vercel_exports);
var import_node_http = require("./node-http.js");
var import_utils = require("../utils.js");
class WhatsAppAPI extends import_node_http.WhatsAppAPI {
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
      throw (0, import_utils.isInteger)(e) ? e : 500;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WhatsAppAPI
});
//# sourceMappingURL=vercel.js.map
