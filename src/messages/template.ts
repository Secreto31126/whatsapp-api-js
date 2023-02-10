import Text from "./text";
import type { Document, Image, Video } from "./media";

type BuiltButtonComponent = {
    type: "button";
    sub_type: "url" | "quick_reply";
    index: string;
    parameters: Array<ButtonParameter>;
};

/**
 * Template API object
 *
 * @property {string} name The name of the template
 * @property {Language} language The language of the template
 * @property {Array<(HeaderComponent|BodyComponent|BuiltButtonComponent)>} [components] The components of the template
 * @property {"template"} [_] The type of the object, for internal use only
 */
export class Template {
    name: string;
    language: Language;
    components?: (HeaderComponent | BodyComponent | BuiltButtonComponent)[];
    _?: "template";

    /**
     * Create a Template object for the API
     *
     * @param {string} name Name of the template
     * @param {(string|Language)} language The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param  {...(HeaderComponent|BodyComponent|ButtonComponent)} components Components objects containing the parameters of the message. For text-based templates, the only supported component is BodyComponent.
     * @throws {Error} If name is not provided
     * @throws {Error} If language is not provided
     */
    constructor(
        name: string,
        language: string | Language,
        ...components: (HeaderComponent | BodyComponent | ButtonComponent)[]
    ) {
        if (!name) throw new Error("Template must have a name");
        if (!language) throw new Error("Template must have a language");

        this.name = name;
        this.language =
            language instanceof Language ? language : new Language(language);
        if (components)
            this.components = components
                .map((cmpt) =>
                    "build" in cmpt && typeof cmpt.build === "function"
                        ? cmpt.build()
                        : cmpt
                )
                .flat() as (
                | HeaderComponent
                | BodyComponent
                | BuiltButtonComponent
            )[];

        this._ = "template";
    }
}

/**
 * Language API object
 *
 * @property {string} code The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
 * @property {"deterministic"} policy The language policy
 */
export class Language {
    code: string;
    policy: "deterministic";

    /**
     * Create a Language component for a Template message
     *
     * @param {string} code The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param {string} [policy] The language policy the message should follow. The only supported option is 'deterministic'. The variable isn't even read by my code :)
     * @throws {Error} If code is not provided
     */
    constructor(code: string, policy: "deterministic" = "deterministic") {
        if (!code) throw new Error("Language must have a code");
        this.policy = policy;
        this.code = code;
    }
}

/**
 * Currency API object
 *
 * @property {number} amount_1000 The amount of the currency by 1000
 * @property {string} code The currency code
 * @property {string} fallback_value The fallback value
 * @property {"currency"} [_] The type of the object, for internal use only
 */
export class Currency {
    amount_1000: number;
    code: string;
    fallback_value: string;
    _?: "currency";

    /**
     * Builds a currency object for a Parameter
     *
     * @param {number} amount_1000 Amount multiplied by 1000
     * @param {string} code Currency code as defined in ISO 4217
     * @param {string} fallback_value Default text if localization fails
     * @throws {Error} If amount_1000 is not provided
     * @throws {Error} If code is not provided
     * @throws {Error} If fallback_value is not provided
     */
    constructor(amount_1000: number, code: string, fallback_value: string) {
        if (!amount_1000 && amount_1000 !== 0)
            throw new Error("Currency must have an amount_1000");
        if (!code) throw new Error("Currency must have a code");
        if (!fallback_value)
            throw new Error("Currency must have a fallback_value");

        this.amount_1000 = amount_1000;
        this.code = code;
        this.fallback_value = fallback_value;
        this._ = "currency";
    }
}

/**
 * DateTime API object
 *
 * @property {string} fallback_value The fallback value
 * @property {"date_time"} [_] The type of the object, for internal use only
 */
export class DateTime {
    fallback_value: string;
    _?: "date_time";

    /**
     * Builds a date_time object for a Parameter
     *
     * @param {string} fallback_value Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
     * @throws {Error} If fallback_value is not provided
     */
    constructor(fallback_value: string) {
        if (!fallback_value)
            throw new Error("DateTime must have a fallback_value");
        this.fallback_value = fallback_value;
        this._ = "date_time";
    }
}

/**
 * Components API object
 *
 * @property {"button"} type The type of the component
 * @property {("url"|"quick_reply")} sub_type The subtype of the component
 * @property {Array<ButtonParameter>} parameters The ButtonParameters to be used in the build function
 * @property {Function} build The function to build the component as a compatible API object
 */
export class ButtonComponent {
    type: "button";
    sub_type: "url" | "quick_reply";
    parameters: ButtonParameter[];

