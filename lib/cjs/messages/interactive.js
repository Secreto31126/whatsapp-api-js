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
var interactive_exports = {};
__export(interactive_exports, {
  ActionButtons: () => ActionButtons,
  ActionCTA: () => ActionCTA,
  ActionCatalog: () => ActionCatalog,
  ActionDataExchangeFlow: () => ActionDataExchangeFlow,
  ActionFlow: () => ActionFlow,
  ActionList: () => ActionList,
  ActionLocation: () => ActionLocation,
  ActionNavigateFlow: () => ActionNavigateFlow,
  ActionProduct: () => ActionProduct,
  ActionProductList: () => ActionProductList,
  Body: () => Body,
  Button: () => Button,
  Footer: () => Footer,
  Header: () => Header,
  Interactive: () => Interactive,
  ListSection: () => ListSection,
  Row: () => Row
});
module.exports = __toCommonJS(interactive_exports);
var import_types = require("../types.js");
class Interactive extends import_types.ClientMessage {
  /**
   * The action for the interactive message
   */
  action;
  /**
   * The body for the interactive message
   */
  body;
  /**
   * The header for the interactive message
   */
  header;
  /**
   * The footer for the interactive message
   */
  footer;
  /**
   * The type of the interactive message
   */
  type;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "interactive";
  }
  /**
   * Create an Interactive object for the API
   *
   * @param action - The action for the interactive message
   * @param body - The body for the interactive message, it may be undefined if not needed.
   * @param header - The header for the interactive message, it may be undefined if not needed.
   * @param footer - The footer for the interactive message, it may be undefined if not needed.
   * @throws If a header is provided for an {@link ActionList}, {@link ActionProductList}, {@link ActionCTA} or {@link ActionFlow} and it's not of type "text"
   */
  constructor(action, body, header, footer) {
    super();
    const require_text_header = [
      "list",
      "product_list",
      "cta_url",
      "flow"
    ];
    if (header && require_text_header.includes(action._type) && header.type !== "text") {
      throw new Error(
        `Header of type text is required for ${action._type} action`
      );
    }
    this.type = action._type;
    this.action = action;
    if (body)
      this.body = body;
    if (header)
      this.header = header;
    if (footer)
      this.footer = footer;
  }
}
class Body {
  /**
   * The text of the body
   */
  text;
  /**
   * Builds a body component for an Interactive message
   *
   * @param text - The text of the message. Maximum length: 1024 characters.
   * @throws If text is over 1024 characters
   */
  constructor(text) {
    if (text.length > 1024)
      throw new Error("Body text must be less than 1024 characters");
    this.text = text;
  }
}
class Footer {
  /**
   * The text of the footer
   */
  text;
  /**
   * Builds a footer component for an Interactive message
   *
   * @param text - Text of the footer. Maximum length: 60 characters.
   * @throws If text is over 60 characters
   */
  constructor(text) {
    if (text.length > 60)
      throw new Error("Footer text must be 60 characters or less");
    this.text = text;
  }
}
class Header {
  /**
   * The type of the header
   */
  type;
  /**
   * The text of the parameter
   */
  text;
  /**
   * The image of the parameter
   */
  image;
  /**
   * The document of the parameter
   */
  document;
  /**
   * The video of the parameter
   */
  video;
  /**
   * Builds a header component for an Interactive message
   *
   * @param object - The message object for the header
   * @throws If object is a string and is over 60 characters
   * @throws If object is a Media and has a caption
   */
  constructor(object) {
    if (typeof object === "string") {
      if (object.length > 60)
        throw new Error("Header text must be 60 characters or less");
      this.type = "text";
    } else {
      this.type = object._type;
      if (object.caption)
        throw new Error(`Header ${this.type} must not have a caption`);
    }
    this[this.type] = object;
  }
}
class ActionButtons extends import_types.ClientLimitedMessageComponent {
  /**
   * The buttons of the action
   */
  buttons;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "button";
  }
  /**
   * Builds a reply buttons component for an Interactive message
   *
   * @param button - Buttons to be used in the reply buttons. Each button title must be unique within the message. Emojis are supported, markdown is not. Must be between 1 and 3 buttons.
   * @throws If more than 3 buttons are provided
   * @throws If two or more buttons have the same id
   * @throws If two or more buttons have the same title
   */
  constructor(...button) {
    super("Reply buttons", "button", button, 3);
    const ids = button.map((b) => b[b.type].id);
    if (ids.length !== new Set(ids).size)
      throw new Error("Reply buttons must have unique ids");
    const titles = button.map((b) => b[b.type].title);
    if (titles.length !== new Set(titles).size)
      throw new Error("Reply buttons must have unique titles");
    this.buttons = button;
  }
}
class Button {
  /**
   * The type of the button
   */
  type;
  /**
   * The reply object of the row
   */
  reply;
  /**
   * Builds a button component for ActionButtons
   *
   * @param id - Unique identifier for your button. It cannot have leading or trailing spaces. This ID is returned in the webhook when the button is clicked by the user. Maximum length: 256 characters.
   * @param title - Button title. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
   * @throws If id is over 256 characters
   * @throws If id is malformed
   * @throws If title is an empty string
   * @throws If title is over 20 characters
   */
  constructor(id, title) {
    if (id.length > 256)
      throw new Error("Button id must be 256 characters or less");
    if (/^ | $/.test(id))
      throw new Error("Button id cannot have leading or trailing spaces");
    if (!title.length)
      throw new Error("Button title cannot be an empty string");
    if (title.length > 20)
      throw new Error("Button title must be 20 characters or less");
    this.type = "reply";
    this.reply = {
      title,
      id
    };
  }
}
class ActionList extends import_types.ClientLimitedMessageComponent {
  /**
   * The button text
   */
  button;
  /**
   * The sections of the action
   */
  sections;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "list";
  }
  /**
   * Builds an action component for an Interactive message
   * Required if interactive type is "list"
   *
   * @param button - Button content. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
   * @param sections - Sections of the list
   * @throws If button is an empty string
   * @throws If button is over 20 characters
   * @throws If more than 10 sections are provided
   * @throws If more than 1 section is provided and at least one doesn't have a title
   */
  constructor(button, ...sections) {
    super("Action", "sections", sections, 10);
    if (!button.length)
      throw new Error("Button content cannot be an empty string");
    if (button.length > 20)
      throw new Error("Button content must be 20 characters or less");
    if (sections.length > 1 && !sections.every((obj) => !!obj.title))
      throw new Error(
        "All sections must have a title if more than 1 section is provided"
      );
    this.button = button;
    this.sections = sections;
  }
}
class ListSection extends import_types.Section {
  /**
   * The rows of the section
   */
  rows;
  /**
   * Builds a list section component for ActionList
   *
   * @param title - Title of the section, only required if there are more than one section
   * @param rows - Rows of the list section
   * @throws If title is over 24 characters if provided
   * @throws If more than 10 rows are provided
   */
  constructor(title, ...rows) {
    super("ListSection", "rows", rows, 10, title);
    this.rows = rows;
  }
}
class Row {
  /**
   * The id of the row
   */
  id;
  /**
   * The title of the row
   */
  title;
  /**
   * The description of the row
   */
  description;
  /**
   * Builds a row component for a ListSection
   *
   * @param id - The id of the row. Maximum length: 200 characters.
   * @param title - The title of the row. Maximum length: 24 characters.
   * @param description - The description of the row. Maximum length: 72 characters.
   * @throws If id is over 200 characters
   * @throws If title is over 24 characters
   * @throws If description is over 72 characters
   */
  constructor(id, title, description) {
    if (id.length > 200)
      throw new Error("Row id must be 200 characters or less");
    if (title.length > 24)
      throw new Error("Row title must be 24 characters or less");
    if (description && description.length > 72)
      throw new Error("Row description must be 72 characters or less");
    this.id = id;
    this.title = title;
    if (description)
      this.description = description;
  }
}
class ActionCatalog {
  /**
   * The name of the component
   */
  name;
  /**
   * The thumbnail product to be shown in the catalog
   */
  parameters;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "catalog_message";
  }
  /**
   * Builds a catalog component for an Interactive message
   *
   * @remarks
   * Seems like the API throws an error if you try to send a catalog
   * message without a thumbnail, but the signature will keep the
   * optional parameter in case WhatsApp decides to make their API
   * work as expected :)
   *
   * @param thumbnail - The thumbnail product to be shown in the catalog. If not provided, the first product will be used (or so says the docs, but it doesn't work).
   */
  constructor(thumbnail) {
    this.name = "catalog_message";
    if (thumbnail) {
      this.parameters = {
        thumbnail_product_retailer_id: thumbnail.product_retailer_id
      };
    }
  }
}
class ActionProduct {
  /**
   * The id of the catalog from where to get the products
   */
  catalog_id;
  /**
   * The product to show in the message
   */
  product_retailer_id;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "product";
  }
  /**
   * Builds a Single Product component for an Interactive message
   *
   * @param catalog_id - The catalog id
   * @param product - The product to show in the message
   */
  constructor(catalog_id, product) {
    this.catalog_id = catalog_id;
    this.product_retailer_id = product.product_retailer_id;
  }
}
class ActionProductList extends import_types.ClientLimitedMessageComponent {
  /**
   * The id of the catalog from where to get the products
   */
  catalog_id;
  /**
   * The sections to show in the message
   */
  sections;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "product_list";
  }
  /**
   * Builds a Multi Product component for an Interactive message
   *
   * @param catalog_id - The catalog id
   * @param sections - The product sections to show in the message
   * @throws If more than 10 product sections are provided
   * @throws If more than 1 product section is provided and at least one section is missing a title
   */
  constructor(catalog_id, ...sections) {
    super("ActionProductList", "sections", sections, 10);
    if (sections.length > 1) {
      for (const obj of sections) {
        if (!obj.title) {
          throw new Error(
            "All sections must have a title if more than 1 section is provided"
          );
        }
      }
    }
    this.catalog_id = catalog_id;
    this.sections = sections;
  }
}
class ActionCTA {
  /**
   * The name of the component
   */
  name = "cta_url";
  /**
   * The CTA parameters
   */
  parameters;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "cta_url";
  }
  /**
   * Builds a call-to-action component for an Interactive message
   *
   * @param display_text - The text to be displayed in the CTA button
   * @param url - The url to be opened when the CTA button is clicked
   */
  constructor(display_text, url) {
    this.parameters = {
      display_text,
      url
    };
  }
}
class ActionFlow {
  /**
   * The name of the component
   */
  name = "flow";
  /**
   * The Flow parameters
   *
   * @remarks TSDoc is unable to document this type properly, so most of
   * the documentation is in the subclasses constructors instead.
   */
  parameters;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "flow";
  }
  /**
   * Builds a flow component for an Interactive message
   *
   * @param parameters - The Flow parameters
   * @throws If parameters.flow_cta is empty or over 20 characters
   * @throws If parameters.flow_cta contains emojis
   */
  constructor(parameters) {
    if (!parameters.flow_cta.length || parameters.flow_cta.length > 20) {
      throw new Error("Flow CTA must be between 1 and 20 characters");
    }
    if (/\p{Extended_Pictographic}/u.test(parameters.flow_cta)) {
      throw new Error("Flow CTA must not contain emoji");
    }
    this.parameters = parameters;
  }
}
class ActionNavigateFlow extends ActionFlow {
  /**
   * Builds a navigate flow component for an Interactive message
   *
   * @param flow_token - Flow token that is generated by the business to serve as an identifier
   * @param flow_id - ID of the Flow provided by WhatsApp
   * @param flow_cta - Text on the CTA button, character limit - 20 characters (no emoji)
   * @param screen - The ID of the first Screen
   * @param data - Optional input data for the first Screen of the Flow. If provided, this must be a non-empty object.
   * @param mode - The Flow can be in either "draft" or "published" mode
   * @param flow_message_version - The Flow version, must be "3"
   * @throws If flow_cta is empty or over 20 characters
   * @throws If flow_cta contains emojis
   * @throws If data is provided and is an empty object
   */
  constructor(flow_token, flow_id, flow_cta, screen, data, mode = "published", flow_message_version = "3") {
    super({
      mode,
      flow_message_version,
      flow_token,
      flow_id,
      flow_cta,
      flow_action: "navigate",
      flow_action_payload: {
        screen,
        data
      }
    });
    if (data && !Object.keys(data).length) {
      throw new Error("Flow data must be a non-empty object if provided");
    }
  }
}
class ActionDataExchangeFlow extends ActionFlow {
  /**
   * Builds a data exchange flow component for an Interactive message
   *
   * @param flow_token - Flow token that is generated by the business to serve as an identifier
   * @param flow_id - ID of the Flow provided by WhatsApp
   * @param flow_cta - Text on the CTA button, character limit - 20 characters (no emoji)
   * @param mode - Must be "published" or "draft"
   * @param flow_message_version - Must be "3"
   */
  constructor(flow_token, flow_id, flow_cta, mode = "published", flow_message_version = "3") {
    super({
      mode,
      flow_message_version,
      flow_token,
      flow_id,
      flow_cta,
      flow_action: "data_exchange"
    });
  }
}
class ActionLocation {
  /**
   * The name of the component
   */
  name = "send_location";
  /**
   * @override
   * @internal
   */
  get _type() {
    return "location_request_message";
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionButtons,
  ActionCTA,
  ActionCatalog,
  ActionDataExchangeFlow,
  ActionFlow,
  ActionList,
  ActionLocation,
  ActionNavigateFlow,
  ActionProduct,
  ActionProductList,
  Body,
  Button,
  Footer,
  Header,
  Interactive,
  ListSection,
  Row
});
//# sourceMappingURL=interactive.js.map
