/**
 * Interactive API object
 *
 * @group Interactive
 */
export class Interactive {
    /**
     * The action component of the interactive message
     */
    action;
    /**
     * The type of the interactive message
     */
    type;
    /**
     * The body component of the interactive message
     */
    body;
    /**
     * The header component of the interactive message
     */
    header;
    /**
     * The footer component of the interactive message
     */
    footer;
    get _type() {
        return "interactive";
    }
    /**
     * Create an Interactive object for the API
     *
     * @param action - The action component of the interactive message
     * @param body - The body component of the interactive message
     * @param header - The header component of the interactive message
     * @param footer - The footer component of the interactive message
     * @throws If body is not provided, unless action is an ActionCatalog with a single product
     * @throws If header is provided for an ActionCatalog with a single product
     * @throws If header of type text is not provided for an ActionCatalog with a product list
     * @throws If header is not of type text, unless action is an ActionButtons
     */
    constructor(action, body, header, footer) {
        if (action._type !== "product" && !body)
            throw new Error("Interactive must have a body component");
        if (action._type === "product" && header)
            throw new Error("Interactive must not have a header component if action is a single product");
        if (action._type === "product_list" && header?.type !== "text")
            throw new Error("Interactive must have a text header component if action is a product list");
        if (header && action._type !== "button" && header?.type !== "text")
            throw new Error("Interactive header must be of type text");
        this.type = action._type;
        this.action = action;
        if (body)
            this.body = body;
        if (header)
            this.header = header;
        if (footer)
            this.footer = footer;
    }
    _build() {
        return JSON.stringify(this);
    }
}
/**
 * Body API object
 *
 * @group Interactive
 */
export class Body {
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
/**
 * Footer API object
 *
 * @group Interactive
 */
export class Footer {
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
/**
 * Header API object
 *
 * @group Interactive
 */
export class Header {
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
        // All interactive's header can go to hell with its "exceptions"
        if (typeof object === "string") {
            if (object.length > 60)
                throw new Error("Header text must be 60 characters or less");
            this.type = "text";
        }
        else {
            this.type = object._type;
            if ("caption" in object)
                throw new Error(`Header ${this.type} must not have a caption`);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - TS dumb, the _type will always match the message type
        this[this.type] = object;
    }
}
/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionButtons {
    /**
     * The buttons of the action
     */
    buttons;
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
        if (button.length > 3)
            throw new Error("Reply buttons must have between 1 and 3 buttons");
        // Find if there are duplicates in button.id
        const ids = button.map((b) => b[b.type].id);
        if (ids.length !== new Set(ids).size)
            throw new Error("Reply buttons must have unique ids");
        // Find if there are duplicates in button.title
        const titles = button.map((b) => b[b.type].title);
        if (titles.length !== new Set(titles).size)
            throw new Error("Reply buttons must have unique titles");
        this.buttons = button;
    }
}
/**
 * Button API object
 *
 * @group Interactive
 */
export class Button {
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
     * @throws If title is over 20 characters
     */
    constructor(id, title) {
        if (id.length > 256)
            throw new Error("Button id must be 256 characters or less");
        if (/^ | $/.test(id))
            throw new Error("Button id cannot have leading or trailing spaces");
        if (title.length > 20)
            throw new Error("Button title must be 20 characters or less");
        this.type = "reply";
        this.reply = {
            title,
            id
        };
    }
}
/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionList {
    /**
     * The button text
     */
    button;
    /**
     * The sections of the action
     */
    sections;
    get _type() {
        return "list";
    }
    /**
     * Builds an action component for an Interactive message
     * Required if interactive type is "list"
     *
     * @param button - Button content. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
     * @param sections - Sections of the list
     * @throws If button is over 20 characters
     * @throws If more than 10 sections are provided
     * @throws If more than 1 section is provided and at least one doesn't have a title
     */
    constructor(button, ...sections) {
        if (button.length > 20)
            throw new Error("Button content must be 20 characters or less");
        if (sections.length > 10)
            throw new Error("Action must have between 1 and 10 sections");
        if (sections.length > 1 && !sections.every((obj) => "title" in obj))
            throw new Error("All sections must have a title if more than 1 section is provided");
        this.button = button;
        this.sections = sections;
    }
}
/**
 * Section API object
 *
 * @group Interactive
 */
export class ListSection {
    /**
     * The rows of the section
     */
    rows;
    /**
     * The title of the section
     */
    title;
    /**
     * Builds a section component for ActionList
     *
     * @param title - Title of the section, only required if there are more than one section
     * @param rows - Rows of the section
     * @throws If title is over 24 characters if provided
     * @throws If more than 10 rows are provided
     */
    constructor(title, ...rows) {
        if (title && title.length > 24)
            throw new Error("Section title must be 24 characters or less");
        if (!rows.length || rows.length > 10)
            throw new Error("Section must have between 1 and 10 rows");
        if (title)
            this.title = title;
        this.rows = rows;
    }
}
/**
 * Row API object
 *
 * @group Interactive
 */
export class Row {
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
     * Builds a row component for a Section
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
// TS knowledge intensifies
function isSections(obj) {
    return obj[0] instanceof ProductSection;
}
/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionCatalog {
    /**
     * The id of the catalog from where to get the products
     */
    catalog_id;
    /**
     * The product to be added to the catalog
     */
    product_retailer_id;
    /**
     * The section to be added to the catalog
     */
    sections;
    get _type() {
        return this.product_retailer_id ? "product" : "product_list";
    }
    /**
     * Builds a catalog component for an Interactive message
     *
     * @param catalog_id - The catalog id
     * @param products - The products to add to the catalog. It can be a _single_ Product object, or a list of ProductSections.
     * @throws If products is a product list and more than 10 sections are provided
     * @throws If products is a product list with more than 1 section and at least one section is missing a title
     */
    constructor(catalog_id, ...products) {
        const is_sections = isSections(products);
        if (is_sections) {
            if (products.length > 1) {
                if (products.length > 10)
                    throw new Error("Catalog must have between 1 and 10 product sections");
                for (const obj of products) {
                    if (!("title" in obj)) {
                        throw new Error("All sections must have a title if more than 1 section is provided");
                    }
                }
            }
        }
        this.catalog_id = catalog_id;
        if (is_sections)
            this.sections = products;
        else
            this.product_retailer_id = products[0].product_retailer_id;
    }
}
/**
 * Section API object
 *
 * @group Interactive
 */
export class ProductSection {
    /**
     * The title of the section
     */
    title;
    /**
     * The products of the section
     */
    product_items;
    /**
     * Builds a product section component for an ActionCatalog
     *
     * @param title - The title of the product section, only required if more than 1 section will be used
     * @param products - The products to add to the product section
     * @throws If title is over 24 characters if provided
     * @throws If more than 30 products are provided
     */
    constructor(title, ...products) {
        if (title && title.length > 24)
            throw new Error("Section title must be 24 characters or less");
        if (products.length > 30)
            throw new Error("Section must have between 1 and 30 products");
        if (title)
            this.title = title;
        this.product_items = products;
    }
}
/**
 * Product API object
 *
 * @group Interactive
 */
export class Product {
    /**
     * The id of the product
     */
    product_retailer_id;
    /**
     * Builds a product component for ActionCart and ProductSection
     *
     * @param product_retailer_id - The id of the product
     */
    constructor(product_retailer_id) {
        this.product_retailer_id = product_retailer_id;
    }
}
//# sourceMappingURL=interactive.js.map