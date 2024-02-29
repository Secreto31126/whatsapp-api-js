import {
    ClientMessage,
    ClientLimitedMessageComponent,
    Section,
    type InteractiveAction
} from "../types.js";
import type { AtLeastOne } from "../utils";

import type { Document, Image, Video } from "./media";

import { Product, ProductSection } from "./globals.js";

/**
 * Interactive API object
 *
 * @group Interactive
 */
export class Interactive extends ClientMessage {
    /**
     * The action for the interactive message
     */
    readonly action: InteractiveAction;
    /**
     * The body for the interactive message
     */
    readonly body?: Body;
    /**
     * The header for the interactive message
     */
    readonly header?: Header;
    /**
     * The footer for the interactive message
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
     * Creates an Interactive Reply Buttons object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header for the interactive message, it may be undefined if not needed
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     */
    constructor(
        action: ActionButtons,
        body: Body,
        header?: Header,
        footer?: Footer
    );
    /**
     * Creates an Interactive List object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header of type text for the interactive message, it may be undefined if not needed
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     * @throws If a header is provided and it's not of type "text"
     */
    constructor(
        action: ActionList,
        body: Body,
        header?: Header,
        footer?: Footer
    );
    /**
     * Creates an Interactive Catalog object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - Undefined
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     */
    constructor(
        action: ActionCatalog,
        body: Body,
        header?: undefined,
        footer?: Footer
    );
    /**
     * Creates an Interactive Single Product object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - Undefined
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     */
    constructor(
        action: ActionProduct,
        body?: Body,
        header?: undefined,
        footer?: Footer
    );
    /**
     * Creates an Interactive Multi Product object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header of type text for the interactive message
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     * @throws If header is not of type "text"
     */
    constructor(
        action: ActionProductList,
        body: Body,
        header: Header,
        footer?: Footer
    );
    /**
     * Creates an Interactive CTA object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header of type text for the interactive message, it may be undefined if not needed
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     * @throws If a header is provided and it's not of type "text"
     */
    constructor(
        action: ActionCTA,
        body: Body,
        header?: Header,
        footer?: Footer
    );
    /**
     * Creates an Interactive Flow object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header of type text for the interactive message, it may be undefined if not needed
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     * @throws If a header is provided and it's not of type "text"
     */
    constructor(
        action: ActionFlow,
        body: Body,
        header?: Header,
        footer?: Footer
    );
    /**
     * Creates an Interactive Flow object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body of the interactive message
     */
    constructor(action: ActionLocation, body: Body);

    /**
     * Create an Interactive object for the API
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message, it may be undefined if not needed.
     * @param header - The header for the interactive message, it may be undefined if not needed.
     * @param footer - The footer for the interactive message, it may be undefined if not needed.
     * @throws If a header is provided for an {@link ActionList}, {@link ActionProductList}, {@link ActionCTA} or {@link ActionFlow} and it's not of type "text"
     */
    constructor(
        action: InteractiveAction,
        body?: Body,
        header?: Header,
        footer?: Footer
    ) {
        super();

        const require_text_header: InteractiveAction["_type"][] = [
            "list",
            "product_list",
            "cta_url",
            "flow"
        ];

        if (
            header &&
            require_text_header.includes(action._type) &&
            header.type !== "text"
        ) {
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
     * The product to show in the message
     */
    readonly product_retailer_id: string;

    /**
     * @override
     * @internal
     */
    get _type(): "product" {
        return "product";
    }

    /**
     * Builds a Single Product component for an Interactive message
     *
     * @param catalog_id - The catalog id
     * @param product - The product to show in the message
     */
    constructor(catalog_id: string, product: Product) {
        this.catalog_id = catalog_id;
        this.product_retailer_id = product.product_retailer_id;
    }
}

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionProductList implements InteractiveAction {
    /**
     * The id of the catalog from where to get the products
     */
    readonly catalog_id: string;
    /**
     * The sections to show in the message
     */
    readonly sections: ProductSection[];

    /**
     * @override
     * @internal
     */
    get _type(): "product_list" {
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
    constructor(catalog_id: string, ...sections: AtLeastOne<ProductSection>) {
        if (sections.length > 1) {
            if (sections.length > 10) {
                throw new Error(
                    "Catalog must have between 1 and 10 product sections"
                );
            }

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
    readonly parameters: {
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
 * Action API object
 *
 * @group Interactive
 */
export abstract class ActionFlow implements InteractiveAction {
    /**
     * The name of the component
     */
    readonly name = "flow";
    /**
     * The Flow parameters
     *
     * @remarks TSDoc is unable to document this type properly, so most of
     * the documentation is in the subclasses constructors instead.
     */
    readonly parameters: {
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
    } & (
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
          }
    );

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
     * @param parameters - The Flow parameters
     * @throws If parameters.flow_cta is empty or over 20 characters
     * @throws If parameters.flow_cta contains emojis
     */
    constructor(parameters: ActionFlow["parameters"]) {
        if (!parameters.flow_cta.length || parameters.flow_cta.length > 20) {
            throw new Error("Flow CTA must be between 1 and 20 characters");
        }

        if (/\p{Extended_Pictographic}/u.test(parameters.flow_cta)) {
            throw new Error("Flow CTA must not contain emoji");
        }

        this.parameters = parameters;
    }
}

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionNavigateFlow extends ActionFlow {
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
    constructor(
        flow_token: string,
        flow_id: string,
        flow_cta: string,
        screen: string,
        data?: unknown,
        mode: "published" | "draft" = "published",
        flow_message_version: "3" = "3"
    ) {
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

        if (data && !Object.keys(data)) {
            throw new Error("Flow data must be a non-empty object if provided");
        }
    }
}

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionDataExchangeFlow extends ActionFlow {
    /**
     * Builds a data exchange flow component for an Interactive message
     *
     * @param flow_token - Flow token that is generated by the business to serve as an identifier
     * @param flow_id - ID of the Flow provided by WhatsApp
     * @param flow_cta - Text on the CTA button, character limit - 20 characters (no emoji)
     * @param mode - Must be "published" or "draft"
     * @param flow_message_version - Must be "3"
     */
    constructor(
        flow_token: string,
        flow_id: string,
        flow_cta: string,
        mode: "published" | "draft" = "published",
        flow_message_version: "3" = "3"
    ) {
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

/**
 * Action API object
 *
 * @group Interactive
 */
export class ActionLocation implements InteractiveAction {
    /**
     * The name of the component
     */
    readonly name = "send_location";

    /**
     * @override
     * @internal
     */
    get _type(): "location_request_message" {
        return "location_request_message";
    }
}
