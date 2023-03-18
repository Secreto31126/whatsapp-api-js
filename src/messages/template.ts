import type {
    ClientMessage,
    ClientMessageComponent,
    ClientBuildableMessageComponent,
    ClientTypedMessageComponent
} from "../types.js";
import { AtLeastOne } from "../utils.js";

import type Text from "./text.js";
import type { Document, Image, Video } from "./media.js";

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
export class Template implements ClientMessage {
    /**
     * The name of the template
     */
    name: string;
    /**
     * The language of the template
     */
    language: Language | ClientMessageComponent;
    /**
     * The components of the template
     */
    components?: (
        | HeaderComponent
        | BodyComponent
        | BuiltButtonComponent
        | ClientMessageComponent
    )[];

    get _type(): "template" {
        return "template";
    }

    /**
     * Create a Template object for the API
     *
     * @param name - Name of the template
     * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param components - Components objects containing the parameters of the message. For text-based templates, the only supported component is BodyComponent.
     */
    constructor(
        name: string,
        language: string | Language | ClientMessageComponent,
        ...components: (
            | HeaderComponent
            | BodyComponent
            | ButtonComponent
            | ClientBuildableMessageComponent
        )[]
    ) {
        this.name = name;
        this.language =
            typeof language === "string" ? new Language(language) : language;
        if (components)
            this.components = components
                .map((cmpt) => cmpt._build())
                .flat() as (
                | HeaderComponent
                | BodyComponent
                | BuiltButtonComponent
            )[];
    }

    _build() {
        return JSON.stringify(this);
    }
}

/**
 * Language API object
 *
 * @group Template
 */
export class Language {
    /**
     * The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     */
    code: string;
    /**
     * The language policy
     */
    policy: "deterministic";

    /**
     * Create a Language component for a Template message
     *
     * @param code - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param policy - The language policy the message should follow. The only supported option is 'deterministic'. The variable isn't even read by my code :)
     */
    constructor(code: string, policy: "deterministic" = "deterministic") {
        this.policy = policy;
        this.code = code;
    }
}

/**
 * Currency API object
 *
 * @group Template
 */
export class Currency implements ClientTypedMessageComponent {
    /**
     * The amount of the currency by 1000
     */
    amount_1000: number;
    /**
     * The currency code
     */
    code: string;
    /**
     * The fallback value
     */
    fallback_value: string;

    get _type(): "currency" {
        return "currency";
    }

    /**
     * Builds a currency object for a Parameter
     *
     * @param amount_1000 - Amount multiplied by 1000
     * @param code - Currency code as defined in ISO 4217
     * @param fallback_value - Default text if localization fails
     * @throws If amount_1000 is not greater than 0
     */
    constructor(amount_1000: number, code: string, fallback_value: string) {
        if (amount_1000 <= 0)
            throw new Error("Currency must have an amount_1000 greater than 0");

        this.amount_1000 = amount_1000;
        this.code = code;
        this.fallback_value = fallback_value;
    }
}

/**
 * DateTime API object
 *
 * @group Template
 */
export class DateTime implements ClientTypedMessageComponent {
    /**
     * The fallback value
     */
    fallback_value: string;

    get _type(): "date_time" {
        return "date_time";
    }

    /**
     * Builds a date_time object for a Parameter
     *
     * @param fallback_value - Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
     */
    constructor(fallback_value: string) {
        this.fallback_value = fallback_value;
    }
}

/**
 * Components API object
 *
 * @group Template
 */
export class ButtonComponent implements ClientBuildableMessageComponent {
    /**
     * The type of the component
     */
    type: "button";
    /**
     * The subtype of the component
     */
    sub_type: "url" | "quick_reply";
    /**
     * The ButtonParameters to be used in the build function
     */
    parameters: ButtonParameter[];

    /**
     * Builds a button component for a Template message.
     * The index of the buttons is defined by the order in which you add them to the Template parameters.
     *
     * @param sub_type - The type of button to create.
     * @param parameters - Parameter for each button. The index of each parameter is defined by the order they are sent to the constructor.
     * @throws If sub_type is not either 'url' or 'quick_reply'
     * @throws If parameters is over 3 elements
     */
    constructor(
        sub_type: "url" | "quick_reply",
        ...parameters: AtLeastOne<string>
    ) {
        if (parameters.length > 3)
            throw new Error(
                "ButtonComponent must have between 1 and 3 parameters"
            );

        const buttonType = sub_type === "url" ? "text" : "payload";
        const processed = parameters.map(
            (e) => new ButtonParameter(e, buttonType)
        );

        this.type = "button";
        this.sub_type = sub_type;
        this.parameters = processed;
    }

