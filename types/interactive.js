class Interactive {
    /**
     * Create an Interactive object for the API
     * 
     * @param {(ActionList|ActionButtons)} action The action component of the interactive message
     * @param {Body} body The body component of the interactive message
     * @param {(Header|Void)} header The header component of the interactive message
     * @param {(Footer|Void)} footer The footer component of the interactive message
     * @throws {Error} If action is not provided
     * @throws {Error} If body is not provided
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
     * @param {String} text The text of the message. Maximum length: 1024 characters.
     * @throws {Error} If text is not provided
     * @throws {Error} If text is over 1024 characters
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
     * @param {String} text Text of the footer. Maximum length: 60 characters.
     * @throws {Error} If text is not provided
     * @throws {Error} If text is over 60 characters
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
     * Builds a header component for an Interactive message.
     * For some reason this is broken on the API side. Read issue #1 for more info.
     * 
     * @param {(Document|Image|Text|Video)} object The message object for the header
     * @throws {Error} If object is not provided
     * @throws {Error} If object is not a Document, Image, Text, or Video
     */
    constructor(object) {
        if (!object) throw new Error("Header must have an object");
        if (!["text", "video", "image", "document"].includes(object._)) throw new Error(`Header object must be either Text, Video, Image or Document.`);
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
     * @param {String} button Button content. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
     * @param  {...Section} sections Sections of the list
     * @throws {Error} If button is not provided
     * @throws {Error} If button is over 20 characters
     * @throws {Error} If no sections are provided or are over 10
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
     * Builds a section component for ActionList
     * 
     * @param {String} title Title of the section
     * @param {...Row} rows Rows of the section
     * @throws {Error} If title is not provided
     * @throws {Error} If title is over 24 characters
     * @throws {Error} If no rows are provided or are over 10
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
     * @param {String} id The id of the row. Maximum length: 200 characters.
     * @param {String} title The title of the row. Maximum length: 24 characters.
     * @param {(String|Void)} description The description of the row. Maximum length: 72 characters.
     * @throws {Error} If id is not provided
     * @throws {Error} If id is over 200 characters
     * @throws {Error} If title is not provided
     * @throws {Error} If title is over 24 characters
     * @throws {Error} If description is over 72 characters
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
     * @throws {Error} If no buttons are provided or are over 3
     * @throws {Error} If two or more buttons have the same title
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
     * Builds a button component for ActionButtons
     * 
     * @param {String} id Unique identifier for your button. It cannot have leading or trailing spaces. This ID is returned in the webhook when the button is clicked by the user. Maximum length: 256 characters.
     * @param {String} title Button title. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
     * @throws {Error} If id is not provided
     * @throws {Error} If id is over 256 characters
     * @throws {Error} If title is not provided
     * @throws {Error} If title is over 20 characters
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
