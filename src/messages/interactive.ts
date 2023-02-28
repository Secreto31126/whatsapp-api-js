import type {
    ClientMessage,
    ClientMessageComponent,
    ClientTypedMessageComponent
} from "../types.js";
import type Text from "./text.js";
import type { Document, Image, Video } from "./media.js";

/**
 * Interactive API object
 */
export class Interactive implements ClientMessage {
    /**
     * The action component of the interactive message
     */
    action:
        | ActionList
        | ActionButtons
        | ActionCatalog
        | ClientTypedMessageComponent;
    /**
     * The type of the interactive message
     */
    type: "list" | "button" | "product" | "product_list" | string;
    /**
     * The body component of the interactive message
     */
    body?: Body | ClientMessageComponent;
    /**
     * The header component of the interactive message
     */
    header?: Header | ClientMessageComponent;
    /**
     * The footer component of the interactive message
     */
    footer?: Footer | ClientMessageComponent;

    get _type(): "interactive" {
        return "interactive";
    }

    /**
     * Create an Interactive object for the API
     *
     * @param action - The action component of the interactive message
     * @param body - The body component of the interactive message
     * @param header - The header component of the interactive message
     * @param footer - The footer component of the interactive message
     * @throws If action is not provided
     * @throws If body is not provided, unless action is an ActionCatalog with a single product
     * @throws If header is provided for an ActionCatalog with a single product
     * @throws If header of type Text is not provided for an ActionCatalog with a product list
     * @throws If header is not of type text, unless action is an ActionButtons
     */
    constructor(
        action:
            | ActionList
            | ActionButtons
            | ActionCatalog
            | ClientTypedMessageComponent,
        body?: Body,
        header?: Header,
        footer?: Footer
    ) {
        if (!action)
            throw new Error("Interactive must have an action component");

        if (!action._type) {
            throw new Error(
                "Unexpected internal error (action._ is not defined)"
            );
        }

        if (action._type !== "product" && !body)
            throw new Error("Interactive must have a body component");
        if (action._type === "product" && header)
            throw new Error(
                "Interactive must not have a header component if action is a single product"
            );
        if (action._type === "product_list" && header?.type !== "text")
            throw new Error(
                "Interactive must have a Text header component if action is a product list"
            );
        if (header && action._type !== "button" && header?.type !== "text")
            throw new Error("Interactive header must be of type Text");

        this.type = action._type;

        this.action = action;
        if (body) this.body = body;
        if (header) this.header = header;
        if (footer) this.footer = footer;
    }

    _build() {
        return JSON.stringify(this);
    }
}

/**
 * Body API object
 */
export class Body {
    /**
     * The text of the body
     */
    text: string;

    /**
     * Builds a body component for an Interactive message
     *
     * @param text - The text of the message. Maximum length: 1024 characters.
     * @throws If text is not provided
     * @throws If text is over 1024 characters
     */
    constructor(text: string) {
        if (!text) throw new Error("Body must have a text object");
        if (text.length > 1024)
            throw new Error("Body text must be less than 1024 characters");

        this.text = text;
    }
}

/**
 * Footer API object
 */
export class Footer {
    /**
     * The text of the footer
     */
    text: string;

    /**
     * Builds a footer component for an Interactive message
     *
     * @param text - Text of the footer. Maximum length: 60 characters.
     * @throws If text is not provided
     * @throws If text is over 60 characters
     */
    constructor(text: string) {
        if (!text) throw new Error("Footer must have a text object");
        if (text.length > 60)
            throw new Error("Footer text must be 60 characters or less");

        this.text = text;
    }
}

/**
 * Header API object
 */
export class Header {
    /**
     * The type of the header
     */
    type: "text" | "video" | "image" | "document";
    /**
     * The text of the parameter
     */
    text?: string;
    /**
     * The image of the parameter
     */
    image?: Image;
    /**
     * The document of the parameter
     */
    document?: Document;
    /**
     * The video of the parameter
     */
    video?: Video;

