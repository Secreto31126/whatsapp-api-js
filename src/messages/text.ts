/**
 * Text API object
 * @public
 */
export default class Text {
    /**
     * Body of the message. Maximum length: 4096 characters.
     */
    body: string;
    /**
     * Whether to enable preview for the text message
     */
    preview_url?: boolean;

    /**
     * The type of the object
     * @internal
     */
    get _(): "text" {
        return "text";
    }

    /**
     * Create a Text object for the API
     *
     * @param body - The content of the text message which can contain formatting and URLs which begin with http:// or https://
     * @param preview_url - By default, WhatsApp recognizes URLs and makes them clickable, but you can also include a preview box with more information about the link. Set this field to true if you want to include a URL preview box.
     * @throws If body is not provided
     * @throws If body is over 4096 characters
     */
    constructor(body: string, preview_url?: boolean) {
        if (!body) throw new Error("Text must have a body object");
        if (body.length > 4096)
            throw new Error("Text body must be less than 4096 characters");
        this.body = body;
        if (preview_url !== undefined) this.preview_url = preview_url;
    }
}
