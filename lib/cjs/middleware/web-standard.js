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
var web_standard_exports = {};
__export(web_standard_exports, {
  WhatsAppAPI: () => WhatsAppAPI
});
module.exports = __toCommonJS(web_standard_exports);
var import_globals = require("./globals.js");
var import_utils = require("../utils.js");
class WhatsAppAPI extends import_globals.WhatsAppAPIMiddleware {
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
      return (0, import_utils.isInteger)(e) ? e : 500;
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
      throw (0, import_utils.isInteger)(e) ? e : 500;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WhatsAppAPI
});
//# sourceMappingURL=web-standard.js.map
