import { ClientMessage } from "../types.js";
/**
 * Abstract class for all the media types
 *
 * @group Media
 */
export declare abstract class Media extends ClientMessage {
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
    constructor(file: string, isItAnID?: boolean);
}
/**
 * Audio API component
 *
 * @group Media
 */
export declare class Audio extends Media {
    /**
     * @override
     * @internal
     */
    get _type(): "audio";
    /**
     * Create an Audio object for the API
     *
     * @example
     * ```ts
     * import { Audio } from "whatsapp-api-js/messages";
     *
     * const audio_message = new Audio("https://www.example.com/audio.mp3");
     *
     * const audio_id_message = new Audio("12345678", true);
     * ```
     *
     * @param audio - The audio file's link or id
     * @param isItAnID - Whether audio is an id (true) or a link (false)
     */
    constructor(audio: string, isItAnID?: boolean);
}
/**
 * Document API component
 *
 * @group Media
 */
export declare class Document extends Media {
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
    get _type(): "document";
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
    constructor(document: string, isItAnID?: boolean, caption?: string, filename?: string);
}
/**
 * Image API component
 *
 * @group Media
 */
export declare class Image extends Media {
    /**
     * The file's caption
     */
    readonly caption?: string;
    /**
     * @override
     * @internal
     */
    get _type(): "image";
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
    constructor(image: string, isItAnID?: boolean, caption?: string);
}
/**
 * Sticker API component
 *
 * @group Media
 */
export declare class Sticker extends Media {
    /**
     * @override
     * @internal
     */
    get _type(): "sticker";
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
    constructor(sticker: string, isItAnID?: boolean);
}
/**
 * Video API component
 *
 * @group Media
 */
export declare class Video extends Media {
    /**
     * The file's caption
     */
    readonly caption?: string;
    /**
     * @override
     * @internal
     */
    get _type(): "video";
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
    constructor(video: string, isItAnID?: boolean, caption?: string);
}
//# sourceMappingURL=media.d.ts.map