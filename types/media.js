/**
 * Media Object
 */
class Audio {
    /**
     * Create an Audio object for the API
     * 
     * @param {String} audio The audio file's link or id
     * @param {Boolean} isItAnID Whether audio is an id (true) or a link (false, default)
     */
    constructor(audio, isItAnID = false) {
        if (!audio) throw new Error("Audio must have an audio link or id");
        this[isItAnID ? "id" : "link"] = audio;
    }
}

/**
 * Media Object
 */
class Document {
    /**
     * Create a Document object for the API
     * 
     * @param {String} document The document file's link or id
     * @param {Boolean} isItAnID Whether document is an id (true) or a link (false, default)
     * @param {(String|Void)} caption Describes the specified document media
     * @param {(String|Void)} filename Describes the filename for the specific document
     */
    constructor(document, isItAnID = false, caption, filename) {
        if (!document) throw new Error("Document must have a document link or id");
        this[isItAnID ? "id" : "link"] = document;
        if (caption) this.caption = caption;
        if (filename) this.filename = filename;
    }
}

/**
 * Media Object
 */
class Image {
    /**
     * Create a Image object for the API
     * 
     * @param {String} image The image file's link or id
     * @param {Boolean} isItAnID Whether document is an id (true) or a link (false, default)
     * @param {(String|Void)} caption Describes the specified image media
     */
    constructor(image, isItAnID = false, caption) {
        if (!image) throw new Error("Image must have an image link or id");
        this[isItAnID ? "id" : "link"] = image;
        if (caption) this.caption = caption;
    }
}

/**
 * Media Object
 */
class Sticker {
    /**
     * Create a Sticker object for the API
     * 
     * @param {String} sticker The sticker file's link
     */
    constructor(sticker) {
        if (!sticker) throw new Error("Sticker must have a sticker link");
        this.sticker = sticker;
    }
}

/**
 * Media Object
 */
class Video {
    /**
     * Create a Video object for the API
     * 
     * @param {String} video The video file's link
     */
    constructor(video) {
        if (!video) throw new Error("Video must have a video link");
        this.video = video;
    }
}

module.exports = { Audio, Document, Image, Sticker, Video };
