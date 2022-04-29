/**
 * Create a Text object for the API
 * 
 * @param {String} body The text of the text message which can contain formatting and URLs which begin with http:// or https://
 * @param {Boolean} preview_url By default, WhatsApp recognizes URLs and makes them clickable, but you can also include a preview box with more information about the link. Set this field to true if you want to include a URL preview box. Defaults to false.
 */
class Text {
    constructor(body, preview_url = false) {
        if (!body) throw new Error("Text must have a body object");
        if (body.length > 1024) throw new Error("Text body must be less than 1024 characters");
        this.body = body;
        if (preview_url) this.preview_url = preview_url;
        this._ = "text";
    }
}

module.exports = Text;
