import { ClientMessage, ClientLimitedMessageComponent, Section, type InteractiveAction } from "../types.js";
import type { AtLeastOne } from "../utils";
import type { Document, Image, Video } from "./media";
import { Product, ProductSection } from "./globals.js";
/**
 * Interactive API object
 *
 * @group Interactive
 */
export declare class Interactive extends ClientMessage {
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
    get _type(): "interactive";
    /**
     * Creates an Interactive Reply Buttons object for the API
     *
     * @example
     * ```ts
     * import {
     *     Interactive,
     *     ActionButtons,
     *     Button,
     *     Body
     * } from "whatsapp-api-js/messages";
     *
     * const interactive_button_message = new Interactive(
     *     new ActionButtons(
     *         new Button("reply_1", "Hello"),
     *         new Button("reply_2", "World")
     *     ),
     *     new Body("Hello World")
     * );
     * ```
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header for the interactive message, it may be undefined if not needed
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     */
    constructor(action: ActionButtons, body: Body, header?: Header, footer?: Footer);
    /**
     * Creates an Interactive List object for the API
     *
     * @example
     * ```ts
     * import { Interactive, ActionList, Row, Body } from "whatsapp-api-js/messages";
     *
     * const interactive_list_message = new Interactive(
     *     new ActionList(
     *         "Button text",
     *         new ListSection(
     *             "Section title",
     *             new Row("reply_1", "Hello", "Hello description"),
     *             new Row("reply_2", "World", "World description")
     *         )
     *     ),
     *     new Body("Hello World")
     * );
     * ```
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header of type text for the interactive message, it may be undefined if not needed
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     * @throws If a header is provided and it's not of type "text"
     */
    constructor(action: ActionList, body: Body, header?: Header, footer?: Footer);
    /**
     * Creates an Interactive Catalog object for the API
     *
     * @example
     * ```ts
     * import {
     *     Interactive,
     *     ActionCatalog,
     *     Product,
     *     Body
     * } from "whatsapp-api-js/messages";
     *
     * const interactive_catalog_message = new Interactive(
     *     new ActionCatalog(new Product("hello")),
     *     new Body("Hello World")
     * );
     * ```
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - Undefined
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     */
    constructor(action: ActionCatalog, body: Body, header?: undefined, footer?: Footer);
    /**
     * Creates an Interactive Single Product object for the API
     *
     * @example
     * ```ts
     * import { Interactive, ActionProduct, Product } from "whatsapp-api-js/messages";
     *
     * const interactive_single_product_message = new Interactive(
     *     new ActionProduct("catalog_id", new Product("product_id"))
     * );
     * ```
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - Undefined
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     */
    constructor(action: ActionProduct, body?: Body, header?: undefined, footer?: Footer);
    /**
     * Creates an Interactive Multi Product object for the API
     *
     * @example
     * ```ts
     * import {
     *     Interactive,
     *     ActionProductList,
     *     ProductSection,
     *     Product
     * } from "whatsapp-api-js/messages";
     *
     * const interactive_multi_product_message = new Interactive(
     *     new ActionProductList(
     *         "catalog_id",
     *         new ProductSection(
     *             "Product section title",
     *             new Product("product_id"),
     *             new Product("product_id")
     *         )
     *     ),
     *     new Body("Hello World"),
     *     new Header("Hello World Header")
     * );
     * ```
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header of type text for the interactive message
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     * @throws If header is not of type "text"
     */
    constructor(action: ActionProductList, body: Body, header: Header, footer?: Footer);
    /**
     * Creates an Interactive CTA object for the API
     *
     * @example
     * ```ts
     * import { Interactive, ActionCTA, Body } from "whatsapp-api-js/messages";
     *
     * const interactive_catalog_message = new Interactive(
     *     new ActionCTA("Open Google", "https://google.com"),
     *     new Body("You should google it")
     * );
     * ```
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header of type text for the interactive message, it may be undefined if not needed
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     * @throws If a header is provided and it's not of type "text"
     */
    constructor(action: ActionCTA, body: Body, header?: Header, footer?: Footer);
    /**
     * Creates an Interactive Flow object for the API
     *
     * @example
     * ```ts
     * import {
     *     Interactive,
     *     ActionNavigateFlow,
     *     Body
     * } from "whatsapp-api-js/messages";
     *
     * const interactive_navigate_flow_message = new Interactive(
     *     new ActionNavigateFlow(
     *         "5f9b3b4f-2b7a-4f4f-8f4f-4f4f4f4f4f4f",
     *         "5f9b3b4f-2b7a-4f4f-8f4f-4f4f4f4f4f4f",
     *         "Hello World",
     *         "form_screen",
     *         {
     *             name: "John Doe",
     *             age: 42
     *         }
     *     ),
     *     new Body("How was your experience today?")
     * );
     * ```
     *
     * @example
     * ```ts
     * import {
     *     Interactive,
     *     ActionDataExchangeFlow,
     *     Body
     * } from "whatsapp-api-js/messages";
     *
     * const interactive_data_exchange_flow_message = new Interactive(
     *     new ActionDataExchangeFlow(
     *         "5f9b3b4f-2b7a-4f4f-8f4f-4f4f4f4f4f4f",
     *         "5f9b3b4f-2b7a-4f4f-8f4f-4f4f4f4f4f4f",
     *         "Hello World"
     *     ),
     *     new Body("Hello World")
     * );
     * ```
     *
     * @param action - The action for the interactive message
     * @param body - The body for the interactive message
     * @param header - The header of type text for the interactive message, it may be undefined if not needed
     * @param footer - The footer for the interactive message, it may be undefined if not needed
     * @throws If a header is provided and it's not of type "text"
     */
    constructor(action: ActionFlow, body: Body, header?: Header, footer?: Footer);
    /**
     * Creates an Interactive Location request object for the API
     *
     * @example
     * ```ts
     * import { Interactive, ActionLocation, Body } from "whatsapp-api-js/messages";
     *
     * const interactive_catalog_message = new Interactive(
     *     new ActionLocation(),
     *     new Body("Show me where you live")
     * );
     * ```
     *
     * @param action - The action for the interactive message
     * @param body - The body of the interactive message
     */
    constructor(action: ActionLocation, body: Body);
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
     * @internal
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
     * @internal
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
     * @internal
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
     * The product to show in the message
     */
    readonly product_retailer_id: string;
    /**
     * @override
     * @internal
     */
    get _type(): "product";
    /**
     * Builds a Single Product component for an Interactive message
     *
     * @param catalog_id - The catalog id
     * @param product - The product to show in the message
     */
    constructor(catalog_id: string, product: Product);
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionProductList extends ClientLimitedMessageComponent<ProductSection, 10> implements InteractiveAction {
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
    get _type(): "product_list";
    /**
     * Builds a Multi Product component for an Interactive message
     *
     * @param catalog_id - The catalog id
     * @param sections - The product sections to show in the message
     * @throws If more than 10 product sections are provided
     * @throws If more than 1 product section is provided and at least one section is missing a title
     */
    constructor(catalog_id: string, ...sections: AtLeastOne<ProductSection>);
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionCTA implements InteractiveAction {
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
    get _type(): "cta_url";
    /**
     * Builds a call-to-action component for an Interactive message
     *
     * @param display_text - The text to be displayed in the CTA button
     * @param url - The url to be opened when the CTA button is clicked
     */
    constructor(display_text: string, url: string);
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare abstract class ActionFlow implements InteractiveAction {
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
    } & ({
        flow_action: "navigate";
        flow_action_payload: {
            screen: string;
            data?: unknown;
        };
    } | {
        flow_action: "data_exchange";
        flow_action_payload?: never;
    });
    /**
     * @override
     * @internal
     */
    get _type(): "flow";
    /**
     * Builds a flow component for an Interactive message
     *
     * @param parameters - The Flow parameters
     * @throws If parameters.flow_cta is empty or over 20 characters
     * @throws If parameters.flow_cta contains emojis
     */
    constructor(parameters: ActionFlow["parameters"]);
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionNavigateFlow extends ActionFlow {
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
    constructor(flow_token: string, flow_id: string, flow_cta: string, screen: string, data?: unknown, mode?: "published" | "draft", flow_message_version?: "3");
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionDataExchangeFlow extends ActionFlow {
    /**
     * Builds a data exchange flow component for an Interactive message
     *
     * @param flow_token - Flow token that is generated by the business to serve as an identifier
     * @param flow_id - ID of the Flow provided by WhatsApp
     * @param flow_cta - Text on the CTA button, character limit - 20 characters (no emoji)
     * @param mode - Must be "published" or "draft"
     * @param flow_message_version - Must be "3"
     */
    constructor(flow_token: string, flow_id: string, flow_cta: string, mode?: "published" | "draft", flow_message_version?: "3");
}
/**
 * Action API object
 *
 * @group Interactive
 */
export declare class ActionLocation implements InteractiveAction {
    /**
     * The name of the component
     */
    readonly name = "send_location";
    /**
     * @override
     * @internal
     */
    get _type(): "location_request_message";
}
//# sourceMappingURL=interactive.d.ts.map