    /**
     * Builds a header component for an Interactive message
     *
     * @param object - The message object for the header
     * @throws If object is not provided
     * @throws If object is not a Document, Image, Text, or Video
     * @throws If object is a Text and is over 60 characters
     * @throws If object is a Media and has a caption
     */
    constructor(object: Document | Image | Text | Video) {
        if (!object) throw new Error("Header must have an object");
        if (!object._type) {
            throw new Error(
                "Unexpected internal error (object._ is not defined)"
            );
        }

        if (!["text", "video", "image", "document"].includes(object._type))
            throw new Error(
                "Header object must be either Text, Video, Image or Document."
            );

        this.type = object._type;

        // Text type can go to hell
        if (object._type === "text") {
            if (object.body.length > 60)
                throw new Error("Header text must be 60 characters or less");
            this[object._type] = object.body;
        } else {
            // Now I think about it, all interactive can go to hell too
            if ("caption" in object)
                throw new Error(`Header ${this.type} must not have a caption`);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - TS dumb, the _ will always match the type
            this[this.type] = object;
        }
    }
}

/**
 * Action API object
 */
export class ActionButtons implements ClientTypedMessageComponent {
    /**
     * The buttons of the action
     */
    buttons: Button[];

    get _type(): "button" {
        return "button";
    }

    /**
     * Builds a reply buttons component for an Interactive message
     *
     * @param button - Buttons to be used in the reply buttons. Each button title must be unique within the message. Emojis are supported, markdown is not. Must be between 1 and 3 buttons.
     * @throws If no buttons are provided or are over 3
     * @throws If two or more buttons have the same id
     * @throws If two or more buttons have the same title
     */
    constructor(...button: Button[]) {
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
    }
}

/**
 * Button API object
 */
export class Button {
    /**
     * The type of the button
     */
    type: "reply";
    /**
     * The reply object of the row
     */
    reply: {
        /**
         * The id of the row
         */
        id: string;
        /**
         * The title of the row
         */
        title: string;
    };

