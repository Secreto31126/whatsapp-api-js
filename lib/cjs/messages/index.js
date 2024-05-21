"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var messages_exports = {};
module.exports = __toCommonJS(messages_exports);
__reExport(messages_exports, require("./text.js"), module.exports);
__reExport(messages_exports, require("./location.js"), module.exports);
__reExport(messages_exports, require("./reaction.js"), module.exports);
__reExport(messages_exports, require("./contacts.js"), module.exports);
__reExport(messages_exports, require("./interactive.js"), module.exports);
__reExport(messages_exports, require("./media.js"), module.exports);
__reExport(messages_exports, require("./template.js"), module.exports);
__reExport(messages_exports, require("./globals.js"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ...require("./text.js"),
  ...require("./location.js"),
  ...require("./reaction.js"),
  ...require("./contacts.js"),
  ...require("./interactive.js"),
  ...require("./media.js"),
  ...require("./template.js"),
  ...require("./globals.js")
});
//# sourceMappingURL=index.js.map
