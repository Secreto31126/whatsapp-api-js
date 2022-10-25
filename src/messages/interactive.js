const Text = require("./text");
const { Image, Document, Video } = require("./media");

/**
 * Interactive API object
 *
 * @property {(ActionList|ActionButtons)} action The action component of the interactive message
 * @property {Body} body The body component of the interactive message
 * @property {Header} [header] The header component of the interactive message
 * @property {Footer} [footer] The footer component of the interactive message
 * @property {String} [_] The type of the interactive message, for internal use only
 */
class Interactive {
    /**
     * Create an Interactive object for the API
     *
     * @param {(ActionList|ActionButtons|ActionCatalog)} action The action component of the interactive message
     * @param {Body} body The body component of the interactive message
     * @param {Header} [header] The header component of the interactive message
     * @param {Footer} [footer] The footer component of the interactive message
     * @throws {Error} If action is not provided
     * @throws {Error} If body is not provided, unless action is an ActionCatalog with a single product
     * @throws {Error} If header is provided for an ActionCatalog with a single product
     * @throws {Error} If header of type Text is not provided for an ActionCatalog with a product list
     */
    constructor(action, body, header, footer) {
        if (!action)
            throw new Error("Interactive must have an action component");
        if (action._ !== "product" && !body)
            throw new Error("Interactive must have a body component");
        if (action._ === "product" && header)
            throw new Error(
                "Interactive must not have a header component if action is a single product"
            );
        if (action._ === "product_list" && header?.type !== "text")
            throw new Error(
                "Interactive must have a Text header component if action is a product list"
            );

        this.type = action._;
        delete action._;

        this.action = action;
        if (body) this.body = body;
        if (header) this.header = header;
        if (footer) this.footer = footer;

        this._ = "interactive";
    }
}

/**
 * Body API object
 *
 * @property {String} text The text of the body
 */
class Body {
    /**
     * Builds a body component for an Interactive message
     *
     * @param {String} text The text of the message. Maximum length: 1024 characters.
     * @throws {Error} If text is not provided
     * @throws {Error} If text is over 1024 characters
     */
    constructor(text) {
        if (!text) throw new Error("Body must have a text object");
        if (text.length > 1024)
            throw new Error("Body text must be less than 1024 characters");

        this.text = text;
    }
}

/**
 * Footer API object
 *
 * @property {String} text The text of the body
 */
class Footer {
    /**
     * Builds a footer component for an Interactive message
     *
     * @param {String} text Text of the footer. Maximum length: 60 characters.
     * @throws {Error} If text is not provided
     * @throws {Error} If text is over 60 characters
     */
    constructor(text) {
        if (!text) throw new Error("Footer must have a text object");
        if (text.length > 60)
            throw new Error("Footer text must be 60 characters or less");

        this.text = text;
    }
}

/**
 * Header API object
 *
 * @property {String} type The type of the header
 * @property {String} [text] The text of the parameter
 * @property {Image} [image] The image of the parameter
 * @property {Document} [document] The document of the parameter
 * @property {Video} [video] The video of the parameter
 */
class Header {
    /**
     * Builds a header component for an Interactive message
     *
     * @param {(Document|Image|Text|Video)} object The message object for the header
     * @throws {Error} If object is not provided
     * @throws {Error} If object is not a Document, Image, Text, or Video
     * @throws {Error} If object is a Text and is over 60 characters
     */
    constructor(object) {
        if (!object) throw new Error("Header must have an object");
        if (!["text", "video", "image", "document"].includes(object._))
            throw new Error(
                "Header object must be either Text, Video, Image or Document."
            );

        this.type = object._;
        delete object._;

        // Text type can go to hell
        if (object instanceof Text) {
            if (object.body.length > 60)
                throw new Error("Header text must be 60 characters or less");
            this[this.type] = object.body;
        } else this[this.type] = object;
    }
}

/**
 * Action API object
 *
 * @property {Array<Button>} buttons The buttons of the action
 * @property {String} [_] The type of the action, for internal use only
 */
