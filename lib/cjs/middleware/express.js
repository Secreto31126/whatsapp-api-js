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
var express_exports = {};
__export(express_exports, {
  WhatsAppAPI: () => WhatsAppAPI
});
module.exports = __toCommonJS(express_exports);
var import_globals = require("./globals.js");
var import_utils = require("../utils.js");
class WhatsAppAPI extends import_globals.WhatsAppAPIMiddleware {
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
  async handle_post(req) {
    try {
      return this.post(
        JSON.parse(req.body ?? "{}"),
        req.body,
        req.header("x-hub-signature-256")
      );
    } catch (e) {
      return (0, import_utils.isInteger)(e) ? e : 500;
    }
  }
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
//# sourceMappingURL=express.js.map
