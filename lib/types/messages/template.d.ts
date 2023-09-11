import { ClientMessage, type ClientBuildableMessageComponent, type ClientTypedMessageComponent } from "../types.js";
import type { AtLeastOne } from "../utils";
import type Location from "./location";
import type { Document, Image, Video } from "./media";
import { Product, ProductSection } from "./globals.js";
/**
 * @group Template
 */
export type ButtonParameter = {
    /**
     * The type of the button
     */
    readonly type: "text" | "payload" | "action" | "coupon_code";
    /**
     * The text of the button
     */
    readonly text?: string;
    /**
     * The payload of the button
     */
    readonly payload?: string;
    /**
     * The coupon's code of the button
     */
    readonly coupon_code?: string;
    /**
     * The action of the button
     */
    readonly action?: {
        thumbnail_product_retailer_id: string;
        sections?: AtLeastOne<ProductSection>;
    };
};
/**
 * This type is used as a C struct pointer for the _build method
 *
 * @internal
 */
type BuildingPointers = {
    theres_only_body: boolean;
    button_counter: number;
};
/**
 * Template API object
 *
 * @group Template
 */
export declare class Template extends ClientMessage {
    /**
     * The name of the template
     */
    readonly name: string;
    /**
     * The language of the template
     */
    readonly language: Language;
    /**
     * The components of the template
     */
    readonly components?: Array<NonNullable<HeaderComponent | BodyComponent | ButtonComponent>>;
    /**
     * @override
     * @internal
     */
    get _type(): "template";
    /**
     * Create a Template object for the API
     *
     * @param name - Name of the template
     * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param components - Components objects containing the parameters of the message. For text-based templates, the only supported component is BodyComponent.
     */
    constructor(name: string, language: string | Language, ...components: (HeaderComponent | BodyComponent | ButtonComponent)[]);
    /**
     * OTP Template generator
     *
     * @param name - Name of the template
     * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param code - The one time password to be sent
     * @returns A Template object for the API
     */
    static OTP(name: string, language: string | Language, code: string): Template;
}
/**
 * Language API object
 *
 * @group Template
 */
export declare class Language {
    /**
     * The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     */
    readonly code: string;
    /**
     * The language policy
     */
    readonly policy: "deterministic";
    /**
     * Create a Language component for a Template message
     *
     * @param code - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param policy - The language policy the message should follow. The only supported option is 'deterministic'.
     */
    constructor(code: string, policy?: "deterministic");
}
/**
 * Currency API object
 *
 * @group Template
 */
export declare class Currency implements ClientTypedMessageComponent {
    /**
     * The amount of the currency by 1000
     */
    readonly amount_1000: number;
    /**
     * The currency code
     */
    readonly code: string;
    /**
     * The fallback value
     */
    readonly fallback_value: string;
    /**
     * @override
     * @internal
     */
    get _type(): "currency";
    /**
     * Builds a currency object for a Parameter
     *
     * @param amount_1000 - Amount multiplied by 1000
     * @param code - Currency code as defined in ISO 4217
     * @param fallback_value - Default text if localization fails
     * @throws If amount_1000 is not greater than 0
     */
    constructor(amount_1000: number, code: string, fallback_value: string);
}
/**
 * DateTime API object
 *
 * @group Template
 */
export declare class DateTime implements ClientTypedMessageComponent {
    /**
     * The fallback value
     */
    readonly fallback_value: string;
    /**
     * @override
     * @internal
     */
    get _type(): "date_time";
    /**
     * Builds a date_time object for a Parameter
     *
     * @param fallback_value - Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
     */
    constructor(fallback_value: string);
}
/**
 * Components API object
 *
 * @see {@link URLComponent}
 * @see {@link PayloadComponent}
 * @see {@link CatalogComponent}
 * @see {@link MPMComponent}
 * @see {@link CopyComponent}
 * @see {@link SkipButtonComponent}
 *
 * @group Template
 */
export declare abstract class ButtonComponent implements ClientBuildableMessageComponent {
    /**
     * The type of the component
     */
    readonly type = "button";
    /**
     * The subtype of the component
     */
    readonly sub_type: "url" | "quick_reply" | "catalog" | "mpm" | "copy_code";
    /**
     * The parameter of the component
     */
    readonly parameters: [ButtonParameter];
    /**
     * The index of the component (assigned after calling _build)
     */
    protected index: number;
    /**
     * Builds a button component for a Template message.
     * The index of each component is defined by the order they are sent to the Template's constructor.
     *
     * @internal
     * @param sub_type - The type of button component to create.
     * @param parameter - The parameter for the component. The index of each component is defined by the order they are sent to the Template's constructor.
     */
    constructor(sub_type: "url" | "quick_reply" | "catalog" | "mpm" | "copy_code", parameter: ButtonParameter);
    /**
     * @override
     * @internal
     */
    _build(pointers: BuildingPointers): this;
}
/**
 * Button Component API object for call to action buttons
 *
 * @group Template
 */