class ActionButtons {
    /**
     * Builds a reply buttons component for an Interactive message
     *
     * @param {...Button} button Buttons to be used in the reply buttons. Each button title must be unique within the message. Emojis are supported, markdown is not. Must be between 1 and 3 buttons.
     * @throws {Error} If no buttons are provided or are over 3
     * @throws {Error} If two or more buttons have the same id
     * @throws {Error} If two or more buttons have the same title
     */
    constructor(...button) {
        if (!button.length || button.length > 3)
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
        this._ = "button";
    }
}

/**
 * Button API object
 *
 * @property {String} type The type of the button
 * @property {String} reply.id The id of the row
 * @property {String} reply.title The title of the row
 */
class Button {
    /**
     * Builds a button component for ActionButtons
     *
     * @param {String} id Unique identifier for your button. It cannot have leading or trailing spaces. This ID is returned in the webhook when the button is clicked by the user. Maximum length: 256 characters.
     * @param {String} title Button title. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
     * @throws {Error} If id is not provided
     * @throws {Error} If id is over 256 characters
     * @throws {Error} If title is not provided
     * @throws {Error} If title is over 20 characters
     */
    constructor(id, title) {
        if (!id) throw new Error("Button must have an id");
        if (id.length > 256)
            throw new Error("Button id must be 256 characters or less");
        if (/^ | $/.test(id))
            throw new Error("Button id cannot have leading or trailing spaces");
        if (!title) throw new Error("Button must have a title");
        if (title.length > 20)
            throw new Error("Button title must be 20 characters or less");

        this.type = "reply";
        this[this.type] = {
            title,
            id
        };
    }
}

/**
 * Action API object
 *
 * @property {String} button The button text
 * @property {Array<Section>} sections The sections of the action
 * @property {String} [_] The type of the action, for internal use only
 */
class ActionList {
    /**
     * Builds an action component for an Interactive message
     * Required if interactive type is "list"
     *
     * @param {String} button Button content. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
     * @param  {...ListSection} sections Sections of the list
     * @throws {Error} If button is not provided
     * @throws {Error} If button is over 20 characters
     * @throws {Error} If no sections are provided or are over 10
     * @throws {Error} If more than 1 section is provided and at least one doesn't have a title
     */
    constructor(button, ...sections) {
        if (!button) throw new Error("Action must have a button content");
        if (button.length > 20)
            throw new Error("Button content must be 20 characters or less");
        if (!sections.length || sections.length > 10)
            throw new Error("Action must have between 1 and 10 sections");
        if (
            sections.length > 1 &&
            !sections.every((obj) =>
                Object.prototype.hasOwnProperty.call(obj, "title")
            )
        )
            throw new Error(
                "All sections must have a title if more than 1 section is provided"
            );

        this._ = "list";
        this.button = button;
        this.sections = sections;
    }
}

/**
 * Section API object
 *
 * @property {String} [title] The title of the section
 * @property {Array<Row>} rows The rows of the section
 */
class ListSection {
    /**
     * Builds a section component for ActionList
     *
     * @param {String} title Title of the section, only required if there are more than one section
     * @param {...Row} rows Rows of the section
     * @throws {Error} If title is over 24 characters if provided
     * @throws {Error} If no rows are provided or are over 10
     */
    constructor(title, ...rows) {
        if (title && title.length > 24)
            throw new Error("Section title must be 24 characters or less");
        if (!rows.length || rows.length > 10)
            throw new Error("Section must have between 1 and 10 rows");

        if (title) this.title = title;
        this.rows = rows;
    }
}

/**
 * Row API object
 *
 * @property {String} id The id of the row
 * @property {String} title The title of the row
 * @property {String} [description] The description of the row
 */
