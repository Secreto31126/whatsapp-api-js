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

// src/messages/template.ts
var template_exports = {};
__export(template_exports, {
  BodyComponent: () => BodyComponent,
  BodyParameter: () => BodyParameter,
  ButtonComponent: () => ButtonComponent,
  CarouselCard: () => CarouselCard,
  CarouselComponent: () => CarouselComponent,
  CatalogComponent: () => CatalogComponent,
  CopyComponent: () => CopyComponent,
  Currency: () => Currency,
  DateTime: () => DateTime,
  FlowComponent: () => FlowComponent,
  HeaderComponent: () => HeaderComponent,
  HeaderParameter: () => HeaderParameter,
  LTOComponent: () => LTOComponent,
  Language: () => Language,
  MPMComponent: () => MPMComponent,
  PayloadComponent: () => PayloadComponent,
  SkipButtonComponent: () => SkipButtonComponent,
  Template: () => Template,
  URLComponent: () => URLComponent
});
module.exports = __toCommonJS(template_exports);

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
var ClientLimitedMessageComponent = class {
  /**
   * Throws an error if the array length is greater than the specified number.
   *
   * @param p - The parent component name
   * @param c - The component name
   * @param a - The array to check the length of
   * @param n - The maximum length
   * @throws `${p} can't have more than ${n} ${c}`
   */
  constructor(p, c, a, n) {
    if (a.length > n) {
      throw new Error(`${p} can't have more than ${n} ${c}`);
    }
  }
};

