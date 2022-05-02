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
     * @param  {...(HeaderComponent|BodyComponent|ButtonComponent)} components Components objects containing the parameters of the message. For text-based templates, the only supported component is BodyComponent.
     * @throws {Error} If name is not provided
     * @throws {Error} If language is not provided
     */
    constructor(name, language, ...components) {
        if (!name) throw new Error("Template must have a name");
        if (!language) throw new Error("Template must have a language");

        const indexes = components.filter(e => e instanceof ButtonComponent).map(e => e.index);
        if (indexes.length !== new Set(indexes).size) throw new Error("ButtonComponents must have unique ids");

        this.name = name;
        this.language = language instanceof Language ? language : new Language(language);
        if (components) this.components = components;

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
     * @param {String} policy The language policy the message should follow. The only supported option is 'deterministic'. The variable isn't even read by my code :)
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
 * @property {String} index The index of the component
 * @property {Array<(UrlButton|PayloadButton)>} parameters The parameters of the component
 */
class ButtonComponent {
    /**
     * Builds a button component for a Template message
     * 
     * @param {Number} index Position index of the button. You can have up to 3 buttons using index values of 0 to 2.
     * @param {String} sub_type Type of button to create. Can be either 'url' or 'quick_reply'.
     * @param  {...(UrlButton|PayloadButton)} parameters Parameters of the button.
     */
    constructor(index, sub_type, ...parameters) {
        if (!index?.toString()) throw new Error("ButtonComponent must have an index");
        if (!index < 0 || index > 2) throw new Error("ButtonComponent index must be between 0 and 2");
        if (!['quick_reply', 'url'].includes(sub_type)) throw new Error("ButtonComponent sub_type must be either 'quick_reply' or 'url'");
        if (!parameters?.length) throw new Error("ButtonComponent must have at least one parameter");

        for (const param of parameters) {
            if (sub_type === "quick_reply" && param instanceof UrlButton) throw new Error("ButtonComponent of type 'quick_replies' cannot have a UrlButton");
            if (sub_type === "url" && param instanceof PayloadButton) throw new Error("ButtonComponent of type 'url' cannot have a PayloadButton");
        }
        
        this.type = "button";
        this.sub_type = sub_type;
        this.index = index.toString();
        this.parameters = parameters;
    }
}

/**
 * Button Parameter API object
 * 
 * @property {String} type The type of the button
 * @property {String} text The text of the button
 */
class UrlButton {
    /**
     * Builds a url button object for a ButtonComponent
     * 
     * @param {String} text Developer-provided suffix that is appended to the predefined prefix URL in the template.
     * @throws {Error} If url is not provided
     */
    constructor(text) {
        if (!text) throw new Error("UrlButton must have a text");
        this.type = "text";
        this.text = text;
    }
}

/**
 * Button Parameter API object
 * 
 * @property {String} type The type of the button
 * @property {String} payload The payload of the button
 */
class PayloadButton {
    /**
     * Builds a payload button object for a ButtonComponent
     * 
     * @param {String} payload Developer-defined payload that is returned when the button is clicked in addition to the display text on the button
     * @throws {Error} If payload is not provided
     */
    constructor(payload) {
        if (!payload) throw new Error("PayloadButton must have a payload");
        this.type = "payload";
        this.payload = payload;
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
     * @param {...(Text|Currency|DateTime|Image|Document|Video)} parameters Parameters of the body component
     */
    constructor(...parameters) {
        this.type = "header";
        if (parameters) this.parameters = parameters.map(e => e instanceof Parameter ? e : new Parameter(e));
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
     * @param  {...(Text|Currency|DateTime|Image|Document|Video)} parameters Parameters of the body component
     */
    constructor(...parameters) {
        this.type = "body";
        if (parameters) this.parameters = parameters.map(e => new Parameter(e));
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
     * @throws {Error} If parameter is not provided
     */
    constructor(parameter) {
        if (!parameter) throw new Error("Parameter must have a parameter");
        this.type = parameter._;
        delete parameter._;
        // Text type can go to hell
        if (this.type === "text") this.text = parameter.body; else this[this.type] = parameter;
    }
}

module.exports = {
    Template,
    Language,
    ButtonComponent,
    UrlButton,
    PayloadButton,
    HeaderComponent,
    BodyComponent,
    Parameter,
    Currency,
    DateTime
};
