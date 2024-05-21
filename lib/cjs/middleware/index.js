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
var middleware_exports = {};
__export(middleware_exports, {
  AdonisMiddleware: () => import_adonis.WhatsAppAPI,
  BunMiddleware: () => import_bun.WhatsAppAPI,
  DenoMiddleware: () => import_deno.WhatsAppAPI,
  ExpressMiddleware: () => import_express.WhatsAppAPI,
  NodeHTTPMiddleware: () => import_node_http.WhatsAppAPI,
  SvelteKitMiddleware: () => import_sveltekit.WhatsAppAPI,
  VercelMiddleware: () => import_vercel.WhatsAppAPI,
  WebStandardMiddleware: () => import_web_standard.WhatsAppAPI,
  WhatsAppAPIMiddleware: () => import_globals.WhatsAppAPIMiddleware
});
module.exports = __toCommonJS(middleware_exports);
var import_globals = require("./globals.js");
var import_express = require("./express.js");
var import_adonis = require("./adonis.js");
var import_vercel = require("./vercel.js");
var import_deno = require("./deno.js");
var import_bun = require("./bun.js");
var import_sveltekit = require("./sveltekit.js");
var import_web_standard = require("./web-standard.js");
var import_node_http = require("./node-http.js");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AdonisMiddleware,
  BunMiddleware,
  DenoMiddleware,
  ExpressMiddleware,
  NodeHTTPMiddleware,
  SvelteKitMiddleware,
  VercelMiddleware,
  WebStandardMiddleware,
  WhatsAppAPIMiddleware
});
//# sourceMappingURL=index.js.map