// src/messages/template.ts
var Template = class _Template extends ClientMessage {
  /**
   * The name of the template
   */
  name;
  /**
   * The language of the template
   */
  language;
  /**
   * The components of the template
   */
  components;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "template";
  }
  /**
   * Create a Template object for the API
   *
   * @example
   * ```ts
   * import {
   *     Template,
   *     HeaderComponent,
   *     HeaderParameter,
   *     BodyComponent,
   *     BodyParameter,
   *     Currency,
   *     DateTime
   * } from "whatsapp-api-js/messages";
   *
   * const template_variables_message = new Template(
   *     "template_name",
   *     "en",
   *     new HeaderComponent(
   *         new HeaderParameter("Hello"),
   *         new HeaderParameter(new Currency(1.5 * 1000, "USD", "U$1.5")),
   *         new HeaderParameter(new DateTime("01/01/2023"))
   *     ),
   *     new BodyComponent(
   *         new BodyParameter("Hello"),
   *         new BodyParameter(new Currency(1.5 * 1000, "USD", "U$1.5")),
   *         new BodyParameter(new DateTime("01/01/2023"))
   *     )
   * );
   * ```
   *
   * @param name - Name of the template
   * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
   * @param components - Components objects containing the parameters of the message. For text-based templates, the only supported component is {@link BodyComponent}.
   * @throws If the template isn't text-based (only one {@link BodyComponent} is given) and one of the parameters is a string and it's over 1024 characters.
   */
  constructor(name, language, ...components) {
    super();
    this.name = name;
    this.language = typeof language === "string" ? new Language(language) : language;
    if (components.length) {
      const pointers = {
        theres_only_body: components.length === 1 && components[0] instanceof BodyComponent,
        button_counter: 0
      };
      this.components = components.map((cmpt) => cmpt._build(pointers)).filter((e) => !!e);
    }
  }
  /**
   * OTP Template generator
   *
   * @example
   * ```ts
   * import { Template } from "whatsapp-api-js/messages";
   *
   * const template_otp_message = Template.OTP("template_name", "en", "123456");
   * ```
   *
   * @param name - Name of the template
   * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
   * @param code - The one time password to be sent
   * @returns A Template object for the API
   */
  static OTP(name, language, code) {
    return new _Template(
      name,
      language,
      new BodyComponent(new BodyParameter(code)),
      new URLComponent(code)
    );
  }
};
var Language = class {
  /**
   * The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
   */
  code;
  /**
   * The language policy
   */
  policy;
  /**
   * Create a Language component for a Template message
   *
   * @param code - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
   * @param policy - The language policy the message should follow. The only supported option is 'deterministic'.
   */
  constructor(code, policy = "deterministic") {
    this.policy = policy;
    this.code = code;
  }
};
var Currency = class {
  /**
   * The amount of the currency by 1000
   */
  amount_1000;
  /**
   * The currency code
   */
  code;
  /**
   * The fallback value
   */
  fallback_value;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "currency";
  }
  /**
   * Builds a currency object for a Parameter
   *
   * @param amount_1000 - Amount multiplied by 1000
   * @param code - Currency code as defined in ISO 4217
   * @param fallback_value - Default text if localization fails
   * @throws If amount_1000 is not greater than 0
   */
  constructor(amount_1000, code, fallback_value) {
    if (amount_1000 <= 0)
      throw new Error("Currency must have an amount_1000 greater than 0");
    this.amount_1000 = amount_1000;
    this.code = code;
    this.fallback_value = fallback_value;
  }
};
var DateTime = class {
  /**
   * The fallback value
   */
  fallback_value;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "date_time";
  }
  /**
   * Builds a date_time object for a Parameter
   *
   * @param fallback_value - Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
   */
  constructor(fallback_value) {
    this.fallback_value = fallback_value;
  }
};
var ButtonComponent = class {
  /**
   * The type of the component
   */
  type = "button";
  /**
   * The subtype of the component
   */
  sub_type;
  /**
   * The parameter of the component
   */
  parameters;
  /**
   * The index of the component (assigned after calling _build)
   */
  index = NaN;
  /**
   * Builds a button component for a Template message.
   * The index of each component is defined by the order they are sent to the Template's constructor.
   *
   * @internal
   * @param sub_type - The type of button component to create.
   * @param parameter - The parameter for the component. The index of each component is defined by the order they are sent to the Template's constructor.
   */
  constructor(sub_type, parameter) {
    this.sub_type = sub_type;
    this.parameters = [parameter];
  }
  /**
   * @override
   * @internal
   */
  _build(pointers) {
    this.index = pointers.button_counter++;
    return this;
  }
};
var URLComponent = class _URLComponent extends ButtonComponent {
  /**
   * Creates a button component for a Template message with call to action buttons.
   *
   * @param parameter - The variable for the url button.
   * @throws If parameter is an empty string.
   */
  constructor(parameter) {
    super("url", new _URLComponent.Button(parameter));
  }
  /**
   * @internal
   */
  static Button = class {
    type = "text";
    text;
    /**
     * Creates a parameter for a Template message with call to action buttons.
     *
     * @param text - The text of the button
     * @throws If text is an empty string
     */
    constructor(text) {
      if (!text.length) {
        throw new Error("Button parameter can't be an empty string");
      }
      this.text = text;
    }
  };
};
var PayloadComponent = class _PayloadComponent extends ButtonComponent {
  /**
   * Creates a button component for a Template message with quick reply buttons.
   *
   * @param parameter - Parameter for the component.
   * @throws If parameter is an empty string.
   */
  constructor(parameter) {
    super("quick_reply", new _PayloadComponent.Button(parameter));
  }
  /**
   * @internal
   */
  static Button = class {
    type = "payload";
    payload;
    /**
     * Creates a parameter for a Template message with quick reply buttons.
     *
     * @param payload - The id of the button.
     * @throws If payload is an empty string.
     */
    constructor(payload) {
      if (!payload.length) {
        throw new Error("Button parameter can't be an empty string");
      }
      this.payload = payload;
    }
  };
};
var CatalogComponent = class _CatalogComponent extends ButtonComponent {
  /**
   * Creates a button component for a Template catalog button.
   *
   * @param thumbnail - The product to use as thumbnail.
   */
  constructor(thumbnail) {
    super("catalog", new _CatalogComponent.Action(thumbnail));
  }
  /**
   * @internal
   */
  static Action = class {
    type = "action";
    action;
    /**
     * Creates a parameter for a Template message with a catalog button.
     *
     * @param thumbnail - The product to use as thumbnail.
     */
    constructor(thumbnail) {
      this.action = {
        thumbnail_product_retailer_id: thumbnail.product_retailer_id
      };
    }
  };
};
var MPMComponent = class _MPMComponent extends ButtonComponent {
  /**
   * Creates a button component for a MPM Template.
   *
   * @param thumbnail - The product to use as thumbnail.
   * @param sections - The sections of the MPM. Must have between 1 and 10 sections. Must have less than 30 products *across* all sections.
   * @throws If sections is over 10 elements.
   * @throws If sections is over 1 element and one of the sections doesn't have a title.
   */
  constructor(thumbnail, ...sections) {
    super("mpm", new _MPMComponent.Action(thumbnail, sections));
  }
  /**
   * @internal
   */
  static Action = class extends ClientLimitedMessageComponent {
    type = "action";
    action;
    /**
     * Creates a parameter for a MPM Template.
     *
     * @param thumbnail - The product to use as thumbnail.
     * @param sections - The sections of the MPM. Must have between 1 and 10 sections.
     * @throws If sections is over 10 elements.
     * @throws If sections is over 1 element and one of the sections doesn't have a title.
     */
    constructor(thumbnail, sections) {
      super("MPMComponent", "sections", sections, 10);
      if (sections.length > 1) {
        if (!sections.every((s) => !!s.title)) {
          throw new Error(
            "All sections must have a title if more than 1 section is provided"
          );
        }
      }
      this.action = {
        thumbnail_product_retailer_id: thumbnail.product_retailer_id,
        sections
      };
    }
  };
};
var CopyComponent = class _CopyComponent extends ButtonComponent {
  /**
   * Creates a button component for a Template message with copy coupon button.
   *
   * @param parameter - The coupon's code of the button to copy.
   * @throws If parameter is an empty string.
   */
  constructor(parameter) {
    super("copy_code", new _CopyComponent.Action(parameter));
  }
  /**
   * @internal
   */
  static Action = class {
    type = "coupon_code";
    coupon_code;
    /**
     * Creates a parameter for a Template message with copy coupon button.
     *
     * @param coupon_code - The coupon's code of the button.
     * @throws If coupon_code is an empty string.
     */
    constructor(coupon_code) {
      if (!coupon_code.length) {
        throw new Error("Action coupon_code can't be an empty string");
      }
      this.coupon_code = coupon_code;
    }
  };
};
var FlowComponent = class _FlowComponent extends ButtonComponent {
  /**
   * Creates a button component for a Template message with flow button.
   *
   * @param flow_token - Honestly, I don't know what this is, the documentation only says this might be "FLOW_TOKEN" and defaults to "unused".
   * @param flow_action_data - JSON object with the data payload for the first screen.
   */
  constructor(flow_token, flow_action_data) {
    super("flow", new _FlowComponent.Action(flow_token, flow_action_data));
  }
  /**
   * @internal
   */
  static Action = class {
    type = "action";
    action;
    /**
     * Creates a parameter for a Template message with flow button.
     *
     * @param flow_token - Idk, some string.
     * @param flow_action_data - JSON object with the data payload for the first screen.
     */
    constructor(flow_token, flow_action_data) {
      this.action = {
        flow_token,
        flow_action_data
      };
    }
  };
};
var SkipButtonComponent = class extends ButtonComponent {
  /**
   * Skips a button component index for a Template message.
   */
  constructor() {
    super();
  }
  /**
   * @override
   * @internal
   */
  _build(pointers) {
    pointers.button_counter++;
    return null;
  }
};
var HeaderComponent = class {
  /**
   * The type of the component
   */
  type;
  /**
   * The parameters of the component
   */
  parameters;
  /**
   * Builds a header component for a Template message
   *
   * @param parameters - Parameters of the body component
   */
  constructor(...parameters) {
    this.type = "header";
    this.parameters = parameters;
  }
  /**
   * @override
   * @internal
   */
  _build() {
    return this;
  }
};
var HeaderParameter = class {
  /**
   * The type of the parameter
   */
  type;
  /**
   * The text of the parameter
   */
  text;
  /**
   * The currency of the parameter
   */
  currency;
  /**
   * The datetime of the parameter
   */
  date_time;
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
   * The location of the parameter
   */
  location;
  /**
   * The product of the parameter
   */
  product;
  /**
   * Builds a parameter object for a HeaderComponent.
   * For text parameter, the character limit is 60.
   * For Document parameter, only PDF documents are supported for document-based message templates (not checked).
   * For Location parameter, the location must have a name and address.
   *
   * @param parameter - The parameter to be used in the template's header
   * @throws If parameter is a string and it's over 60 characters
   * @throws If parameter is a Location and it doesn't have a name and address
   */
  constructor(parameter) {
    if (typeof parameter === "string") {
      if (parameter.length > 60)
        throw new Error("Header text must be 60 characters or less");
      this.type = "text";
    } else {
      if (parameter._type === "location" && !(parameter.name && parameter.address)) {
        throw new Error("Header location must have a name and address");
      }
      this.type = parameter._type;
    }
    Object.defineProperty(this, this.type, {
      value: parameter,
      enumerable: true
    });
  }
};
var BodyComponent = class {
  /**
   * The type of the component
   */
  type;
  /**
   * The parameters of the component
   */
  parameters;
  /**
   * Builds a body component for a Template message
   *
   * @param parameters - Parameters of the body component
   */
  constructor(...parameters) {
    this.type = "body";
    this.parameters = parameters;
  }
  /**
   * @override
   * @internal
   * @throws If theres_only_body is false and one of the parameters is a string and it's over 1024 characters
   */
  _build({ theres_only_body }) {
    if (!theres_only_body) {
      for (const param of this.parameters) {
        if (param.text && param.text?.length > 1024) {
          throw new Error(
            "Body text must be 1024 characters or less"
          );
        }
      }
    }
    return this;
  }
};
var BodyParameter = class {
  /**
   * The type of the parameter
   */
  type;
  /**
   * The text of the parameter
   */
  text;
  /**
   * The currency of the parameter
   */
  currency;
  /**
   * The datetime of the parameter
   */
  date_time;
  /**
   * Builds a parameter object for a BodyComponent.
   * For text parameter, the character limit is 32768 if only one BodyComponent is used for the Template, else it's 1024.
   *
   * @param parameter - The parameter to be used in the template
   * @throws If parameter is a string and it's over 32768 characters
   * @throws If parameter is a string, there are other components in the Template and it's over 1024 characters
   * @see {@link BodyComponent._build} The method that checks the 1024 character limit
   */
  constructor(parameter) {
    if (typeof parameter === "string") {
      if (parameter.length > 32768)
        throw new Error("Body text must be 32768 characters or less");
      this.type = "text";
    } else {
      this.type = parameter._type;
    }
    Object.defineProperty(this, this.type, {
      value: parameter,
      enumerable: true
    });
  }
};
var CarouselComponent = class extends ClientLimitedMessageComponent {
  /**
   * The type of the component
   */
  type = "carousel";
  /**
   * The cards of the component
   */
  cards;
  /**
   * Builds a carousel component for a Template message
   *
   * @param cards - The cards of the component
   * @throws If cards is over 10 elements
   */
  constructor(...cards) {
    super("CarouselComponent", "CarouselCard", cards, 10);
    const pointers = {
      counter: 0
    };
    this.cards = cards.map((cmpt) => cmpt._build(pointers));
  }
  /**
   * @override
   * @internal
   */
  _build() {
    return this;
  }
};
var CarouselCard = class {
  /**
   * The index of the card (assigned after calling _build)
   */
  card_index = NaN;
  /**
   * The components of the card
   */
  components;
  /**
   * Builds a carousel card for a CarouselComponent.
   *
   * @remarks
   * If this looks odly similar to Template constructor's signature, it's because it is.
   *
   * @param header - The header parameter for the card
   * @param components - The other components for the card
   */
  constructor(header, ...components) {
    const tmp = new Template(
      "",
      "",
      new HeaderComponent(new HeaderParameter(header)),
      ...components
    );
    this.components = tmp.components;
  }
  /**
   * @override
   * @internal
   */
  _build(ptr) {
    this.card_index = ptr.counter++;
    return this;
  }
};
var LTOComponent = class {
  /**
   * The type of the component
   */
  type = "limited_time_offer";
  /**
   * The parameters of the component
   */
  parameters;
  /**
   * Builds a limited-time offer component for a Template message
   *
   * @param expiration - Offer code expiration time as a UNIX timestamp in milliseconds
   * @throws If expiration is negative
   */
  constructor(expiration) {
    if (expiration < 0) {
      throw new Error(
        "Expiration time must be a positive Unix timestamp"
      );
    }
    this.parameters = [
      {
        type: "limited_time_offer",
        limited_time_offer: {
          expiration_time_ms: expiration
        }
      }
    ];
  }
  /**
   * @override
   * @internal
   */
  _build() {
    return this;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BodyComponent,
  BodyParameter,
  ButtonComponent,
  CarouselCard,
  CarouselComponent,
  CatalogComponent,
  CopyComponent,
  Currency,
  DateTime,
  FlowComponent,
  HeaderComponent,
  HeaderParameter,
  LTOComponent,
  Language,
  MPMComponent,
  PayloadComponent,
  SkipButtonComponent,
  Template,
  URLComponent
});
