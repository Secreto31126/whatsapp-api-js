import type { ClientMessage, ClientBuildableMessageComponent, ClientTypedMessageComponent } from "../types";
import { AtLeastOne } from "../utils";
import type Location from "./location";
import type { Document, Image, Video } from "./media";
export type BuiltButtonComponent = {
    type: "button";
    sub_type: "url" | "quick_reply";
    index: string;
    parameters: Array<ButtonParameter>;
};
/**
 * Template API object
 *
 * @group Template
 */
export declare class Template implements ClientMessage {
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
    readonly components?: (HeaderComponent | BodyComponent | BuiltButtonComponent)[];
    get _type(): "template";
    /** @todo Find out if more than one of each component is allowed */
    /**
     * Create a Template object for the API
     *
     * @param name - Name of the template
     * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param components - Components objects containing the parameters of the message. For text-based templates, the only supported component is BodyComponent.
     */
    constructor(name: string, language: string | Language, ...components: (HeaderComponent | BodyComponent | ButtonComponent)[]);
    _build(): string;
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
 * @group Template
 */
export declare class ButtonComponent implements ClientBuildableMessageComponent {
    /**
     * The type of the component
     */
    readonly type: "button";
    /**
     * The subtype of the component
     */
    readonly sub_type: "url" | "quick_reply";
    /**
     * The ButtonParameters to be used in the build function
     */
    readonly parameters: ButtonParameter[];
    /**
     * Builds a button component for a Template message.
     * The index of the buttons is defined by the order in which you add them to the Template parameters.
     *
     * @param sub_type - The type of button to create.
     * @param parameters - Parameter for each button. The index of each parameter is defined by the order they are sent to the constructor.
     * @throws If sub_type is not either 'url' or 'quick_reply'
     * @throws If parameters is over 3 elements
     */
    constructor(sub_type: "url" | "quick_reply", ...parameters: AtLeastOne<string>);
    _build(): Array<BuiltButtonComponent>;
}
/**
 * Button Parameter API object
 *
 * @group Template
 */
export declare class ButtonParameter {
    /**
     * The type of the button
     */
    readonly type: "text" | "payload";
    /**
     * The text of the button
     */
    readonly text?: string;
    /**
     * The payload of the button
     */
    readonly payload?: string;
    /**
     * Builds a button parameter for a ButtonComponent
     *
     * @param param - Developer-provided data that is used to fill in the template.
     * @param type - The type of the button
     */
    constructor(param: string, type: "text" | "payload");
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
    _build(theres_only_body: boolean): this;
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
     * @see BodyComponent._build The method that checks the 1024 character limit
     */
    constructor(parameter: string | Currency | DateTime);
}
//# sourceMappingURL=template.d.ts.map