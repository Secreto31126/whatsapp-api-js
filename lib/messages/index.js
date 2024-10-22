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
var Section = class extends ClientLimitedMessageComponent {
  /**
   * The title of the section
   */
  title;
  /**
   * Builds a section component
   *
   * @param name - The name of the section's type
   * @param keys_name - The name of the section's keys
   * @param elements - The elements of the section
   * @param max - The maximum number of elements in the section
   * @param title - The title of the section
   * @param title_length - The maximum length of the title
   * @throws If more than N elements are provided
   * @throws If title is over 24 characters if provided
   */
  constructor(name, keys_name, elements, max, title, title_length = 24) {
    super(name, keys_name, elements, max);
    if (title) {
      if (title.length > title_length) {
        throw new Error(
          `${name} title must be ${title_length} characters or less`
        );
      }
      this.title = title;
    }
  }
};
var ContactComponent = class {
  /**
   * @override
   * @internal
   */
  _build() {
    return this;
  }
};
var ContactMultipleComponent = class extends ContactComponent {
  /**
   * @override
   * @internal
   */
  get _many() {
    return true;
  }
};
var ContactUniqueComponent = class extends ContactComponent {
  /**
   * @override
   * @internal
   */
  get _many() {
    return false;
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

// src/messages/location.ts
var Location = class extends ClientMessage {
  /**
   * The latitude of the location
   */
  longitude;
  /**
   * The longitude of the location
   */
  latitude;
  /**
   * The name of the location
   */
  name;
  /**
   * The address of the location
   */
  address;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "location";
  }
  /**
   * Create a Location object for the API
   *
   * @example
   * ```ts
   * import { Location } from "whatsapp-api-js/messages";
   *
   * const location_message = new Location(0, 0);
   *
   * const location_named_message = new Location(0, 0, "My Store", "Address");
   * ```
   *
   * @param longitude - Longitude of the location
   * @param latitude - Latitude of the location
   * @param name - Name of the location
   * @param address - Address of the location, only displayed if name is present
   */
  constructor(longitude, latitude, name, address) {
    super();
    this.longitude = longitude;
    this.latitude = latitude;
    if (name) this.name = name;
    if (address) this.address = address;
  }
};

// src/messages/reaction.ts
var Reaction = class extends ClientMessage {
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
};

// src/messages/contacts.ts
var Contacts = class extends ClientMessage {
  /**
   * The contacts of the message
   */
  component;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "contacts";
  }
  /**
   * Create a Contacts object for the API
   *
   * @example
   * ```ts
   * import { Contacts, Name, Address, Phone } from "whatsapp-api-js/messages";
   *
   * const contact_message = new Contacts([
   *     new Name("John Doe", "John", "Doe", undefined, "Mr.", "Jr."),
   *     new Address(
   *         "United States",
   *         "US",
   *         "FL",
   *         "Miami",
   *         "221B Baker Street",
   *         "33101",
   *         "Mystery"
   *     ),
   *     new Phone("+123456789", "Mystery", "123456789")
   * ]);
   * ```
   *
   * @param contact - Array of contact's components
   * @throws If contact contains multiple of the same components and _many is set to false (for example, Name, Birthday and Organization)
   */
  constructor(...contact) {
    super();
    this.component = [];
    for (const components of contact) {
      const contact2 = {};
      for (const component of components) {
        const name = component._type;
        if (component._many) {
          if (!contact2[name]) {
            Object.defineProperty(contact2, name, {
              value: [],
              enumerable: true
            });
          }
          const pointer = contact2[name];
          pointer.push(component._build());
        } else {
          if (contact2[name])
            throw new Error(
              `Contact already has a ${name} component and _many is set to false`
            );
          contact2[name] = // reduce ts-ignore impact
          component._build();
        }
      }
      if (!contact2.name)
        throw new Error("Contact must have a name component");
      this.component.push(contact2);
    }
  }
  /**
   * @override
   * @internal
   */
  _build() {
    return JSON.stringify(this.component);
  }
};
var Address = class extends ContactMultipleComponent {
  /**
   * The country of the address
   */
  country;
  /**
   * The country code of the address
   */
  country_code;
  /**
   * The state of the address
   */
  state;
  /**
   * The city of the address
   */
  city;
  /**
   * The street of the address
   */
  street;
  /**
   * The zip code of the address
   */
  zip;
  /**
   * The type of the address
   */
  type;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "addresses";
  }
  /**
   * Builds an address object for a contact.
   * A contact can contain multiple addresses objects.
   *
   * @param country - Full country name
   * @param country_code - Two-letter country abbreviation
   * @param state - State abbreviation
   * @param city - City name
   * @param street - Street number and name
   * @param zip - ZIP code
   * @param type - Address type. Standard Values: HOME, WORK
   */
  constructor(country, country_code, state, city, street, zip, type) {
    super();
    if (country) this.country = country;
    if (country_code) this.country_code = country_code;
    if (state) this.state = state;
    if (city) this.city = city;
    if (street) this.street = street;
    if (zip) this.zip = zip;
    if (type) this.type = type;
  }
};
var Birthday = class extends ContactUniqueComponent {
  /**
   * The birthday of the contact
   */
  birthday;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "birthday";
  }
  /**
   * Builds a birthday object for a contact
   *
   * @param year - Year of birth (YYYY)
   * @param month - Month of birth (MM)
   * @param day - Day of birth (DD)
   * @throws If the year, month, or day doesn't have a valid length
   */
  constructor(year, month, day) {
    super();
    if (year.length !== 4) throw new Error("Year must be 4 digits");
    if (month.length !== 2) throw new Error("Month must be 2 digits");
    if (day.length !== 2) throw new Error("Day must be 2 digits");
    this.birthday = `${year}-${month}-${day}`;
  }
  /**
   * @override
   * @internal
   */
  _build() {
    return this.birthday;
  }
};
var Email = class extends ContactMultipleComponent {
  /**
   * The email of the contact
   */
  email;
  /**
   * The type of the email
   */
  type;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "emails";
  }
  /**
   * Builds an email object for a contact.
   * A contact can contain multiple emails objects.
   *
   * @param email - Email address
   * @param type - Email type. Standard Values: HOME, WORK
   */
  constructor(email, type) {
    super();
    if (email) this.email = email;
    if (type) this.type = type;
  }
};
var Name = class extends ContactUniqueComponent {
  /**
   * The formatted name of the contact
   */
  formatted_name;
  /**
   * The first name of the contact
   */
  first_name;
  /**
   * The last name of the contact
   */
  last_name;
  /**
   * The middle name of the contact
   */
  middle_name;
  /**
   * The suffix of the contact
   */
  suffix;
  /**
   * The prefix of the contact
   */
  prefix;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "name";
  }
  /**
   * Builds a name object for a contact, required for contacts.
   * The object requires a formatted_name and at least another property.
   *
   * @param formatted_name - Full name, as it normally appears
   * @param first_name - First name
   * @param last_name - Last name
   * @param middle_name - Middle name
   * @param suffix - Name suffix
   * @param prefix - Name prefix
   * @throws If no other component apart from formatted_name is defined
   */
  constructor(formatted_name, first_name, last_name, middle_name, suffix, prefix) {
    super();
    this.formatted_name = formatted_name;
    if (first_name) this.first_name = first_name;
    if (last_name) this.last_name = last_name;
    if (middle_name) this.middle_name = middle_name;
    if (suffix) this.suffix = suffix;
    if (prefix) this.prefix = prefix;
    if (Object.keys(this).length < 2) {
      throw new Error(
        "Name must have at least one of the following: first_name, last_name, middle_name, prefix, suffix"
      );
    }
  }
};
var Organization = class extends ContactUniqueComponent {
  /**
   * The company of the contact
   */
  company;
  /**
   * The department of the contact
   */
  department;
  /**
   * The title of the contact
   */
  title;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "org";
  }
  /**
   * Builds an organization object for a contact
   *
   * @param company - Name of the contact's company
   * @param department - Name of the contact's department
   * @param title - Contact's business title
   */
  constructor(company, department, title) {
    super();
    if (company) this.company = company;
    if (department) this.department = department;
    if (title) this.title = title;
  }
};
var Phone = class extends ContactMultipleComponent {
  /**
   * The phone number of the contact
   */
  phone;
  /**
   * The type of the phone number
   */
  type;
  /**
   * The WhatsApp ID of the contact
   */
  wa_id;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "phones";
  }
  /**
   * Builds a phone object for a contact.
   * A contact can contain multiple phones objects.
   *
   * @param phone - Phone number, automatically populated with the wa_id value as a formatted phone number
   * @param type - Phone type. Standard Values: CELL, MAIN, IPHONE, HOME, WORK
   * @param wa_id - WhatsApp ID
   */
  constructor(phone, type, wa_id) {
    super();
    if (phone) this.phone = phone;
    if (type) this.type = type;
    if (wa_id) this.wa_id = wa_id;
  }
};
var Url = class extends ContactMultipleComponent {
  /**
   * The URL of the contact
   */
  url;
  /**
   * The type of the URL
   */
  type;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "urls";
  }
  /**
   * Builds an url object for a contact.
   * A contact can contain multiple urls objects.
   *
   * @param url - URL
   * @param type - URL type. Standard Values: HOME, WORK
   */
  constructor(url, type) {
    super();
    if (url) this.url = url;
    if (type) this.type = type;
  }
};

