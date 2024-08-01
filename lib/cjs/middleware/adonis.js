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
var adonis_exports = {};
__export(adonis_exports, {
  WhatsAppAPI: () => WhatsAppAPI
});
module.exports = __toCommonJS(adonis_exports);
var import_globals = require("./globals.js");
var import_utils = require("../utils.js");
class WhatsAppAPI extends import_globals.WhatsAppAPIMiddleware {
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
      await this.post(
        req.body(),
        req.raw() ?? "",
        req.header("x-hub-signature-256") ?? ""
      );
      return 200;
    } catch (e) {
      return (0, import_utils.isInteger)(e) ? e : 500;
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
      throw (0, import_utils.isInteger)(e) ? e : 500;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WhatsAppAPI
});
//# sourceMappingURL=adonis.js.map