    _build(): Array<BuiltButtonComponent> {
        return this.parameters.map((p, i) => {
            return {
                type: this.type,
                sub_type: this.sub_type,
                index: i.toString(),
                parameters: [p]
            };
        });
    }
}

/**
 * Button Parameter API object
 *
 * @group Template
 */
export class ButtonParameter {
    /**
     * The type of the button
     */
    type: "text" | "payload";
    /**
     * The text of the button
     */
    text?: string;
    /**
     * The payload of the button
     */
    payload?: string;

    /**
     * Builds a button parameter for a ButtonComponent
     *
     * @param param - Developer-provided data that is used to fill in the template.
     * @param type - The type of the button
     */
    constructor(param: string, type: "text" | "payload") {
        this.type = type;
        this[type] = param;
    }
}

/**
 * Components API object
 *
 * @group Template
 */
export class HeaderComponent implements ClientBuildableMessageComponent {
    /**
     * The type of the component
     */
    type: "header";
    /**
     * The parameters of the component
     */
    parameters?: Parameter[];

    /**
     * Builds a header component for a Template message
     *
     * @param parameters - Parameters of the body component
     */
    constructor(
        ...parameters: (
            | Text
            | Currency
            | DateTime
            | Image
            | Document
            | Video
            | Parameter
        )[]
    ) {
        this.type = "header";
        if (parameters)
            this.parameters = parameters.map((e) =>
                e instanceof Parameter ? e : new Parameter(e, "header")
            );
    }

    _build() {
        return this;
    }
}

/**
 * Components API object
 *
 * @group Template
 */
export class BodyComponent {
    /**
     * The type of the component
     */
    type: "body";
    /**
     * The parameters of the component
     */
    parameters?: Parameter[];

    /**
     * Builds a body component for a Template message
     *
     * @param parameters - Parameters of the body component
     */
    constructor(
        ...parameters: (
            | Text
            | Currency
            | DateTime
            | Image
            | Document
            | Video
            | Parameter
        )[]
    ) {
        this.type = "body";
        if (parameters)
            this.parameters = parameters.map((e) =>
                e instanceof Parameter ? e : new Parameter(e, "body")
            );
    }

    _build() {
        return this;
    }
}

/**
 * Parameter API object
 *
 * @group Template
 */
export class Parameter {
    /**
     * The type of the parameter
     */
    type: "text" | "currency" | "date_time" | "image" | "document" | "video";
    /**
     * The text of the parameter
     */
    text?: string;
    /**
     * The currency of the parameter
     */
    currency?: Currency;
    /**
     * The datetime of the parameter
     */
    date_time?: DateTime;
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
     * Builds a parameter object for a HeaderComponent or BodyComponent.
     * For Text parameter, the header component character limit is 60, and the body component character limit is 1024.
     * For Document parameter, only PDF documents are supported for document-based message templates (not checked).
     *
     * @param parameter - The parameter to be used in the template
     * @param whoami - The parent component, used to check if a Text object is too long
     * @throws If parameter is a Text and the parent component (whoami) is "header" and the text over 60 characters
     * @throws If parameter is a Text and the parent component (whoami) is "body" and the text over 1024 characters
     */
    constructor(
        parameter: Text | Currency | DateTime | Image | Document | Video,
        whoami?: "header" | "body"
    ) {
        this.type = parameter._type;

        // Text type can go to hell
        if (parameter._type === "text") {
            if (whoami === "header" && parameter.body.length > 60)
                throw new Error("Header text must be 60 characters or less");

            if (whoami === "body" && parameter.body.length > 1024)
                throw new Error("Body text must be 1024 characters or less");

            Object.defineProperty(this, this.type, {
                value: parameter.body
            });
        } else {
            Object.defineProperty(this, this.type, {
                value: parameter
            });
        }
    }
}
