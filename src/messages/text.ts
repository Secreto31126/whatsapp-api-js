/**
 * Text API object
 *
 * @property {string} body Body of the message. Maximum length: 4096 characters.
 * @property {Boolean} [preview_url] Whether to enable preview for the text message
 * @property {"text"} [_] The type of the object, for internal use only
 */
export default class Text {
    body: string;
    preview_url?: boolean;
    _?: "text";

    /**
     * Create a Text object for the API
     *
     * @param {string} body The content of the text message which can contain formatting and URLs which begin with http:// or https://
     * @param {Boolean} [preview_url] By default, WhatsApp recognizes URLs and makes them clickable, but you can also include a preview box with more information about the link. Set this field to true if you want to include a URL preview box.
     * @throws {Error} If body is not provided
     * @throws {Error} If body is over 4096 characters
     */
    constructor(body: string, preview_url: boolean) {
        if (!body) throw new Error("Text must have a body object");
        if (body.length > 4096)
            throw new Error("Text body must be less than 4096 characters");
        this.body = body;
        if (preview_url !== undefined) this.preview_url = preview_url;
        this._ = "text";
    }
}
