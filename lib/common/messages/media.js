"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = exports.Sticker = exports.Image = exports.Document = exports.Audio = exports.Media = void 0;
/**
 * Abstract class for all the media types
 *
 * @group Media
 */
class Media {
    /**
     * The id of the media
     */
    id;
    /**
     * The link of the media
     */
    link;
    /**
     * @param file - File to be sent
     * @param isItAnID - If the file is an ID (true) or an URL (false)
     */
    constructor(file, isItAnID = false) {
        this[isItAnID ? "id" : "link"] = file;
    }
    _build() {
        return JSON.stringify(this);
    }
}
exports.Media = Media;
/**
 * Audio API component
 *
 * @group Media
 */
class Audio extends Media {
    get _type() {
        return "audio";
    }
    /**
     * Create an Audio object for the API
     *
     * @param audio - The audio file's link or id
     * @param isItAnID - Whether audio is an id (true) or a link (false)
     */
    constructor(audio, isItAnID = false) {
        super(audio, isItAnID);
    }
}
exports.Audio = Audio;
/**
 * Document API component
 *
 * @group Media
 */
class Document extends Media {
    /**
     * The file's caption
     */
    caption;
    /**
     * The file's filename
     */
    filename;
    get _type() {
        return "document";
    }
    /**
     * Create a Document object for the API
     *
     * @param document - The document file's link or id
     * @param isItAnID - Whether document is an id (true) or a link (false)
     * @param caption - Describes the specified document media
     * @param filename - Describes the filename for the specific document
     */
    constructor(document, isItAnID = false, caption, filename) {
        super(document, isItAnID);
        if (caption)
            this.caption = caption;
        if (filename)
            this.filename = filename;
    }
}
exports.Document = Document;
/**
 * Image API component
 *
 * @group Media
 */
class Image extends Media {
    /**
     * The file's caption
     */
    caption;
    get _type() {
        return "image";
    }
    /**
     * Create a Image object for the API
     *
     * @param image - The image file's link or id
     * @param isItAnID - Whether image is an id (true) or a link (false)
     * @param caption - Describes the specified image media
     */
    constructor(image, isItAnID = false, caption) {
        super(image, isItAnID);
        if (caption)
            this.caption = caption;
    }
}
exports.Image = Image;
/**
 * Sticker API component
 *
 * @group Media
 */
class Sticker extends Media {
    get _type() {
        return "sticker";
    }
    /**
     * Create a Sticker object for the API
     *
     * @param sticker - The sticker file's link
     * @param isItAnID - Whether sticker is an id (true) or a link (false)
     */
    constructor(sticker, isItAnID = false) {
        super(sticker, isItAnID);
    }
}
exports.Sticker = Sticker;
/**
 * Video API component
 *
 * @group Media
 */
class Video extends Media {
    /**
     * The file's caption
     */
    caption;
    get _type() {
        return "video";
    }
    /**
     * Create a Video object for the API
     *
     * @param video - The video file's link
     * @param isItAnID - Whether video is an id (true) or a link (false)
     * @param caption - Describes the specified video media
     */
    constructor(video, isItAnID = false, caption) {
        super(video, isItAnID);
        if (caption)
            this.caption = caption;
    }
}
exports.Video = Video;
//# sourceMappingURL=media.js.map