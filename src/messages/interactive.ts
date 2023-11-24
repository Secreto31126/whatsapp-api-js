import {
    ClientMessage,
    ClientLimitedMessageComponent,
    Section,
    type InteractiveAction
} from "../types.js";
import type { AtLeastOne } from "../utils";

import type { Document, Image, Video } from "./media";

import { Product, ProductSection, isProductSections } from "./globals.js";

/**
 * Interactive API object
 *
 * @group Interactive
 */
export class Interactive extends ClientMessage {
    /**
     * The action component of the interactive message
     */
    readonly action: InteractiveAction;
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
     * The type of the interactive message
     */
    readonly type: InteractiveAction["_type"];

    /**
     * @override
     * @internal
     */
    get _type(): "interactive" {
        return "interactive";
    }

    /**
     * Create an Interactive object for the API
     *
     * @param action - The action component of the interactive message
     * @param body - The body component of the interactive message, it may be undefined if not needed.
     * @param header - The header component of the interactive message, it may be undefined if not needed.
     * @param footer - The footer component of the interactive message, it may be undefined if not needed.
     * @throws If body is not provided, unless action is an {@link ActionProduct} with a single product
     * @throws If header is provided for an {@link ActionProduct} with a single product
     * @throws If header of type text is not provided for an {@link ActionProduct} with a product list
     * @throws If header is not of type text, unless action is an {@link ActionButtons}
     */
    constructor(
        action: InteractiveAction,
        body?: Body,
        header?: Header,
        footer?: Footer
    ) {
        super();

        if (action._type !== "product" && !body)
            throw new Error("Interactive must have a body component");
        if (action._type === "product" && header)
            throw new Error(
                "Interactive must not have a header component if action is a single product"
            );
        if (action._type === "product_list" && header?.type !== "text")
            throw new Error(
                "Interactive must have a text header component if action is a product list"
            );
        if (header && action._type !== "button" && header?.type !== "text")
            throw new Error("Interactive header must be of type text");

        this.type = action._type;

        this.action = action;
        if (body) this.body = body;
        if (header) this.header = header;
        if (footer) this.footer = footer;
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
    constructor(object: Document | Image | Video | string) {
        // All interactive's header can go to hell with its "exceptions"
        if (typeof object === "string") {
            if (object.length > 60)
                throw new Error("Header text must be 60 characters or less");

            this.type = "text";
        } else {
            this.type = object._type;
            if (object.caption)
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
export class ActionButtons
    extends ClientLimitedMessageComponent<Button, 3>
    implements InteractiveAction
{
    /**
     * The buttons of the action
     */
    readonly buttons: Button[];

    /**
     * @override
     * @internal
     */
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
        super("Reply buttons", "button", button, 3);

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
     * @throws If title is an empty string
     * @throws If title is over 20 characters
     */
    constructor(id: string, title: string) {
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

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionList
    extends ClientLimitedMessageComponent<ListSection, 10>
    implements InteractiveAction
{
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
     * @internal
     */
    get _type(): "list" {
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
    constructor(button: string, ...sections: AtLeastOne<ListSection>) {
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

/**
 * Section API object
 *
 * @group Interactive
 */
export class ListSection extends Section<Row, 10> {
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
    constructor(title: string | undefined, ...rows: AtLeastOne<Row>) {
        super("ListSection", "rows", rows, 10, title);
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
     * Builds a row component for a ListSection
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
export class ActionCatalog implements InteractiveAction {
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
     * @internal
     */
    get _type(): "catalog_message" {
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
    constructor(thumbnail?: Product) {
        this.name = "catalog_message";
        if (thumbnail) {
            this.parameters = {
                thumbnail_product_retailer_id: thumbnail.product_retailer_id
            };
        }
    }
}

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionProduct implements InteractiveAction {
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
     * @internal
     */
    get _type(): "product" | "product_list" {
        return this.product_retailer_id ? "product" : "product_list";
    }

    /**
     * Builds a Multi or Single Product component for an Interactive message
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
        const is_sections = isProductSections(products);

        if (is_sections) {
            if (products.length > 1) {
                if (products.length > 10)
                    throw new Error(
                        "Catalog must have between 1 and 10 product sections"
                    );
                for (const obj of products) {
                    if (!obj.title) {
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
}

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionCTA implements InteractiveAction {
    /**
     * The name of the component
     */
    readonly name = "cta_url";
    /**
     * The CTA parameters
     */
    readonly parameters?: {
        display_text: string;
        url: string;
    };

    /**
     * @override
     * @internal
     */
    get _type(): "cta_url" {
        return "cta_url";
    }

    /**
     * Builds a call-to-action component for an Interactive message
     *
     * @param display_text - The text to be displayed in the CTA button
     * @param url - The url to be opened when the CTA button is clicked
     */
    constructor(display_text: string, url: string) {
        this.parameters = {
            display_text,
            url
        };
    }
}

/**
 * {@link ActionFlow."constructor"} parameters
 *
 * @group Interactive
 */
export type ActionFlowParametersType = {
    /**
     * The Flow can be in either draft or published mode
     */
    mode: "published" | "draft";
    /**
     * The Flow version, must be 3
     */
    flow_message_version: "3";
    /**
     * Flow token that is generated by the business to serve as an identifier
     */
    flow_token: string;
    /**
     * Unique ID of the Flow provided by WhatsApp
     */
    flow_id: string;
    /**
     * Text on the CTA button, character limit - 20 characters (no emoji)
     */
    flow_cta: string;
    /**
     * The Flow type, if set to "navigate", flow_action_payload must be provided
     */
    flow_action: "navigate" | "data_exchange";
    /**
     * Required if flow_action is "navigate", should be omitted otherwise
     */
    flow_action_payload?: {
        /**
         * The ID of the first Screen
         */
        screen: string;
        /**
         * Optional input data for the first Screen of the Flow. If provided, this must be a non-empty object.
         */
        data?: unknown;
    };
};

/**
 * This type allows catching type errors at compile time,
 * check out {@link ActionFlowParametersType.flow_action_payload} for more information
 *
 * @group Interactive
 */
export type ActionFlowParametersTypeSorcery =
    | {
          flow_action: "navigate";
          flow_action_payload: {
              screen: string;
              data?: unknown;
          };
      }
    | {
          flow_action: "data_exchange";
          flow_action_payload?: never;
      };

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionFlow implements InteractiveAction {
    /**
     * The name of the component
     */
    readonly name = "flow";
    /**
     * The Flow parameters
     *
     * @remarks TSDoc is unable to document this type properly, see {@link ActionFlowParametersType}
     */
    readonly parameters: ActionFlowParametersType &
        ActionFlowParametersTypeSorcery;

    /**
     * @override
     * @internal
     */
    get _type(): "flow" {
        return "flow";
    }

    /**
     * Builds a flow component for an Interactive message
     *
     * @param parameters - The Interactive Flow's parameters, "mode" and "flow_message_version" are set by default to "published" and "3" respectively
     * @throws If flow_cta is empty or over 20 characters
     * @throws If flow_cta contains emojis
     */
    constructor({
        flow_token,
        flow_id,
        flow_cta,
        flow_action,
        flow_action_payload: { screen, data } = { screen: "", data: {} },
        mode = "published",
        flow_message_version = "3"
    }: ActionFlowParametersType &
        Partial<
            Pick<ActionFlowParametersType, "mode" | "flow_message_version">
        >) {
        if (!flow_cta.length || flow_cta.length > 20) {
            throw new Error("Flow CTA must be between 1 and 20 characters");
        }

        if (/\p{Extended_Pictographic}/u.test(flow_cta)) {
            throw new Error("Flow CTA must not contain emoji");
        }

        if (flow_action === "data_exchange") {
            this.parameters = {
                mode,
                flow_message_version,
                flow_token,
                flow_id,
                flow_cta,
                flow_action
            };
        } else {
            this.parameters = {
                mode,
                flow_message_version,
                flow_token,
                flow_id,
                flow_cta,
                flow_action,
                flow_action_payload: {
                    screen,
                    data
                }
            };
        }
    }
}
