import { ClientMessage } from "../types.js";

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
     * Whether the audio is a voice note
     */
    readonly voice?: boolean;

    /**
     * @override
     * @internal
     */
    get _type(): "audio" {
        return "audio";
    }

    /**
     * Create an Audio object for the API
     *
     * Setting voice to true adds transcriptions support, auto download,
     * and the "played" status is sent when heard by the recipient.
     * The file should be .ogg with OPUS codec for full voice note support.
     *
     * @example
     * ```ts
     * import { Audio } from "whatsapp-api-js/messages";
     *
     * const audio_message = new Audio("https://www.example.com/audio.mp3");
     *
     * const audio_id_message = new Audio("12345678", true);
     *
     * const voice_message = new Audio("https://www.example.com/audio.ogg", false, true);
     * ```
     *
     * @param audio - The audio file's link or id
     * @param isItAnID - Whether audio is an id (true) or a link (false)
     * @param voice - Whether the audio is a voice note
     */
    constructor(audio: string, isItAnID = false, voice?: boolean) {
        super(audio, isItAnID);
        if (voice) this.voice = voice;
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
     * @internal
     */
    get _type(): "document" {
        return "document";
    }

    /**
     * Create a Document object for the API
     *
     * @example
     * ```ts
     * import { Document } from "whatsapp-api-js/messages";
     *
     * const document_message = new Document("https://www.example.com/document.pdf");
     *
     * const document_id_message = new Document("12345678", true);
     *
     * const document_caption_message = new Document(
     *     "https://www.example.com/document.pdf",
     *     false,
     *     "Hello world!"
     * );
     *
     * const document_filename_message = new Document(
     *     "https://www.example.com/document.pdf",
     *     false,
     *     undefined,
     *     "a weird filename.pdf"
     * );
     * ```
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
     * @internal
     */
    get _type(): "image" {
        return "image";
    }

    /**
     * Create a Image object for the API
     *
     * @example
     * ```ts
     * import { Image } from "whatsapp-api-js/messages";
     *
     * const image_message = new Image("https://i.imgur.com/4QfKuz1.png");
     *
     * const image_id_message = new Image("12345678", true);
     *
     * const image_caption_message = new Image(
     *     "https://i.imgur.com/4QfKuz1.png",
     *     false,
     *     "Hello world!"
     * );
     * ```
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
     * @internal
     */
    get _type(): "sticker" {
        return "sticker";
    }

    /**
     * Create a Sticker object for the API
     *
     * @example
     * ```ts
     * import { Sticker } from "whatsapp-api-js/messages";
     *
     * const sticker_message = new Sticker("https://www.example.com/sticker.webp");
     *
     * const sticker_id_message = new Sticker("12345678", true);
     * ```
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
     * @internal
     */
    get _type(): "video" {
        return "video";
    }

    /**
     * Create a Video object for the API
     *
     * @example
     * ```ts
     * import { Video } from "whatsapp-api-js/messages";
     *
     * const video_message = new Video("https://www.example.com/video.mp4");
     *
     * const video_id_message = new Video("12345678", true);
     *
     * const video_caption_message = new Video(
     *     "https://www.example.com/video.mp4",
     *     false,
     *     "Hello world!"
     * );
     * ```
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
