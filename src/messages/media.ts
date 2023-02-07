/**
 * Placeholder class for all the media types
 *
 * @property {string} [id] The id of the media
 * @property {string} [link] The link of the media
 * @property {("audio"|"document"|"image"|"sticker"|"video")} [_] The type of the object, for internal use only
 */
export class Media {
    id?: string;
    link?: string;
    _?: "audio" | "document" | "image" | "sticker" | "video";

    /**
     * This method works as a placeholder so the documentation looks nice.
     * You shouldn't be using it directly ¯\_(ツ)_/¯.
     *
     * @param {("audio"|"document"|"image"|"sticker"|"video")} type Type of the parameter
     * @param {string} file File to be sent
     * @param {boolean} isItAnID If the file is an ID (true) or an URL (false)
     * @throws {Error} If type is not provided
     * @throws {Error} If file is not provided
     */
    constructor(
        type: "audio" | "document" | "image" | "sticker" | "video",
        file: string,
        isItAnID: boolean = false
    ) {
        if (!type) throw new Error("Media must have a type");
        if (!file) throw new Error("Media must have a file");

        this[isItAnID ? "id" : "link"] = file;
        this._ = type;
    }
}

/**
 * Audio API component
 *
 * @extends Media
 * @property {"audio"} [_] The type of the object, for internal use only
 */
export class Audio extends Media {
    _?: "audio";

    /**
     * Create an Audio object for the API
     *
     * @param {string} audio The audio file's link or id
     * @param {Boolean} isItAnID Whether audio is an id (true) or a link (false)
     */
    constructor(audio: string, isItAnID: boolean = false) {
        if (!audio) throw new Error("Audio must have an audio link or id");
        super("audio", audio, isItAnID);
    }
}

/**
 * Document API component
 *
 * @extends Media
 * @property {string} [caption] The file's caption
 * @property {string} [filename] The file's filename
 * @property {"document"} [_] The type of the object, for internal use only
 */
export class Document extends Media {
    caption?: string;
    filename?: string;
    _?: "document";

    /**
     * Create a Document object for the API
     *
     * @param {string} document The document file's link or id
     * @param {Boolean} isItAnID Whether document is an id (true) or a link (false)
     * @param {string} [caption] Describes the specified document media
     * @param {string} [filename] Describes the filename for the specific document
     */
    constructor(
        document: string,
        isItAnID: boolean = false,
        caption: string,
        filename: string
    ) {
        if (!document)
            throw new Error("Document must have a document link or id");
        super("document", document, isItAnID);
        if (caption) this.caption = caption;
        if (filename) this.filename = filename;
    }
}

/**
 * Image API component
 *
 * @extends Media
 * @property {string} [caption] The file's caption
 * @property {"image"} [_] The type of the object, for internal use only
 */
export class Image extends Media {
    caption?: string;
    _?: "image";

    /**
     * Create a Image object for the API
     *
     * @param {string} image The image file's link or id
     * @param {Boolean} isItAnID Whether image is an id (true) or a link (false)
     * @param {string} [caption] Describes the specified image media
     */
    constructor(image: string, isItAnID: boolean = false, caption: string) {
        if (!image) throw new Error("Image must have an image link or id");
        super("image", image, isItAnID);
        if (caption) this.caption = caption;
    }
}

/**
 * Sticker API component
 *
 * @extends Media
 * @property {"sticker"} [_] The type of the object, for internal use only
 */
export class Sticker extends Media {
    _?: "sticker";

    /**
     * Create a Sticker object for the API
     *
     * @param {string} sticker The sticker file's link
     * @param {Boolean} isItAnID Whether sticker is an id (true) or a link (false)
     */
    constructor(sticker: string, isItAnID: boolean = false) {
        if (!sticker) throw new Error("Sticker must have a sticker link or id");
        super("sticker", sticker, isItAnID);
    }
}

/**
 * Video API component
 *
 * @extends Media
 * @property {string} [caption] The file's caption
 * @property {"video"} [_] The type of the object, for internal use only
 */
export class Video extends Media {
    caption?: string;
    _?: "video";

    /**
     * Create a Video object for the API
     *
     * @param {string} video The video file's link
     * @param {Boolean} isItAnID Whether video is an id (true) or a link (false)
     * @param {string} [caption] Describes the specified video media
     */
    constructor(video: string, isItAnID: boolean = false, caption: string) {
        if (!video) throw new Error("Video must have a video link or id");
        super("video", video, isItAnID);
        if (caption) this.caption = caption;
    }
}
