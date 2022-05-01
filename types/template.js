class Template {
    /**
     * Create a Template object for the API
     * 
     * @param {String} name Name of the template
     * @param {String} language The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param  {...any} component Components objects containing the parameters of the message. Built using the template's module builders.
     */
    constructor(name, language, ...component) {
        this.name = name;
        this.language = { code: language };
        this.component = component;
        this._ = "template";
    }
}

class Component {
    constructor(type, index, sub_index, ...parameter) {}
}

class Button {
    /**
     * 
     * @param {String} type Indicates the type of parameter for the button. It can either be "url" or "payload".
     * @param {String} params The parameter for the button. If type == "payload": Developer-defined payload that is returned when the button is clicked in addition to the display text on the button. If type == "url": Developer-provided suffix that is appended to the predefined prefix URL in the template.
     */
    constructor(type, params) {
        if (!type) throw new Error("Button must have a type");
        if (!["url", "payload"].includes(type)) throw new Error("Button type must be either 'url' or 'payload'");
        if (!params) throw new Error("Button must have a params");
        this.type = type;
        this[type] = params;
    }
}
