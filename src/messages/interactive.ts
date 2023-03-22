import type {
    ClientMessage,
    ClientMessageComponent,
    ClientTypedMessageComponent
} from "../types.js";
import type { AtLeastOne } from "../utils.js";

import type Text from "./text.js";
import type { Document, Image, Video } from "./media.js";

/**
 * Interactive API object
 *
 * @group Interactive
 */
export class Interactive implements ClientMessage {
    /**
     * The action component of the interactive message
     */
    readonly action:
        | ActionList
        | ActionButtons
        | ActionCatalog
        | ClientTypedMessageComponent;
    /**
     * The type of the interactive message
     */
    readonly type: "list" | "button" | "product" | "product_list" | string;
    /**
     * The body component of the interactive message
     */
    readonly body?: Body | ClientMessageComponent;
    /**
     * The header component of the interactive message
     */
    readonly header?: Header | ClientMessageComponent;
    /**
     * The footer component of the interactive message
     */
    readonly footer?: Footer | ClientMessageComponent;

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
 *
 * @group Interactive
 */
export class Body {
    /**
     * The text of the body
     */
    readonly text: string;

    /**
     * Builds a body component for an Interactive message
     *
     * @param text - The text of the message. Maximum length: 1024 characters.
     * @throws If text is over 1024 characters
     */
    constructor(text: string) {
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
    readonly text: string;

    /**
     * Builds a footer component for an Interactive message
     *
     * @param text - Text of the footer. Maximum length: 60 characters.
     * @throws If text is over 60 characters
     */
    constructor(text: string) {
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
    readonly type: "text" | "video" | "image" | "document";
    /**
     * The text of the parameter
     */
    readonly text?: string;
    /**
     * The image of the parameter
     */
    readonly image?: Image;
    /**
     * The document of the parameter
     */
    readonly document?: Document;
    /**
     * The video of the parameter
     */
    readonly video?: Video;

    /**
     * Builds a header component for an Interactive message
     *
     * @param object - The message object for the header
     * @throws If object is not a Document, Image, Text, or Video
     * @throws If object is a Text and is over 60 characters
     * @throws If object is a Media and has a caption
     */
    constructor(object: Document | Image | Text | Video) {
        this.type = object._type;

        // All interactive's header can go to hell with its "exceptions"
        if (object._type === "text") {
            if (object.body.length > 60)
                throw new Error("Header text must be 60 characters or less");

            this[object._type] = object.body;
        } else {
            if ("caption" in object)
                throw new Error(`Header ${this.type} must not have a caption`);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - TS dumb, the _type will always match the message type
            this[this.type as "video" | "image" | "document"] = object;
        }
    }
}

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionButtons implements ClientTypedMessageComponent {
    /**
     * The buttons of the action
     */
    readonly buttons: Button[];

    get _type(): "button" {
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
    constructor(...button: AtLeastOne<Button>) {
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
    readonly type: "reply";
    /**
     * The reply object of the row
     */
    readonly reply: {
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
     * @throws If id is over 256 characters
     * @throws If id is malformed
     * @throws If title is over 20 characters
     */
    constructor(id: string, title: string) {
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
export class ActionList implements ClientTypedMessageComponent {
    /**
     * The button text
     */
    readonly button: string;
    /**
     * The sections of the action
     */
    readonly sections: ListSection[];

    get _type(): "list" {
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
    constructor(button: string, ...sections: AtLeastOne<ListSection>) {
        if (button.length > 20)
            throw new Error("Button content must be 20 characters or less");
        if (sections.length > 10)
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
 *
 * @group Interactive
 */
export class ListSection {
    /**
     * The rows of the section
     */
    readonly rows: Row[];
    /**
     * The title of the section
     */
    readonly title?: string;

    /**
     * Builds a section component for ActionList
     *
     * @param title - Title of the section, only required if there are more than one section
     * @param rows - Rows of the section
     * @throws If title is over 24 characters if provided
     * @throws If more than 10 rows are provided
     */
    constructor(title: string, ...rows: AtLeastOne<Row>) {
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
 * @group Interactive
 */
export class Row {
    /**
     * The id of the row
     */
    readonly id: string;
    /**
     * The title of the row
     */
    readonly title: string;
    /**
     * The description of the row
     */
    readonly description?: string;

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
    constructor(id: string, title: string, description?: string) {
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
}

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionCatalog implements ClientTypedMessageComponent {
    /**
     * The id of the catalog from where to get the products
     */
    readonly catalog_id: string;
    /**
     * The product to be added to the catalog
     */
    readonly product_retailer_id?: string;
    /**
     * The section to be added to the catalog
     */
    readonly sections?: ProductSection[];

    get _type(): "product" | "product_list" {
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
    constructor(
        catalog_id: string,
        ...products: [Product] | AtLeastOne<ProductSection>
    ) {
        const is_sections = this.isSections(products);

        if (is_sections) {
            if (products.length > 1) {
                if (products.length > 10)
                    throw new Error(
                        "Catalog must have between 1 and 10 product sections"
                    );
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

        if (is_sections) this.sections = products;
        else this.product_retailer_id = products[0].product_retailer_id;
    }

    // Java knowledge intensifies
    private isSections(obj: unknown[]): obj is ProductSection[] {
        return obj[0] instanceof ProductSection;
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
    readonly title?: string;
    /**
     * The products of the section
     */
    readonly product_items: Product[];

    /**
     * Builds a product section component for an ActionCatalog
     *
     * @param title - The title of the product section, only required if more than 1 section will be used
     * @param products - The products to add to the product section
     * @throws If title is over 24 characters if provided
     * @throws If more than 30 products are provided
     */
    constructor(title: string, ...products: AtLeastOne<Product>) {
        if (title && title.length > 24)
            throw new Error("Section title must be 24 characters or less");
        if (products.length > 30)
            throw new Error("Section must have between 1 and 30 products");

        if (title) this.title = title;
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
    readonly product_retailer_id: string;

    /**
     * Builds a product component for ActionCart and ProductSection
     *
     * @param product_retailer_id - The id of the product
     */
    constructor(product_retailer_id: string) {
        this.product_retailer_id = product_retailer_id;
    }
}
