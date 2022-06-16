const Text = require("./text");
const { Image, Document, Video } = require("./media");

/**
 * Template API object
 * 
 * @property {String} name The name of the template
 * @property {Language} language The language of the template
 * @property {Array<(HeaderComponent|BodyComponent|ButtonComponent)>} [components] The components of the template
 * @property {String} _ The type of the object, for internal use only
 */
class Template {
    /**
     * Create a Template object for the API
     * 
     * @param {String} name Name of the template
     * @param {(String|Language)} language The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param  {...(HeaderComponent|BodyComponent|ButtonComponent)} [components] Components objects containing the parameters of the message. For text-based templates, the only supported component is BodyComponent.
     * @throws {Error} If name is not provided
     * @throws {Error} If language is not provided
     */
    constructor(name, language, ...components) {
        if (!name) throw new Error("Template must have a name");
        if (!language) throw new Error("Template must have a language");

        this.name = name;
        this.language = language instanceof Language ? language : new Language(language);
        if (components) this.components = components.map(c => typeof c.build === "function" ? c.build() : c).flat();

        this._ = "template";
    }
}

/**
 * Language API object
 * 
 * @property {String} code The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
 * @property {String} policy The language policy
 */
class Language {
    /**
     * Create a Language component for a Template message
     * 
     * @param {String} code The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param {String} [policy] The language policy the message should follow. The only supported option is 'deterministic'. The variable isn't even read by my code :)
     * @throws {Error} If code is not provided
     */
    constructor(code, policy) {
        if (!code) throw new Error("Language must have a code");
        this.policy = "deterministic";
        this.code = code;
    }
}

/**
 * Currency API object
 * 
 * @property {Number} amount_1000 The amount of the currency by 1000
 * @property {String} code The currency code
 * @property {String} fallback_value The fallback value
 * @property {String} _ The type of the object, for internal use only
 */
class Currency {
    /**
     * Builds a currency object for a Parameter
     * 
     * @param {Number} amount_1000 Amount multiplied by 1000
     * @param {String} code Currency code as defined in ISO 4217
     * @param {String} fallback_value Default text if localization fails
     * @throws {Error} If amount_1000 is not provided
     * @throws {Error} If code is not provided
     * @throws {Error} If fallback_value is not provided
     */
    constructor(amount_1000, code, fallback_value) {
        if (!amount_1000 && amount_1000 !== 0) throw new Error("Currency must have an amount_1000");
        if (!code) throw new Error("Currency must have a code");
        if (!fallback_value) throw new Error("Currency must have a fallback_value");

        this.amount_1000 = amount_1000;
        this.code = code;
        this.fallback_value = fallback_value;
        this._ = "currency";
    }
}

/**
 * DateTime API object
 * 
 * @property {String} fallback_value The fallback value
 * @property {String} _ The type of the object, for internal use only
 */
class DateTime {
    /**
     * Builds a date_time object for a Parameter
     * 
     * @param {String} fallback_value Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
     * @throws {Error} If fallback_value is not provided
     */
    constructor(fallback_value) {
        if (!fallback_value) throw new Error("Currency must have a fallback_value");
        this.fallback_value = fallback_value;
        this._ = "date_time";
    }
}

/**
 * Components API object
 * 
 * @property {String} type The type of the component
 * @property {String} sub_type The subtype of the component
 * @property {Array<ButtonParameter>} parameters The ButtonParameters to be used in the build function
 * @property {Function} build The function to build the component as a compatible API object
 */
class ButtonComponent {
    /**
     * Builds a button component for a Template message.
     * The index of the buttons is defined by the order in which you add them to the Template parameters.
     * 
     * @param {String} sub_type Type of button to create. Can be either 'url' or 'quick_reply'.
     * @param {...String} parameters Parameter for each button. The index of each parameter is defined by the order they are sent to the constructor.
     * @throws {Error} If sub_type is not either 'url' or 'quick_reply'
     * @throws {Error} If parameters is not provided
     * @throws {Error} If parameters has over 3 elements
     */
    constructor(sub_type, ...parameters) {
        if (!["url", "quick_reply"].includes(sub_type)) throw new Error("ButtonComponent sub_type must be either 'url' or 'quick_reply'");
        if (!parameters.length) throw new Error("ButtonComponent must have at least 1 parameter");
        if (parameters.length > 3) throw new Error("ButtonComponent can only have up to 3 parameters");

        const buttonType = sub_type === "url" ? "text" : "payload";
        parameters = parameters.map(e => new ButtonParameter(e, buttonType));

        this.type = "button";
        this.sub_type = sub_type;
        this.parameters = parameters;
    }