    /**
     * Builds a button component for a Template message.
     * The index of the buttons is defined by the order in which you add them to the Template parameters.
     *
     * @param {("url"|"quick_reply")} sub_type The type of button to create.
     * @param {...string} parameters Parameter for each button. The index of each parameter is defined by the order they are sent to the constructor.
     * @throws {Error} If sub_type is not either 'url' or 'quick_reply'
     * @throws {Error} If parameters is not provided
     * @throws {Error} If parameters has over 3 elements
     */
    constructor(sub_type: "url" | "quick_reply", ...parameters: string[]) {
        if (!["url", "quick_reply"].includes(sub_type))
            throw new Error(
                "ButtonComponent sub_type must be either 'url' or 'quick_reply'"
            );
        if (!parameters.length)
            throw new Error("ButtonComponent must have at least 1 parameter");
        if (parameters.length > 3)
            throw new Error("ButtonComponent can only have up to 3 parameters");

        const buttonType = sub_type === "url" ? "text" : "payload";
        const processed = parameters.map(
            (e) => new ButtonParameter(e, buttonType)
        );

        this.type = "button";
        this.sub_type = sub_type;
        this.parameters = processed;
    }

    /**
     * Generates the buttons components for a Template message. For internal use only.
     *
     * @package
     * @returns {Array<BuiltButtonComponent>} An array of API compatible buttons components
     */
    build(): Array<BuiltButtonComponent> {
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
 * @property {("text"|"payload")} type The type of the button
 * @property {string} [text] The text of the button
 * @property {string} [payload] The payload of the button
 */
export class ButtonParameter {
    type: "text" | "payload";
    text?: string;
    payload?: string;

    /**
     * Builds a button parameter for a ButtonComponent
     *
     * @param {string} param Developer-provided data that is used to fill in the template.
     * @param {("text"|"payload")} type The type of the button. Can be either 'text' or 'payload'.
     * @throws {Error} If param is not provided
     * @throws {Error} If type is not either 'text' or 'payload'
     */
    constructor(param: string, type: "text" | "payload") {
        if (!param) throw new Error("UrlButton must have a param");
        if (!["text", "payload"].includes(type))
            throw new Error(
                "UrlButton type must be either 'text' or 'payload'"
            );

        this.type = type;
        this[type] = param;
    }
}

/**
 * Components API object
 *
 * @property {"header"} type The type of the component
 * @property {Array<Parameter>} [parameters] The parameters of the component
 */
export class HeaderComponent {
    type: "header";
    parameters?: Parameter[];

    /**
     * Builds a header component for a Template message
     *
     * @param {...(Text|Currency|DateTime|Image|Document|Video|Parameter)} parameters Parameters of the body component
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
}

/**
 * Components API object
 *
 * @property {"body"} type The type of the component
 * @property {Array<Parameter>} [parameters] The parameters of the component
 */
export class BodyComponent {
    type: "body";
    parameters?: Parameter[];

    /**
     * Builds a body component for a Template message
     *
     * @param  {...(Text|Currency|DateTime|Image|Document|Video|Parameter)} parameters Parameters of the body component
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
}

/**
 * Parameter API object
 *
 * @property {("text"|"currency"|"date_time"|"image"|"document"|"video")} type The type of the parameter
 * @property {string} [text] The text of the parameter
 * @property {Currency} [currency] The currency of the parameter
 * @property {DateTime} [date_time] The datetime of the parameter
 * @property {Image} [image] The image of the parameter
 * @property {Document} [document] The document of the parameter
 * @property {Video} [video] The video of the parameter
 */
export class Parameter {
    type: "text" | "currency" | "date_time" | "image" | "document" | "video";
    text?: string;
    currency?: Currency;
    date_time?: DateTime;
    image?: Image;
    document?: Document;
    video?: Video;

    /**
     * Builds a parameter object for a HeaderComponent or BodyComponent.
     * For Text parameter, the header component character limit is 60, and the body component character limit is 1024.
     * For Document parameter, only PDF documents are supported for document-based message templates.
     *
     * @param {(Text|Currency|DateTime|Image|Document|Video)} parameter The parameter to be used in the template
     * @param {("header"|"body")} [whoami] The parent component, used to check if a Text object is too long. Can be either 'header' or 'body'
     * @throws {Error} If parameter is not provided
     * @throws {Error} If parameter is a Text and the parent component (whoami) is "header" and the text over 60 characters
     * @throws {Error} If parameter is a Text and the parent component (whoami) is "body" and the text over 1024 characters
     */
    constructor(
        parameter: Text | Currency | DateTime | Image | Document | Video,
        whoami?: "header" | "body"
    ) {
        if (!parameter) {
            throw new Error(
                "Parameter object must have a parameter parameter :)"
            );
        }

        if (!parameter._) {
            throw new Error(
                "Unexpected internal error (parameter._ is not defined)"
            );
        }

        this.type = parameter._;
        delete parameter._;

        // Text type can go to hell
        if (parameter instanceof Text) {
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