export declare class URLComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template message with call to action buttons.
     *
     * @param parameters - The variable for each url button.
     * @throws If parameter is an empty string.
     */
    constructor(parameter: string);
    /**
     * @internal
     */
    private static Button;
}
/**
 * Button Component API object for quick reply buttons
 *
 * @group Template
 */
export declare class PayloadComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template message with quick reply buttons.
     *
     * @param parameters - Parameter for the component.
     * @throws If parameter is an empty string.
     */
    constructor(parameter: string);
    /**
     * @internal
     */
    private static Button;
}
/**
 * Button Component API object for catalog button
 *
 * @group Template
 */
export declare class CatalogComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template catalog button.
     *
     * @param thumbnail - The product to use as thumbnail.
     */
    constructor(thumbnail: Product);
    /**
     * @internal
     */
    private static Action;
}
/**
 * Button Component API object for Multi-Product Message
 *
 * @group Template
 */
export declare class MPMComponent extends ButtonComponent {
    /**
     * Creates a button component for a MPM Template.
     *
     * @param thumbnail - The product to use as thumbnail.
     * @param sections - The sections of the MPM. Must have between 1 and 10 sections. Must have less than 30 products *across* all sections.
     * @throws If sections is over 10 elements.
     * @throws If sections is over 1 element and one of the sections doesn't have a title.
     */
    constructor(thumbnail: Product, ...sections: AtLeastOne<ProductSection>);
    /**
     * @internal
     */
    private static Action;
}
/**
 * Button Component API object for copy coupon button
 *
 * @group Template
 */
export declare class CopyComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template message with copy coupon button.
     *
     * @param parameters - The variable for each url button.
     * @throws If parameter is an empty string.
     */
    constructor(parameter: string);
    /**
     * @internal
     */
    private static Action;
}
/**
 * (Fake) Button Component API object for skipping buttons that don't require a parameter (such as phone number buttons)
 *
 * @group Template
 */
export declare class SkipButtonComponent extends ButtonComponent {
    /**
     * Skips a button component index for a Template message.
     */
    constructor();
    /**
     * @override
     * @internal
     */
    _build(pointers: BuildingPointers): this;
}
/**
 * Components API object
 *
 * @group Template
 */
export declare class HeaderComponent implements ClientBuildableMessageComponent {
    /**
     * The type of the component
     */
    readonly type: "header";
    /**
     * The parameters of the component
     */
    readonly parameters: HeaderParameter[];
    /**
     * Builds a header component for a Template message
     *
     * @param parameters - Parameters of the body component
     */
    constructor(...parameters: AtLeastOne<HeaderParameter>);
    /**
     * @override
     * @internal
     */
    _build(): this;
}
/**
 * Parameter API object
 *
 * @group Template
 */
export declare class HeaderParameter {
    /**
     * The type of the parameter
     */
    readonly type: "text" | "currency" | "date_time" | "image" | "document" | "video" | "location";
    /**
     * The text of the parameter
     */
    readonly text?: string;
    /**
     * The currency of the parameter
     */
    readonly currency?: Currency;
    /**
     * The datetime of the parameter
     */
    readonly date_time?: DateTime;
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
     * The location of the parameter
     */
    readonly location?: Location;
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
    constructor(parameter: string | Currency | DateTime | Image | Document | Video | Location);
}
/**
 * Components API object
 *
 * @group Template
 */
export declare class BodyComponent implements ClientBuildableMessageComponent {
    /**
     * The type of the component
     */
    readonly type: "body";
    /**
     * The parameters of the component
     */
    readonly parameters: BodyParameter[];
    /**
     * Builds a body component for a Template message
     *
     * @param parameters - Parameters of the body component
     */
    constructor(...parameters: AtLeastOne<BodyParameter>);
    /**
     * @override
     * @internal
     */
    _build({ theres_only_body }: BuildingPointers): this;
}
/**
 * Parameter API object
 *
 * @group Template
 */
export declare class BodyParameter {
    /**
     * The type of the parameter
     */
    readonly type: "text" | "currency" | "date_time";
    /**
     * The text of the parameter
     */
    readonly text?: string;
    /**
     * The currency of the parameter
     */
    readonly currency?: Currency;
    /**
     * The datetime of the parameter
     */
    readonly date_time?: DateTime;
    /**
     * Builds a parameter object for a BodyComponent.
     * For text parameter, the character limit is 32768 if only one BodyComponent is used for the Template, else it's 1024.
     *
     * @param parameter - The parameter to be used in the template
     * @throws If parameter is a string and it's over 32768 characters
     * @throws If parameter is a string, there are other components in the Template and it's over 1024 characters
     * @see {@link BodyComponent._build} The method that checks the 1024 character limit
     */
    constructor(parameter: string | Currency | DateTime);
}
export {};
//# sourceMappingURL=template.d.ts.map