    /**
     * Generates the buttons components for a Template message. For internal use only.
     * 
     * @returns {Array<{ type: String, sub_type: String, index: String, parameters: Array<ButtonParameter> }>} An array of API compatible buttons components
     */
    build() {
        return this.parameters.map((p, i) => {
            return { type: this.type, sub_type: this.sub_type, index: i.toString(), parameters: [p] };
        });
    }
}

/**
 * Button Parameter API object
 * 
 * @property {String} type The type of the button
 * @property {String} [text] The text of the button
 * @property {String} [payload] The payload of the button
 */
class ButtonParameter {
    /**
     * Builds a button parameter for a ButtonComponent
     * 
     * @param {String} param Developer-provided data that is used to fill in the template.
     * @param {String} type The type of the button. Can be either 'text' or 'payload'.
     * @throws {Error} If param is not provided
     * @throws {Error} If type is not either 'text' or 'payload'
     */
    constructor(param, type) {
        if (!param) throw new Error("UrlButton must have a param");
        if (!["text", "payload"].includes(type)) throw new Error("UrlButton type must be either 'text' or 'payload'");

        this.type = type;
        this[type] = param;
    }
}

/**
 * Components API object
 * 
 * @property {String} type The type of the component
 * @property {Array<Parameter>} [parameters] The parameters of the component
 */
class HeaderComponent {
    /**
     * Builds a header component for a Template message
     * 
     * @param {...(Text|Currency|DateTime|Image|Document|Video|Parameter)} [parameters] Parameters of the body component
     */
    constructor(...parameters) {
        this.type = "header";
        if (parameters) this.parameters = parameters.map(e => e instanceof Parameter ? e : new Parameter(e, "header"));
    }
}

/**
 * Components API object
 * 
 * @property {String} type The type of the component
 * @property {Array<Parameter>} [parameters] The parameters of the component
 */
class BodyComponent {
    /**
     * Builds a body component for a Template message
     * 
     * @param  {...(Text|Currency|DateTime|Image|Document|Video|Parameter)} [parameters] Parameters of the body component
     */
    constructor(...parameters) {
        this.type = "body";
        if (parameters) this.parameters = parameters.map(e => e instanceof Parameter ? e : new Parameter(e, "body"));
    }
}

/**
 * Parameter API object
 * 
 * @property {String} type The type of the parameter
 * @property {String} [text] The text of the parameter
 * @property {Currency} [currency] The currency of the parameter
 * @property {DateTime} [datetime] The datetime of the parameter
 * @property {Image} [image] The image of the parameter
 * @property {Document} [document] The document of the parameter
 * @property {Video} [video] The video of the parameter
 */
class Parameter {
    /**
     * Builds a parameter object for a HeaderComponent or BodyComponent.
     * For Text parameter, the header component character limit is 60, and the body component character limit is 1024.
     * For Document parameter, only PDF documents are supported for document-based message templates.
     * 
     * @param {(Text|Currency|DateTime|Image|Document|Video)} parameter The parameter to be used in the template
     * @param {String} [whoami] The parent component, used to check if a Text object is too long. Can be either 'header' or 'body'
     * @throws {Error} If parameter is not provided
     * @throws {Error} If parameter is a Text and the parent component (whoami) is "header" and the text over 60 characters
     * @throws {Error} If parameter is a Text and the parent component (whoami) is "body" and the text over 1024 characters
     */
    constructor(parameter, whoami) {
        if (!parameter) throw new Error("Parameter object must have a parameter parameter :)");
        this.type = parameter._;
        delete parameter._;

        // Text type can go to hell
        if (this.type === "text") {
            if (whoami === "header" && parameter.body > 60) throw new Error("Header text must be 60 characters or less");
            if (whoami === "body" && parameter.body > 1024) throw new Error("Body text must be 1024 characters or less");
            this[this.type] = parameter.body;
        } else this[this.type] = parameter;
    }
}

module.exports = {
    Template,
    Language,
    ButtonComponent,
    ButtonParameter,
    HeaderComponent,
    BodyComponent,
    Parameter,
    Currency,
    DateTime
};