    /**
     * Builds a button component for ActionButtons
     *
     * @param id - Unique identifier for your button. It cannot have leading or trailing spaces. This ID is returned in the webhook when the button is clicked by the user. Maximum length: 256 characters.
     * @param title - Button title. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
     * @throws If id is not provided
     * @throws If id is over 256 characters
     * @throws If id is malformed
     * @throws If title is not provided
     * @throws If title is over 20 characters
     */
    constructor(id: string, title: string) {
        if (!id) throw new Error("Button must have an id");
        if (id.length > 256)
            throw new Error("Button id must be 256 characters or less");
        if (/^ | $/.test(id))
            throw new Error("Button id cannot have leading or trailing spaces");
        if (!title) throw new Error("Button must have a title");
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
 */
export class ActionList implements ClientTypedMessageComponent {
    /**
     * The button text
     */
    button: string;
    /**
     * The sections of the action
     */
    sections: ListSection[];

    get _type(): "list" {
        return "list";
    }

    /**
     * Builds an action component for an Interactive message
     * Required if interactive type is "list"
     *
     * @param button - Button content. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
     * @param sections - Sections of the list
     * @throws If button is not provided
     * @throws If button is over 20 characters
     * @throws If no sections are provided or are over 10
     * @throws If more than 1 section is provided and at least one doesn't have a title
     */
    constructor(button: string, ...sections: ListSection[]) {
        if (!button) throw new Error("Action must have a button content");
        if (button.length > 20)
            throw new Error("Button content must be 20 characters or less");
        if (!sections.length || sections.length > 10)
            throw new Error("Action must have between 1 and 10 sections");
        if (sections.length > 1 && !sections.every((obj) => "title" in obj))
            throw new Error(
                "All sections must have a title if more than 1 section is provided"
            );

        this.button = button;
        this.sections = sections;
    }
}

/**
 * Section API object
 */
export class ListSection {
    /**
     * The rows of the section
     */
    rows: Row[];
    /**
     * The title of the section
     */
    title?: string;

    /**
     * Builds a section component for ActionList
     *
     * @param title - Title of the section, only required if there are more than one section
     * @param rows - Rows of the section
     * @throws If title is over 24 characters if provided
     * @throws If no rows are provided or are over 10
     */
    constructor(title: string, ...rows: Row[]) {
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
 */
export class Row {
    /**
     * The id of the row
     */
    id: string;
    /**
     * The title of the row
     */
    title: string;
    /**
     * The description of the row
     */
    description?: string;

    /**
     * Builds a row component for a Section
     *
     * @param id - The id of the row. Maximum length: 200 characters.
     * @param title - The title of the row. Maximum length: 24 characters.
     * @param description - The description of the row. Maximum length: 72 characters.
     * @throws If id is not provided
     * @throws If id is over 200 characters
     * @throws If title is not provided
     * @throws If title is over 24 characters
     * @throws If description is over 72 characters
     */
    constructor(id: string, title: string, description?: string) {
        if (!id) throw new Error("Row must have an id");
        if (id.length > 200)
            throw new Error("Row id must be 200 characters or less");
        if (!title) throw new Error("Row must have a title");
        if (title.length > 24)
            throw new Error("Row title must be 24 characters or less");
        if (description && description.length > 72)
            throw new Error("Row description must be 72 characters or less");

        this.id = id;
        this.title = title;
        if (description) this.description = description;
    }
}

/**
 * Action API object
 */
export class ActionCatalog implements ClientTypedMessageComponent {
    /**
     * The id of the catalog from where to get the products
     */
    catalog_id: string;
    /**
     * The product to be added to the catalog
     */
    product_retailer_id?: string;
    /**
     * The section to be added to the catalog
     */
    sections?: ProductSection[];

    get _type(): "product" | "product_list" {
        return this.product_retailer_id ? "product" : "product_list";
    }

    /**
     * Builds a catalog component for an Interactive message
     *
     * @param catalog_id - The catalog id
     * @param products - The products to add to the catalog
     * @throws If catalog_id is not provided
     * @throws If products is not provided
     * @throws If products is a single product and more than 1 product is provided
     * @throws If products is a product list and more than 10 sections are provided
     * @throws If products is a product list with more than 1 section and at least one section is missing a title
     */
    constructor(catalog_id: string, ...products: Product[] | ProductSection[]) {
        if (!catalog_id) throw new Error("Catalog must have a catalog id");
        if (!products.length)
            throw new Error(
                "Catalog must have at least one product or product section"
            );

        // TypeScript doesn't support type guards in array destructuring
        const first_product = products[0];
        const is_single_product = first_product instanceof Product;

        if (is_single_product && products.length > 1)
            throw new Error(
                "Catalog must have only 1 product, use a ProductSection instead"
            );
        else {
            if (products.length > 10)
                throw new Error(
                    "Catalog must have between 1 and 10 product sections"
                );
            if (products.length > 1) {
                for (const obj of products) {
                    if (!("title" in obj)) {
                        throw new Error(
                            "All sections must have a title if more than 1 section is provided"
                        );
                    }
                }
            }
        }

        this.catalog_id = catalog_id;

        if (is_single_product)
            this.product_retailer_id = first_product.product_retailer_id;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - TS doesn't know that if it's not a single product, it's a product list
        else this.sections = products;
    }
}

/**
 * Section API object
 */
export class ProductSection {
    /**
     * The title of the section
     */
    title?: string;
    /**
     * The products of the section
     */
    product_items: Product[];

    /**
     * Builds a product section component for an ActionCatalog
     *
     * @param title - The title of the product section, only required if more than 1 section will be used
     * @param products - The products to add to the product section
     * @throws If title is over 24 characters if provided
     * @throws If no products are provided or are over 30
     */
    constructor(title: string, ...products: Product[]) {
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
 */
export class Product {
    /**
     * The id of the product
     */
    product_retailer_id: string;

    /**
     * Builds a product component for ActionCart and ProductSection
     *
     * @param product_retailer_id - The id of the product
     * @throws If product_retailer_id is not provided
     */
    constructor(product_retailer_id: string) {
        if (!product_retailer_id)
            throw new Error("Product must have a product_retailer_id");
        this.product_retailer_id = product_retailer_id;
    }
}
