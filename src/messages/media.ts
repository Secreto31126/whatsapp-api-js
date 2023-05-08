import { ClientMessage, type ClientMessageNames } from "../types";

/**
 * Abstract class for all the media types
 *
 * @group Media
 */
export abstract class Media extends ClientMessage {
    /**
     * The id of the media
     */
    readonly id?: string;
    /**
     * The link of the media
     */
    readonly link?: string;

    /**
     * @override
     */
    abstract get _type(): ClientMessageNames;

    /**
     * @param file - File to be sent
     * @param isItAnID - If the file is an ID (true) or an URL (false)
     */
    constructor(file: string, isItAnID = false) {
        super();
        this[isItAnID ? "id" : "link"] = file;
    }
}

/**
 * Audio API component
 *
 * @group Media
 */
export class Audio extends Media {
    /**
     * @override
     */
    get _type(): "audio" {
        return "audio";
    }

    /**
     * Create an Audio object for the API
     *
     * @param audio - The audio file's link or id
     * @param isItAnID - Whether audio is an id (true) or a link (false)
     */
    constructor(audio: string, isItAnID = false) {
        super(audio, isItAnID);
    }
}

/**
 * Document API component
 *
 * @group Media
 */
export class Document extends Media {
    /**
     * The file's caption
     */
    readonly caption?: string;
    /**
     * The file's filename
     */
    readonly filename?: string;

    /**
     * @override
     */
    get _type(): "document" {
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
    constructor(
        document: string,
        isItAnID = false,
        caption?: string,
        filename?: string
    ) {
        super(document, isItAnID);
        if (caption) this.caption = caption;
        if (filename) this.filename = filename;
    }
}

/**
 * Image API component
 *
 * @group Media
 */
export class Image extends Media {
    /**
     * The file's caption
     */
    readonly caption?: string;

    /**
     * @override
     */
    get _type(): "image" {
        return "image";
    }

    /**
     * Create a Image object for the API
     *
     * @param image - The image file's link or id
     * @param isItAnID - Whether image is an id (true) or a link (false)
     * @param caption - Describes the specified image media
     */
    constructor(image: string, isItAnID = false, caption?: string) {
        super(image, isItAnID);
        if (caption) this.caption = caption;
    }
}

/**
 * Sticker API component
 *
 * @group Media
 */
export class Sticker extends Media {
    /**
     * @override
     */
    get _type(): "sticker" {
        return "sticker";
    }

    /**
     * Create a Sticker object for the API
     *
     * @param sticker - The sticker file's link
     * @param isItAnID - Whether sticker is an id (true) or a link (false)
     */
    constructor(sticker: string, isItAnID = false) {
        super(sticker, isItAnID);
    }
}

/**
 * Video API component
 *
 * @group Media
 */
export class Video extends Media {
    /**
     * The file's caption
     */
    readonly caption?: string;

    /**
     * @override
     */
    get _type(): "video" {
        return "video";
    }

    /**
     * Create a Video object for the API
     *
     * @param video - The video file's link
     * @param isItAnID - Whether video is an id (true) or a link (false)
     * @param caption - Describes the specified video media
     */
    constructor(video: string, isItAnID = false, caption?: string) {
        super(video, isItAnID);
        if (caption) this.caption = caption;
    }
}
