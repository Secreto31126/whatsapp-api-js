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
     * @param video - The video file's link
     * @param isItAnID - Whether video is an id (true) or a link (false)
     * @param caption - Describes the specified video media
     */
    constructor(video: string, isItAnID?: boolean, caption?: string);
}
//# sourceMappingURL=media.d.ts.map