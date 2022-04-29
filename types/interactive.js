class Interactive {
    /**
     * Create an Interactive object for the API
     * 
     * @param {(ActionList|ActionButtons)} action The action component of the interactive message. Built using the interactive's builder module.
     * @param {Body} body The body component of the interactive message. Built using the interactive's builder module.
     * @param {(Header|Void)} header The header component of the interactive message. Built using the interactive's builder module.
     * @param {(Footer|Void)} footer The footer component of the interactive message. Built using the interactive's builder module.
     */
    constructor(action, body, header, footer) {
        if (!action) throw new Error("Interactive must have an action component");
        if (!body) throw new Error("Interactive must have a body component");

        this.type = action._;
        delete action._;
        
        this.action = action;
        this.body = body;
        if (header) this.header = header;
        if (footer) this.footer = footer;

        this._ = "interactive";
    }
}

/**
 * Interactive Component
 */
class Body {
    /**
     * Builds a body component for an Interactive message
     * 
     * @param {String} text The text of the message
     */
    constructor(text) {
        if (!text) throw new Error("Body must have a text object");
        if (text.length > 1024) throw new Error("Body text must be less than 1024 characters");
        this.text = text;
    }
}

/**
 * Interactive Component
 */
class Footer {
    /**
     * Builds a footer component for an Interactive message
     * 
     * @param {String} text Text of the footer
     */
    constructor(text) {
        if (!text) throw new Error("Footer must have a text object");
        if (text.length > 60) throw new Error("Footer text must be 60 characters or less");
        this.text = text;
    }
}

/**
 * Interactive Component
 */
class Header {
    /**
     * Builds a header component for an Interactive message
     * 
     * @param {(Document|Image|Text|Video)} object The message object for the header. If type is text, it must be built with the text module, else it must be built with the media module of the same type.
     */
    constructor(object) {
        if (!object) throw new Error("Header must have an object");
        if (!["text", "video", "image", "document"].includes(object._)) throw new Error(`Header object must be either text, video, image or document. Recieved ${object._}`);
        this.type = object._;
        delete object._;
        this[this.type] = JSON.stringify(object);
    }
}

/**
 * Interactive Component
 */
class ActionList {
    /**
     * Builds an action component for an Interactive message
     * Required if interactive type is "list"
     * 
     * @param {String} button Button content. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not.
     * @param  {...Section} sections Sections of the list. Each section must be built with the section object at the interactive's builder module.
     */
    constructor(button, ...sections) {
        if (!button) throw new Error("Action must have a button content");
        if (button.length > 20) throw new Error("Button content must be 20 characters or less");
        if (!sections?.length || sections.length > 10) throw new Error("Action must have between 1 and 10 sections");

        this._ = "list";
        this.button = button;
        this.sections = sections;
    }
}

/**
 * ActionList Component
 */
class Section {
    /**
     * Builds a section component for an ActionList
     * 
     * @param {String} title Title of the section
     * @param  {...Row} rows Rows of the section. Each row must be built with the action object at the interactive's builder module.
     */
    constructor(title, ...rows) {
        if (!title) throw new Error("Section must have a title");
        if (title.length > 24) throw new Error("Section title must be 24 characters or less");
        if (!rows?.length || rows.length > 10) throw new Error("Section must have between 1 and 10 rows");
        this.title = title;
        this.rows = rows;
    }
}

/**
 * Section Component
 */
class Row {
    /**
     * Builds a row component for a Section
     * 
     * @param {String} id The id of the row
     * @param {String} title The title of the row
     * @param {(String|Void)} description The description of the row
     */
    constructor(id, title, description) {
        if (!id) throw new Error("Row must have an id");
        if (id.length > 200) throw new Error("Row id must be 200 characters or less");
        if (!title) throw new Error("Row must have a title");
        if (title.length > 24) throw new Error("Row title must be 24 characters or less");
        if (description.length > 72) throw new Error("Row description must be 72 characters or less");
        this.id = id;
        this.title = title;
        if (description) this.description = description;
    }
}

/**
 * Interactive Component
 */
class ActionButtons {
    /**
     * Builds a reply buttons component for an Interactive message
     * 
     * @param {...Button} button Buttons to be used in the reply buttons. Each button title must be unique within the message. Emojis are supported, markdown is not. Must be between 1 and 3 buttons.
     */
    constructor(...button) {
        if (!button?.length || button.length > 3) throw new Error("Reply buttons must have between 1 and 3 buttons");

        // Find if there are duplicates in button.titles
        const titles = button.map(b => b[b.type].title);
        if (titles.length !== new Set(titles).size) throw new Error("Reply buttons must have unique titles");

        this.buttons = button;
        this._ = "button";
    }
}

/**
 * ActionReplyButtons Component
 */
class Button {
    /**
     * Builds a button component for a ActionReplyButtons
     * 
     * @param {String} id Unique identifier for your button. It cannot have leading or trailing spaces. This ID is returned in the webhook when the button is clicked by the user. Maximum length: 256 characters.
     * @param {String} title Button title. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
     */
    constructor(id, title) {
        if (!id) throw new Error("Button must have an id");
        if (id.length > 256) throw new Error("Button id must be 256 characters or less");
        if (/^ | $/.test(id)) throw new Error("Button id cannot have leading or trailing spaces");
        if (!title) throw new Error("Button must have a title");
        if (title.length > 20) throw new Error("Button title must be 20 characters or less");

        this.type = "reply";
        this[this.type] = {
            title,
            id
        };
    }
}

module.exports = {
    Interactive,
    Body,
    Footer,
    Header,
    ActionList,
    Section,
    Row,
    ActionButtons,
    Button
};
