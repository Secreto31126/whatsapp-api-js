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
var node_exports = {};
__export(node_exports, {
  Node15: () => Node15,
  Node18: () => Node18,
  NodeNext: () => NodeNext
});
module.exports = __toCommonJS(node_exports);
var import_node_crypto = require("node:crypto");
function NodeNext(settings) {
  return settings;
}
function Node18(settings) {
  return {
    ...settings,
    ponyfill: {
      subtle: import_node_crypto.webcrypto.subtle,
      ...settings.ponyfill
    }
  };
}
function Node15(settings, fetch_ponyfill) {
  return {
    ...settings,
    ponyfill: {
      fetch: fetch_ponyfill,
      subtle: import_node_crypto.webcrypto.subtle,
      ...settings.ponyfill
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Node15,
  Node18,
  NodeNext
});
//# sourceMappingURL=node.js.map
