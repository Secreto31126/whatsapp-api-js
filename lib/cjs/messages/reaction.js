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
var reaction_exports = {};
__export(reaction_exports, {
  Reaction: () => Reaction
});
module.exports = __toCommonJS(reaction_exports);
var import_types = require("../types.js");
class Reaction extends import_types.ClientMessage {
  /**
   * The message's id to react to
   */
  message_id;
  /**
   * The reaction emoji
   */
  emoji;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "reaction";
  }
  /**
   * Create a Reaction object for the API
   *
   * @param message_id - The message's id (wamid) to react to
   * @param emoji - The emoji to react with, defaults to empty string to remove a reaction
   * @throws If a non-emoji or more than one emoji is provided
   */
  constructor(message_id, emoji = "") {
    super();
    if (emoji && !/^\p{Extended_Pictographic}$/u.test(emoji))
      throw new Error("Reaction emoji must be a single emoji");
    this.message_id = message_id;
    this.emoji = emoji;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Reaction
});
//# sourceMappingURL=reaction.js.map
