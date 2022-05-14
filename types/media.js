/**
 * Placeholder class for all the media types
 * 
 * @property {String} type The type of the media
 * @property {String} [id] The id of the media
 * @property {String} [link] The link of the media
 * @property {String} _ The type of the object, for internal use only
 */
class Media {
    /**
     * This method works as a placeholder so the documentation looks nice.
     * You shouldn't be using it directly ¯\_(ツ)_/¯.
     * 
     * @param {String} type Type of the parameter
     * @param {String} file File to be sent
     * @param {Boolean} isItAnID If the file is an ID (true) or an URL (false)
     * @throws {Error} If type is not provided
     * @throws {Error} If file is not provided
     */
    constructor(type, file, isItAnID = false) {
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
 */
class Audio extends Media {
    /**
     * Create an Audio object for the API
     * 
     * @param {String} audio The audio file's link or id
     * @param {Boolean} isItAnID Whether audio is an id (true) or a link (false)
     */
    constructor(audio, isItAnID = false) {
        if (!audio) throw new Error("Audio must have an audio link or id");
        super("audio", audio, isItAnID);
    }
}

/**
 * Document API component
 * 
 * @extends Media
 * @property {String} [caption] The file's caption
 * @property {String} [filename] The file's filename
 */
class Document extends Media {
    /**
     * Create a Document object for the API
     * 
     * @param {String} document The document file's link or id
     * @param {Boolean} isItAnID Whether document is an id (true) or a link (false)
     * @param {String} [caption] Describes the specified document media
     * @param {String} [filename] Describes the filename for the specific document
     */
    constructor(document, isItAnID = false, caption, filename) {
        if (!document) throw new Error("Document must have a document link or id");
        super("document", document, isItAnID);
        if (caption) this.caption = caption;
        if (filename) this.filename = filename;
    }
}

/**
 * Image API component
 * 
 * @extends Media
 * @property {String} [caption] The file's caption
 */
class Image extends Media {
    /**
     * Create a Image object for the API
     * 
     * @param {String} image The image file's link or id
     * @param {Boolean} isItAnID Whether image is an id (true) or a link (false)
     * @param {String} [caption] Describes the specified image media
     */
    constructor(image, isItAnID = false, caption) {
        if (!image) throw new Error("Image must have an image link or id");
        super("image", image, isItAnID);
        if (caption) this.caption = caption;
    }
}

/**
 * Sticker API component
 * 
 * @extends Media
 */
class Sticker extends Media {
    /**
     * Create a Sticker object for the API
     * 
     * @param {String} sticker The sticker file's link
     * @param {Boolean} isItAnID Whether sticker is an id (true) or a link (false)
     */
    constructor(sticker, isItAnID = false) {
        if (!sticker) throw new Error("Sticker must have a sticker link or id");
        super("sticker", sticker, isItAnID);
    }
}

/**
 * Video API component
 * 
 * @extends Media
 * @property {String} [caption] The file's caption
 */
class Video extends Media {
    /**
     * Create a Video object for the API
     * 
     * @param {String} video The video file's link
     * @param {Boolean} isItAnID Whether video is an id (true) or a link (false)
     * @param {String} [caption] Describes the specified video media
     */
    constructor(video, isItAnID = false, caption) {
        if (!video) throw new Error("Video must have a video link or id");
        super("video", video, isItAnID);
        if (caption) this.caption = caption;
    }
}

module.exports = { Media, Audio, Document, Image, Sticker, Video };
