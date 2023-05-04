"use strict";
// This file is a stud for the documentation.
// You shouldn't import it as it might execute code for different platforms.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web = exports.Deno = exports.Bun = void 0;
/**
 * @module setup
 *
 * @description
 * Simplify the setup proccess of the WhatsAppAPI for different platforms
 *
 * @example
 * ```ts
 * import WhatsAppAPI from "whatsapp-api-js";
 * import { NodeNext } from "whatsapp-api-js/setup/node";
 *
 * const api = new WhatsAppAPI(NodeNext({
 *     token: "YOUR_TOKEN",
 *     appSecret: "YOUR_APP_SECRET"
 * }));
 * ```
 */
var bun_js_1 = require("./bun.js");
Object.defineProperty(exports, "Bun", { enumerable: true, get: function () { return __importDefault(bun_js_1).default; } });
var deno_js_1 = require("./deno.js");
Object.defineProperty(exports, "Deno", { enumerable: true, get: function () { return __importDefault(deno_js_1).default; } });
var web_js_1 = require("./web.js");
Object.defineProperty(exports, "Web", { enumerable: true, get: function () { return __importDefault(web_js_1).default; } });
__exportStar(require("./node.js"), exports);
//# sourceMappingURL=index.js.map