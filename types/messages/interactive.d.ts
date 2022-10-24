/**
 * Interactive API object
 *
 * @property {(ActionList|ActionButtons)} action The action component of the interactive message
 * @property {Body} body The body component of the interactive message
 * @property {Header} [header] The header component of the interactive message
 * @property {Footer} [footer] The footer component of the interactive message
 * @property {String} [_] The type of the interactive message, for internal use only
 */
export class Interactive {
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
    constructor(action: (ActionList | ActionButtons | ActionCatalog), body: Body, header?: Header, footer?: Footer);
    type: string;
    action: ActionList | ActionButtons | ActionCatalog;
    body: Body;
    header: Header;
    footer: Footer;
    _: string;
}
/**
 * Body API object
 *
 * @property {String} text The text of the body
 */
export class Body {
    /**
     * Builds a body component for an Interactive message
     *
     * @param {String} text The text of the message. Maximum length: 1024 characters.
     * @throws {Error} If text is not provided
     * @throws {Error} If text is over 1024 characters
     */
    constructor(text: string);
    text: string;
}
/**
 * Footer API object
 *
 * @property {String} text The text of the body
 */
export class Footer {
    /**
     * Builds a footer component for an Interactive message
     *
     * @param {String} text Text of the footer. Maximum length: 60 characters.
     * @throws {Error} If text is not provided
     * @throws {Error} If text is over 60 characters
     */
    constructor(text: string);
    text: string;
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
export class Header {
    /**
     * Builds a header component for an Interactive message
     *
     * @param {(Document|Image|Text|Video)} object The message object for the header
     * @throws {Error} If object is not provided
     * @throws {Error} If object is not a Document, Image, Text, or Video
     * @throws {Error} If object is a Text and is over 60 characters
     */
    constructor(object: (Document | Image | Text | Video));
    type: string;
}
/**
 * Action API object
 *
 * @property {Array<Button>} buttons The buttons of the action
 * @property {String} [_] The type of the action, for internal use only
 */
export class ActionButtons {
    /**
     * Builds a reply buttons component for an Interactive message
     *
     * @param {...Button} button Buttons to be used in the reply buttons. Each button title must be unique within the message. Emojis are supported, markdown is not. Must be between 1 and 3 buttons.
     * @throws {Error} If no buttons are provided or are over 3
     * @throws {Error} If two or more buttons have the same id
     * @throws {Error} If two or more buttons have the same title
     */
    constructor(...button: Button[]);
    buttons: Button[];
    _: string;
}
/**
 * Button API object
 *
 * @property {String} type The type of the button
 * @property {String} reply.id The id of the row
 * @property {String} reply.title The title of the row
 */
export class Button {
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
    constructor(id: string, title: string);
    type: string;
}
/**
 * Action API object
 *
 * @property {String} button The button text
 * @property {Array<Section>} sections The sections of the action
 * @property {String} [_] The type of the action, for internal use only
 */
export class ActionList {
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
    constructor(button: string, ...sections: ListSection[]);
    _: string;
    button: string;
    sections: ListSection[];
}
/**
 * Section API object
 *
 * @property {String} [title] The title of the section
 * @property {Array<Row>} rows The rows of the section
 */
export class ListSection {
    /**
     * Builds a section component for ActionList
     *
     * @param {String} title Title of the section, only required if there are more than one section
     * @param {...Row} rows Rows of the section
     * @throws {Error} If title is over 24 characters if provided
     * @throws {Error} If no rows are provided or are over 10
     */
    constructor(title: string, ...rows: Row[]);
    title: string;
    rows: Row[];
}
/**
 * Row API object
 *
 * @property {String} id The id of the row
 * @property {String} title The title of the row
 * @property {String} [description] The description of the row
 */
export class Row {
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
    constructor(id: string, title: string, description?: string);
    id: string;
    title: string;
    description: string;
}
/**
 * Action API object
 *
 * @property {String} catalog_id The id of the catalog from where to get the products
 * @property {String} [product_retailer_id] The product to be added to the catalog
 * @property {Array<ProductSection>} [sections] The section to be added to the catalog
 * @property {String} [_] The type of the action, for internal use only
 */
export class ActionCatalog {
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
    constructor(catalog_id: string, ...products: (Product | ProductSection)[]);
    catalog_id: string;
    product_retailer_id: string;
    sections: (Product | ProductSection)[];
    _: string;
}
/**
 * Section API object
 *
 * @property {String} [title] The title of the section
 * @property {Array<Product>} product_items The products of the section
 */
export class ProductSection {
    /**
     * Builds a product section component for an ActionCatalog
     *
     * @param {String} [title] The title of the product section
     * @param {...Product} products The products to add to the product section
     * @throws {Error} If title is over 24 characters if provided
     * @throws {Error} If no products are provided or are over 30
     */
    constructor(title?: string, ...products: Product[]);
    title: string;
    product_items: Product[];
}
/**
 * Product API object
 *
 * @property {String} product_retailer_id The id of the product
 */
export class Product {
    /**
     * Builds a product component for ActionCart and ProductSection
     *
     * @param {String} product_retailer_id The id of the product
     * @throws {Error} If product_retailer_id is not provided
     */
    constructor(product_retailer_id: string);
    product_retailer_id: string;
}
import { Document } from "./media";
import { Image } from "./media";
import Text = require("./text");
import { Video } from "./media";
//# sourceMappingURL=interactive.d.ts.map