// src/messages/interactive.ts
var Interactive = class extends ClientMessage {
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
    if (body) this.body = body;
    if (header) this.header = header;
    if (footer) this.footer = footer;
  }
};
var Body = class {
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
};
var Footer = class {
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
};
var Header = class {
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
};
var ActionButtons = class extends ClientLimitedMessageComponent {
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
};
var Button = class {
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
};
var ActionList = class extends ClientLimitedMessageComponent {
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
};
var ListSection = class extends Section {
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
};
var Row = class {
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
    if (description) this.description = description;
  }
};
var ActionCatalog = class {
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
};
var ActionProduct = class {
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
  constructor(p1, p2) {
    if (typeof p1 === "string") {
      this.catalog_id = p1;
      this.product_retailer_id = p2.product_retailer_id;
    } else {
      this.catalog_id = p1.catalog_id;
      this.product_retailer_id = p1.product_retailer_id;
    }
  }
};
var ActionProductList = class extends ClientLimitedMessageComponent {
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
};
var ActionCTA = class {
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
};
var ActionFlow = class {
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
};
var ActionNavigateFlow = class extends ActionFlow {
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
};
var ActionDataExchangeFlow = class extends ActionFlow {
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
};
var ActionLocation = class {
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
};

// src/messages/media.ts
var Media = class extends ClientMessage {
  /**
   * The id of the media
   */
  id;
  /**
   * The link of the media
   */
  link;
  /**
   * @param file - File to be sent
   * @param isItAnID - If the file is an ID (true) or an URL (false)
   */
  constructor(file, isItAnID = false) {
    super();
    this[isItAnID ? "id" : "link"] = file;
  }
};
var Audio = class extends Media {
  /**
   * @override
   * @internal
   */
  get _type() {
    return "audio";
  }
  /**
   * Create an Audio object for the API
   *
   * @example
   * ```ts
   * import { Audio } from "whatsapp-api-js/messages";
   *
   * const audio_message = new Audio("https://www.example.com/audio.mp3");
   *
   * const audio_id_message = new Audio("12345678", true);
   * ```
   *
   * @param audio - The audio file's link or id
   * @param isItAnID - Whether audio is an id (true) or a link (false)
   */
  constructor(audio, isItAnID = false) {
    super(audio, isItAnID);
  }
};
var Document = class extends Media {
  /**
   * The file's caption
   */
  caption;
  /**
   * The file's filename
   */
  filename;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "document";
  }
  /**
   * Create a Document object for the API
   *
   * @example
   * ```ts
   * import { Document } from "whatsapp-api-js/messages";
   *
   * const document_message = new Document("https://www.example.com/document.pdf");
   *
   * const document_id_message = new Document("12345678", true);
   *
   * const document_caption_message = new Document(
   *     "https://www.example.com/document.pdf",
   *     false,
   *     "Hello world!"
   * );
   *
   * const document_filename_message = new Document(
   *     "https://www.example.com/document.pdf",
   *     false,
   *     undefined,
   *     "a weird filename.pdf"
   * );
   * ```
   *
   * @param document - The document file's link or id
   * @param isItAnID - Whether document is an id (true) or a link (false)
   * @param caption - Describes the specified document media
   * @param filename - Describes the filename for the specific document
   */
  constructor(document, isItAnID = false, caption, filename) {
    super(document, isItAnID);
    if (caption) this.caption = caption;
    if (filename) this.filename = filename;
  }
};
var Image = class extends Media {
  /**
   * The file's caption
   */
  caption;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "image";
  }
  /**
   * Create a Image object for the API
   *
   * @example
   * ```ts
   * import { Image } from "whatsapp-api-js/messages";
   *
   * const image_message = new Image("https://i.imgur.com/4QfKuz1.png");
   *
   * const image_id_message = new Image("12345678", true);
   *
   * const image_caption_message = new Image(
   *     "https://i.imgur.com/4QfKuz1.png",
   *     false,
   *     "Hello world!"
   * );
   * ```
   *
   * @param image - The image file's link or id
   * @param isItAnID - Whether image is an id (true) or a link (false)
   * @param caption - Describes the specified image media
   */
  constructor(image, isItAnID = false, caption) {
    super(image, isItAnID);
    if (caption) this.caption = caption;
  }
};
var Sticker = class extends Media {
  /**
   * @override
   * @internal
   */
  get _type() {
    return "sticker";
  }
  /**
   * Create a Sticker object for the API
   *
   * @example
   * ```ts
   * import { Sticker } from "whatsapp-api-js/messages";
   *
   * const sticker_message = new Sticker("https://www.example.com/sticker.webp");
   *
   * const sticker_id_message = new Sticker("12345678", true);
   * ```
   *
   * @param sticker - The sticker file's link
   * @param isItAnID - Whether sticker is an id (true) or a link (false)
   */
  constructor(sticker, isItAnID = false) {
    super(sticker, isItAnID);
  }
};
var Video = class extends Media {
  /**
   * The file's caption
   */
  caption;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "video";
  }
  /**
   * Create a Video object for the API
   *
   * @example
   * ```ts
   * import { Video } from "whatsapp-api-js/messages";
   *
   * const video_message = new Video("https://www.example.com/video.mp4");
   *
   * const video_id_message = new Video("12345678", true);
   *
   * const video_caption_message = new Video(
   *     "https://www.example.com/video.mp4",
   *     false,
   *     "Hello world!"
   * );
   * ```
   *
   * @param video - The video file's link
   * @param isItAnID - Whether video is an id (true) or a link (false)
   * @param caption - Describes the specified video media
   */
  constructor(video, isItAnID = false, caption) {
    super(video, isItAnID);
    if (caption) this.caption = caption;
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

// src/messages/globals.ts
function isProductSections(obj) {
  return obj[0] instanceof ProductSection;
}
var ProductSection = class extends Section {
  /**
   * The products of the section
   */
  product_items;
  /**
   * Builds a product section component
   *
   * @param title - The title of the product section
   * @param products - The products to add to the product section
   * @throws If title is over 24 characters if provided
   * @throws If more than 30 products are provided
   */
  constructor(title, ...products) {
    super("ProductSection", "products", products, 30, title);
    this.product_items = products.map(Product.create);
  }
};
var Product = class _Product {
  /**
   * The id of the product
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
   * Builds a product component
   *
   * @param product_retailer_id - The id of the product
   */
  constructor(product_retailer_id) {
    this.product_retailer_id = product_retailer_id;
  }
  /**
   * Clone a product object (useful for lambdas and scoping down {@link CatalogProduct})
   *
   * @param product - The product to create a new object from
   * @returns A new product object
   */
  static create(product) {
    return new _Product(product.product_retailer_id);
  }
};
var CatalogProduct = class extends Product {
  /**
   * Builds a cataloged product component
   *
   * @param product_retailer_id - The id of the product
   * @param catalog_id - The id of the catalog the product belongs to
   */
  constructor(product_retailer_id, catalog_id) {
    super(product_retailer_id);
    this.catalog_id = catalog_id;
  }
};
export {
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
  Address,
  Audio,
  Birthday,
  Body,
  BodyComponent,
  BodyParameter,
  Button,
  ButtonComponent,
  CarouselCard,
  CarouselComponent,
  CatalogComponent,
  CatalogProduct,
  Contacts,
  CopyComponent,
  Currency,
  DateTime,
  Document,
  Email,
  FlowComponent,
  Footer,
  Header,
  HeaderComponent,
  HeaderParameter,
  Image,
  Interactive,
  LTOComponent,
  Language,
  ListSection,
  Location,
  MPMComponent,
  Media,
  Name,
  Organization,
  PayloadComponent,
  Phone,
  Product,
  ProductSection,
  Reaction,
  Row,
  SkipButtonComponent,
  Sticker,
  Template,
  Text,
  URLComponent,
  Url,
  Video,
  isProductSections
};
