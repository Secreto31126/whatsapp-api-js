import { ClientMessage, ClientLimitedMessageComponent, type InteractiveAction } from "../types.js";
import type { AtLeastOne } from "../utils";
import type { Document, Image, Video } from "./media";
import { Product, ProductSection, Section } from "./globals.js";
/**
 * Interactive API object
 *
 * @group Interactive
 */
export declare class Interactive extends ClientMessage {
    /**
     * The action component of the interactive message
     */
    readonly action: InteractiveAction;
    /**
     * The type of the interactive message
     */
    readonly type: InteractiveAction["_type"];
    /**
     * The body component of the interactive message
     */
    readonly body?: Body;
    /**
     * The header component of the interactive message
     */
    readonly header?: Header;
    /**
     * The footer component of the interactive message
     */
    readonly footer?: Footer;
    /**
     * @override
     */
    get _type(): "interactive";
    /**
     * Create an Interactive object for the API
     *
     * @param action - The action component of the interactive message
     * @param body - The body component of the interactive message
     * @param header - The header component of the interactive message
     * @param footer - The footer component of the interactive message
     * @throws If body is not provided, unless action is an {@link ActionProduct} with a single product
     * @throws If header is provided for an {@link ActionProduct} with a single product
     * @throws If header of type text is not provided for an {@link ActionProduct} with a product list
     * @throws If header is not of type text, unless action is an {@link ActionButtons}
     */
    constructor(action: InteractiveAction, body?: Body, header?: Header, footer?: Footer);
}
/**
 * Body API object
 *
 * @group Interactive
 */
export declare class Body {
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
    constructor(text: string);
}
/**
 * Footer API object
 *
 * @group Interactive
 */
export declare class Footer {
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
    constructor(text: string);
}
/**
 * Header API object
 *
 * @group Interactive
 */
export declare class Header {
    /**
     * The type of the header
     */
    readonly type: "text" | "image" | "video" | "document";
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
     * @throws If object is a string and is over 60 characters
     * @throws If object is a Media and has a caption
     */
    constructor(object: Document | Image | Video | string);
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionButtons extends ClientLimitedMessageComponent<Button, 3> implements InteractiveAction {
    /**
     * The buttons of the action
     */
    readonly buttons: Button[];
    /**
     * @override
     */
    get _type(): "button";
    /**
     * Builds a reply buttons component for an Interactive message
     *
     * @param button - Buttons to be used in the reply buttons. Each button title must be unique within the message. Emojis are supported, markdown is not. Must be between 1 and 3 buttons.
     * @throws If more than 3 buttons are provided
     * @throws If two or more buttons have the same id
     * @throws If two or more buttons have the same title
     */
    constructor(...button: AtLeastOne<Button>);
}
/**
 * Button API object
 *
 * @group Interactive
 */
export declare class Button {
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
     * @throws If title is an empty string
     * @throws If title is over 20 characters
     */
    constructor(id: string, title: string);
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionList extends ClientLimitedMessageComponent<ListSection, 10> implements InteractiveAction {
    /**
     * The button text
     */
    readonly button: string;
    /**
     * The sections of the action
     */
    readonly sections: ListSection[];
    /**
     * @override
     */
    get _type(): "list";
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
    constructor(button: string, ...sections: AtLeastOne<ListSection>);
}
/**
 * Section API object
 *
 * @group Interactive
 */
export declare class ListSection extends Section<Row, 10> {
    /**
     * The rows of the section
     */
    readonly rows: Row[];
    /**
     * Builds a list section component for ActionList
     *
     * @param title - Title of the section, only required if there are more than one section
     * @param rows - Rows of the list section
     * @throws If title is over 24 characters if provided
     * @throws If more than 10 rows are provided
     */
    constructor(title: string | undefined, ...rows: AtLeastOne<Row>);
}
/**
 * Row API object
 *
 * @group Interactive
 */
export declare class Row {
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
     * Builds a row component for a ListSection
     *
     * @param id - The id of the row. Maximum length: 200 characters.
     * @param title - The title of the row. Maximum length: 24 characters.
     * @param description - The description of the row. Maximum length: 72 characters.
     * @throws If id is over 200 characters
     * @throws If title is over 24 characters
     * @throws If description is over 72 characters
     */
    constructor(id: string, title: string, description?: string);
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionCatalog implements InteractiveAction {
    /**
     * The name of the component
     */
    readonly name: "catalog_message";
    /**
     * The thumbnail product to be shown in the catalog
     */
    readonly parameters?: {
        thumbnail_product_retailer_id?: string;
    };
    /**
     * @override
     */
    get _type(): "catalog_message";
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
    constructor(thumbnail?: Product);
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionProduct implements InteractiveAction {
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
    /**
     * @override
     */
    get _type(): "product" | "product_list";
    /**
     * Builds a Multi or Single Product component for an Interactive message
     *
     * @param catalog_id - The catalog id
     * @param products - The products to add to the catalog. It can be a _single_ Product object, or a list of ProductSections.
     * @throws If products is a product list and more than 10 sections are provided
     * @throws If products is a product list with more than 1 section and at least one section is missing a title
     */
    constructor(catalog_id: string, ...products: [Product] | AtLeastOne<ProductSection>);
}
//# sourceMappingURL=interactive.d.ts.map