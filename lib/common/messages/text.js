"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Text API object
 *
 * @group Text
 */
class Text {
    /**
     * Body of the message. Maximum length: 4096 characters.
     */
    body;
    /**
     * Whether to enable preview for the text message
     */
    preview_url;
    get _type() {
        return "text";
    }
    /**
     * Create a Text object for the API
     *
     * @param body - The content of the text message which can contain formatting and URLs which begin with http:// or https://
     * @param preview_url - By default, WhatsApp recognizes URLs and makes them clickable, but you can also include a preview box with more information about the link. Set this field to true if you want to include a URL preview box.
     * @throws If body is over 4096 characters
     */
    constructor(body, preview_url) {
        if (body.length > 4096)
            throw new Error("Text body must be less than 4096 characters");
        this.body = body;
        if (preview_url)
            this.preview_url = preview_url;
    }
    _build() {
        return JSON.stringify(this);
    }
}
exports.default = Text;
//# sourceMappingURL=text.js.map