class Row {
    /**
     * Builds a row component for a Section
     *
     * @param {String} id The id of the row. Maximum length: 200 characters.
     * @param {String} title The title of the row. Maximum length: 24 characters.
     * @param {String} [description] The description of the row. Maximum length: 72 characters.
     * @throws {Error} If id is not provided
     * @throws {Error} If id is over 200 characters
     * @throws {Error} If title is not provided
     * @throws {Error} If title is over 24 characters
     * @throws {Error} If description is over 72 characters
     */
    constructor(id, title, description) {
        if (!id) throw new Error("Row must have an id");
        if (id.length > 200)
            throw new Error("Row id must be 200 characters or less");
        if (!title) throw new Error("Row must have a title");
        if (title.length > 24)
            throw new Error("Row title must be 24 characters or less");
        // Yours truly, JScheck.
        if (!description?.length || description.length > 72)
            throw new Error("Row description must be 72 characters or less");

        this.id = id;
        this.title = title;
        if (description) this.description = description;
    }
}

/**
 * Action API object
 *
 * @property {String} catalog_id The id of the catalog from where to get the products
 * @property {String} [product_retailer_id] The product to be added to the catalog
 * @property {Array<ProductSection>} [sections] The section to be added to the catalog
 * @property {String} [_] The type of the action, for internal use only
 */
class ActionCatalog {
    /**
     * Builds a catalog component for an Interactive message
     *
     * @param {String} catalog_id The catalog id
     * @param {...(Product|ProductSection)} products The products to add to the catalog
     * @throws {Error} If catalog_id is not provided
     * @throws {Error} If products is not provided
     * @throws {Error} If products is a single product and more than 1 product is provided
     * @throws {Error} If products is a product list and more than 10 sections are provided
     * @throws {Error} If products is a product list with more than 1 section and at least one section is missing a title
     */
    constructor(catalog_id, ...products) {
        if (!catalog_id) throw new Error("Catalog must have a catalog id");
        if (!products.length)
            throw new Error(
                "Catalog must have at least one product or product section"
            );

        const is_single_product = products[0] instanceof Product;

        if (is_single_product && products.length > 1)
            throw new Error(
                "Catalog must have only 1 product, use a ProductSection instead"
            );
        else {
            if (products.length > 10)
                throw new Error(
                    "Catalog must have between 1 and 10 product sections"
                );
            if (
                products.length > 1 &&
                !products.every((obj) =>
                    Object.prototype.hasOwnProperty.call(obj, "title")
                )
            )
                throw new Error(
                    "All sections must have a title if more than 1 section is provided"
                );
        }

        this.catalog_id = catalog_id;
        // Yours truly, JScheck.
        if (products[0] instanceof Product)
            this.product_retailer_id = products[0].product_retailer_id;
        else this.sections = products;
        this._ = is_single_product ? "product" : "product_list";
    }
}

/**
 * Section API object
 *
 * @property {String} [title] The title of the section
 * @property {Array<Product>} product_items The products of the section
 */
class ProductSection {
    /**
     * Builds a product section component for an ActionCatalog
     *
     * @param {String} [title] The title of the product section
     * @param {...Product} products The products to add to the product section
     * @throws {Error} If title is over 24 characters if provided
     * @throws {Error} If no products are provided or are over 30
     */
    constructor(title, ...products) {
        if (title && title.length > 24)
            throw new Error("Section title must be 24 characters or less");
        if (!products.length || products.length > 30)
            throw new Error("Section must have between 1 and 30 products");

        if (title) this.title = title;
        this.product_items = products;
    }
}

/**
 * Product API object
 *
 * @property {String} product_retailer_id The id of the product
 */
class Product {
    /**
     * Builds a product component for ActionCart and ProductSection
     *
     * @param {String} product_retailer_id The id of the product
     * @throws {Error} If product_retailer_id is not provided
     */
    constructor(product_retailer_id) {
        if (!product_retailer_id)
            throw new Error("Product must have a product_retailer_id");
        this.product_retailer_id = product_retailer_id;
    }
}

module.exports = {
    Interactive,
    Body,
    Footer,
    Header,
    ActionButtons,
    Button,
    ActionList,
    ListSection,
    Row,
    ActionCatalog,
    ProductSection,
    Product
};
