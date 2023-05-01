/**
 * Template API object
 *
 * @group Template
 */
export class Template {
    /**
     * The name of the template
     */
    name;
    /**
     * The language of the template
     */
    language;
    /**
     * The components of the template
     */
    components;
    get _type() {
        return "template";
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @todo Find out if more than one of each component is allowed */
    /**
     * Create a Template object for the API
     *
     * @param name - Name of the template
     * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param components - Components objects containing the parameters of the message. For text-based templates, the only supported component is BodyComponent.
     */
    constructor(name, language, ...components) {
        this.name = name;
        this.language =
            typeof language === "string" ? new Language(language) : language;
        if (components.length) {
            const theres_only_body = components.length === 1 &&
                components[0] instanceof BodyComponent;
            this.components = components
                .map((cmpt) => cmpt._build(theres_only_body))
                .flat();
        }
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
    code;
    /**
     * The language policy
     */
    policy;
    /**
     * Create a Language component for a Template message
     *
     * @param code - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param policy - The language policy the message should follow. The only supported option is 'deterministic'.
     */
    constructor(code, policy = "deterministic") {
        this.policy = policy;
        this.code = code;
    }
}
/**
 * Currency API object
 *
 * @group Template
 */
export class Currency {
    /**
     * The amount of the currency by 1000
     */
    amount_1000;
    /**
     * The currency code
     */
    code;
    /**
     * The fallback value
     */
    fallback_value;
    get _type() {
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
    constructor(amount_1000, code, fallback_value) {
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
export class DateTime {
    /**
     * The fallback value
     */
    fallback_value;
    get _type() {
        return "date_time";
    }
    /**
     * Builds a date_time object for a Parameter
     *
     * @param fallback_value - Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
     */
    constructor(fallback_value) {
        this.fallback_value = fallback_value;
    }
}
/**
 * Components API object
 *
 * @group Template
 */
export class ButtonComponent {
    /**
     * The type of the component
     */
    type;
    /**
     * The subtype of the component
     */
    sub_type;
    /**
     * The ButtonParameters to be used in the build function
     */
    parameters;
    /**
     * Builds a button component for a Template message.
     * The index of the buttons is defined by the order in which you add them to the Template parameters.
     *
     * @param sub_type - The type of button to create.
     * @param parameters - Parameter for each button. The index of each parameter is defined by the order they are sent to the constructor.
     * @throws If sub_type is not either 'url' or 'quick_reply'
     * @throws If parameters is over 3 elements
     */
    constructor(sub_type, ...parameters) {
        if (parameters.length > 3)
            throw new Error("ButtonComponent must have between 1 and 3 parameters");
        const buttonType = sub_type === "url" ? "text" : "payload";
        const processed = parameters.map((e) => new ButtonParameter(e, buttonType));
        this.type = "button";
        this.sub_type = sub_type;
        this.parameters = processed;
    }
    _build() {
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
    type;
    /**
     * The text of the button
     */
    text;
    /**
     * The payload of the button
     */
    payload;
    /**
     * Builds a button parameter for a ButtonComponent
     *
     * @param param - Developer-provided data that is used to fill in the template.
     * @param type - The type of the button
     */
    constructor(param, type) {
        this.type = type;
        this[type] = param;
    }
}
/**
 * Components API object
 *
 * @group Template
 */
export class HeaderComponent {
    /**
     * The type of the component
     */
    type;
    /**
     * The parameters of the component
     */
    parameters;
    /**
     * Builds a header component for a Template message
     *
     * @param parameters - Parameters of the body component
     */
    constructor(...parameters) {
        this.type = "header";
        this.parameters = parameters;
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
export class HeaderParameter {
    /**
     * The type of the parameter
     */
    type;
    /**
     * The text of the parameter
     */
    text;
    /**
     * The currency of the parameter
     */
    currency;
    /**
     * The datetime of the parameter
     */
    date_time;
    /**
     * The image of the parameter
     */
    image;
    /**
     * The document of the parameter
     */
    document;
    /**
     * The video of the parameter
     */
    video;
    /**
     * The location of the parameter
     */
    location;
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
    constructor(parameter) {
        if (typeof parameter === "string") {
            if (parameter.length > 60)
                throw new Error("Header text must be 60 characters or less");
            this.type = "text";
        }
        else {
            if (parameter._type === "location" &&
                !(parameter.name && parameter.address)) {
                throw new Error("Header location must have a name and address");
            }
            this.type = parameter._type;
        }
        Object.defineProperty(this, this.type, {
            value: parameter
        });
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
    type;
    /**
     * The parameters of the component
     */
    parameters;
    /**
     * Builds a body component for a Template message
     *
     * @param parameters - Parameters of the body component
     */
    constructor(...parameters) {
        this.type = "body";
        this.parameters = parameters;
    }
    _build(theres_only_body) {
        // If there are parameters and need to check for the shorter max text length
        if (this.parameters && !theres_only_body) {
            for (const param of this.parameters) {
                if (param.text && param.text?.length > 1024) {
                    throw new Error("Body text must be 1024 characters or less");
                }
            }
        }
        return this;
    }
}
/**
 * Parameter API object
 *
 * @group Template
 */
export class BodyParameter {
    /**
     * The type of the parameter
     */
    type;
    /**
     * The text of the parameter
     */
    text;
    /**
     * The currency of the parameter
     */
    currency;
    /**
     * The datetime of the parameter
     */
    date_time;
    /**
     * Builds a parameter object for a BodyComponent.
     * For text parameter, the character limit is 32768 if only one BodyComponent is used for the Template, else it's 1024.
     *
     * @param parameter - The parameter to be used in the template
     * @throws If parameter is a string and it's over 32768 characters
     * @throws If parameter is a string, there are other components in the Template and it's over 1024 characters
     * @see BodyComponent._build The method that checks the 1024 character limit
     */
    constructor(parameter) {
        if (typeof parameter === "string") {
            // Check the upper limit of the string length here
            // If a shorter one is needed, check and throw an
            // error on the build method of BodyComponent
            if (parameter.length > 32_768)
                throw new Error("Body text must be 32768 characters or less");
            this.type = "text";
        }
        else {
            this.type = parameter._type;
        }
        Object.defineProperty(this, this.type, {
            value: parameter
        });
    }
}
//# sourceMappingURL=template.js.map