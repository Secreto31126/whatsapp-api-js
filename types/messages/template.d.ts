/**
 * Template API object
 *
 * @property {String} name The name of the template
 * @property {Language} language The language of the template
 * @property {Array<(HeaderComponent|BodyComponent|ButtonComponent)>} [components] The components of the template
 * @property {String} [_] The type of the object, for internal use only
 */
export class Template {
    /**
     * Create a Template object for the API
     *
     * @param {String} name Name of the template
     * @param {(String|Language)} language The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param  {...(HeaderComponent|BodyComponent|ButtonComponent)} components Components objects containing the parameters of the message. For text-based templates, the only supported component is BodyComponent.
     * @throws {Error} If name is not provided
     * @throws {Error} If language is not provided
     */
    constructor(name: string, language: (string | Language), ...components: (HeaderComponent | BodyComponent | ButtonComponent)[]);
    name: string;
    language: Language;
    components: any;
    _: string;
}
/**
 * Language API object
 *
 * @property {String} code The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
 * @property {String} policy The language policy
 */
export class Language {
    /**
     * Create a Language component for a Template message
     *
     * @param {String} code The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param {String} [policy] The language policy the message should follow. The only supported option is 'deterministic'. The variable isn't even read by my code :)
     * @throws {Error} If code is not provided
     */
    constructor(code: string, policy?: string);
    policy: string;
    code: string;
}
/**
 * Components API object
 *
 * @property {String} type The type of the component
 * @property {String} sub_type The subtype of the component
 * @property {Array<ButtonParameter|String>} parameters The ButtonParameters to be used in the build function
 * @property {Function} build The function to build the component as a compatible API object
 */
export class ButtonComponent {
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
    constructor(sub_type: string, ...parameters: string[]);
    type: string;
    sub_type: string;
    parameters: ButtonParameter[];
    /**
     * Generates the buttons components for a Template message. For internal use only.
     *
     * @package
     * @returns {Array<{ type: String, sub_type: String, index: String, parameters: Array<ButtonParameter> }>} An array of API compatible buttons components
     */
    build(): Array<{
        type: string;
        sub_type: string;
        index: string;
        parameters: Array<ButtonParameter>;
    }>;
}
/**
 * Button Parameter API object
 *
 * @property {String} type The type of the button
 * @property {String} [text] The text of the button
 * @property {String} [payload] The payload of the button
 */
export class ButtonParameter {
    /**
     * Builds a button parameter for a ButtonComponent
     *
     * @param {String} param Developer-provided data that is used to fill in the template.
     * @param {String} type The type of the button. Can be either 'text' or 'payload'.
     * @throws {Error} If param is not provided
     * @throws {Error} If type is not either 'text' or 'payload'
     */
    constructor(param: string, type: string);
    type: string;
}
/**
 * Components API object
 *
 * @property {String} type The type of the component
 * @property {Array<Parameter>} [parameters] The parameters of the component
 */
export class HeaderComponent {
    /**
     * Builds a header component for a Template message
     *
     * @param {...(Text|Currency|DateTime|Image|Document|Video|Parameter)} parameters Parameters of the body component
     */
    constructor(...parameters: (Text | Currency | DateTime | Image | Document | Video | Parameter)[]);
    type: string;
    parameters: Parameter[];
}
/**
 * Components API object
 *
 * @property {String} type The type of the component
 * @property {Array<Parameter>} [parameters] The parameters of the component
 */
export class BodyComponent {
    /**
     * Builds a body component for a Template message
     *
     * @param  {...(Text|Currency|DateTime|Image|Document|Video|Parameter)} parameters Parameters of the body component
     */
    constructor(...parameters: (Text | Currency | DateTime | Image | Document | Video | Parameter)[]);
    type: string;
    parameters: Parameter[];
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
export class Parameter {
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
    constructor(parameter: (Text | Currency | DateTime | Image | Document | Video), whoami?: string);
    type: string;
}
/**
 * Currency API object
 *
 * @property {Number} amount_1000 The amount of the currency by 1000
 * @property {String} code The currency code
 * @property {String} fallback_value The fallback value
 * @property {String} [_] The type of the object, for internal use only
 */
export class Currency {
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
    constructor(amount_1000: number, code: string, fallback_value: string);
    amount_1000: number;
    code: string;
    fallback_value: string;
    _: string;
}
/**
 * DateTime API object
 *
 * @property {String} fallback_value The fallback value
 * @property {String} [_] The type of the object, for internal use only
 */
export class DateTime {
    /**
     * Builds a date_time object for a Parameter
     *
     * @param {String} fallback_value Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
     * @throws {Error} If fallback_value is not provided
     */
    constructor(fallback_value: string);
    fallback_value: string;
    _: string;
}
import Text = require("./text");
import { Image } from "./media";
import { Document } from "./media";
import { Video } from "./media";
//# sourceMappingURL=template.d.ts.map