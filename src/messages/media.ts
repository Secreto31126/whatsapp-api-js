/**
 * Placeholder class for all the media types
 */
export class Media {
    /**
     * The id of the media
     */
    id?: string;
    /**
     * The link of the media
     */
    link?: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "audio" | "document" | "image" | "sticker" | "video";

    /**
     * This method works as a placeholder so the documentation looks nice.
     * You shouldn't be using it directly ¯\\_(ツ)_/¯.
     *
     * @param type - Type of the parameter
     * @param file - File to be sent
     * @param isItAnID - If the file is an ID (true) or an URL (false)
     * @throws If type is not provided
     * @throws If file is not provided
     */
    constructor(
        type: "audio" | "document" | "image" | "sticker" | "video",
        file: string,
        isItAnID = false
    ) {
        if (!type) throw new Error("Media must have a type");
        if (!file) throw new Error("Media must have a file");

        this[isItAnID ? "id" : "link"] = file;
        this._ = type;
    }
}

/**
 * Audio API component
 */
export class Audio extends Media {
    /**
     * The type of the object, for internal use only
     * @internal
     */
    declare _?: "audio";

    /**
     * Create an Audio object for the API
     *
     * @param audio - The audio file's link or id
     * @param isItAnID - Whether audio is an id (true) or a link (false)
     */
    constructor(audio: string, isItAnID = false) {
        if (!audio) throw new Error("Audio must have an audio link or id");
        super("audio", audio, isItAnID);
    }
}

/**
 * Document API component
 */
export class Document extends Media {
    /**
     * The file's caption
     */
    caption?: string;
    /**
     * The file's filename
     */
    filename?: string;
    /**
     * The type of the object
     * @internal
     */
    declare _?: "document";

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
        if (!document)
            throw new Error("Document must have a document link or id");
        super("document", document, isItAnID);
        if (caption) this.caption = caption;
        if (filename) this.filename = filename;
    }
}

/**
 * Image API component
 */
export class Image extends Media {
    /**
     * The file's caption
     */
    caption?: string;
    /**
     * The type of the object
     * @internal
     */
    declare _?: "image";

    /**
     * Create a Image object for the API
     *
     * @param image - The image file's link or id
     * @param isItAnID - Whether image is an id (true) or a link (false)
     * @param caption - Describes the specified image media
     */
    constructor(image: string, isItAnID = false, caption?: string) {
        if (!image) throw new Error("Image must have an image link or id");
        super("image", image, isItAnID);
        if (caption) this.caption = caption;
    }
}

/**
 * Sticker API component
 */
export class Sticker extends Media {
    /**
     * The type of the object
     * @internal
     */
    declare _?: "sticker";

    /**
     * Create a Sticker object for the API
     *
     * @param sticker - The sticker file's link
     * @param isItAnID - Whether sticker is an id (true) or a link (false)
     */
    constructor(sticker: string, isItAnID = false) {
        if (!sticker) throw new Error("Sticker must have a sticker link or id");
        super("sticker", sticker, isItAnID);
    }
}

/**
 * Video API component
 */
export class Video extends Media {
    /**
     * The file's caption
     */
    caption?: string;
    /**
     * The type of the object
     * @internal
     */
    declare _?: "video";

    /**
     * Create a Video object for the API
     *
     * @param video - The video file's link
     * @param isItAnID - Whether video is an id (true) or a link (false)
     * @param caption - Describes the specified video media
     */
    constructor(video: string, isItAnID = false, caption: string) {
        if (!video) throw new Error("Video must have a video link or id");
        super("video", video, isItAnID);
        if (caption) this.caption = caption;
    }
}
