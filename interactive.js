// /**
//  * Create an API compatible interactive element
//  * 
//  * @param {Array} params An array with interactive components
//  * @returns {Object} The API compatible interactive object
//  */
//  function interactive(type, params) {
//     const interactive = {};
//     for (const el of params) {
//         const name = el.constructor.name;
        
//         if (!interactive[name]) interactive[name] = [];
//         interactive[name].push(el);
//     }

//     if (!interactive.action) throw new Error("Interactive must have an action object");
//     if (!interactive.body) throw new Error("Interactive must have a body object");
//     if (!interactive.type) throw new Error("Interactive must have a type object");
    
//     return {
//         interactive: JSON.stringify(interactive)
//     };
// }

class Interactive {
    constructor(type, params) {}
}

/**
 * Interactive Component
 */
class Body {
    /**
     * Builds a body object for an interactive message
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
     * Builds a footer object for an interactive message
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
     * Builds a header object for an interactive message
     * 
     * @param {String} type The header type you would like to use. Possible values: "text", "image", "video" or "document"
     * @param {(Document|Image|Text|Video)} param The message object for the header. If type is text, it must be built with the text module, else it must be built with the media module of the same type.
     */
    constructor(type, param) {
        if (!["text", "video", "image", "document"].includes(type)) throw new Error("Header must have a type object, either text, video, image or document");
        if (!param) throw new Error(`Header must have a ${type} media object, built using the ${type}'s builder module`);
        if (param.constructor.name.toLowerCase() !== type) throw new Error(`Expected a ${type} object as param, but recieved a ${param.constructor.name} one`);
        this.type = type;
        this.param = param;
    }
}
