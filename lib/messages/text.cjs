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

// src/messages/text.ts
var text_exports = {};
__export(text_exports, {
  Text: () => Text
});
module.exports = __toCommonJS(text_exports);

// src/types.ts
var ClientMessage = class {
  /**
   * The message built as a string. In most cases it's just JSON.stringify(this)
   *
   * @internal
   */
  _build() {
    return JSON.stringify(this);
  }
};

// src/messages/text.ts
var Text = class extends ClientMessage {
  /**
   * Body of the message. Maximum length: 4096 characters.
   */
  body;
  /**
   * Whether to enable preview for the text message
   */
  preview_url;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "text";
  }
  /**
   * Create a Text object for the API
   *
   * @example
   * ```ts
   * import { Text } from "whatsapp-api-js/messages";
   *
   * const text_message = new Text("Hello world!");
   *
   * const text_preview_message = new Text("Hello URL!", true);
   * ```
   *
   * @param body - The content of the text message which can contain formatting and URLs which begin with http:// or https://
   * @param preview_url - By default, WhatsApp recognizes URLs and makes them clickable, but you can also include a preview box with more information about the link. Set this field to true if you want to include a URL preview box.
   * @throws If body is over 4096 characters
   */
  constructor(body, preview_url) {
    super();
    if (body.length > 4096)
      throw new Error("Text body must be less than 4096 characters");
    this.body = body;
    if (preview_url) this.preview_url = preview_url;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Text
});
