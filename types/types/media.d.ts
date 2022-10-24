/**
 * Placeholder class for all the media types
 *
 * @property {String} type The type of the media
 * @property {String} [id] The id of the media
 * @property {String} [link] The link of the media
 * @property {String} [_] The type of the object, for internal use only
 */
export class Media {
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
    constructor(type: string, file: string, isItAnID?: boolean);
    _: string;
}
/**
 * Audio API component
 *
 * @extends Media
 */
export class Audio extends Media {
    /**
     * Create an Audio object for the API
     *
     * @param {String} audio The audio file's link or id
     * @param {Boolean} isItAnID Whether audio is an id (true) or a link (false)
     */
    constructor(audio: string, isItAnID?: boolean);
}
/**
 * Document API component
 *
 * @extends Media
 * @property {String} [caption] The file's caption
 * @property {String} [filename] The file's filename
 */
export class Document extends Media {
    /**
     * Create a Document object for the API
     *
     * @param {String} document The document file's link or id
     * @param {Boolean} isItAnID Whether document is an id (true) or a link (false)
     * @param {String} [caption] Describes the specified document media
     * @param {String} [filename] Describes the filename for the specific document
     */
    constructor(document: string, isItAnID?: boolean, caption?: string, filename?: string);
    caption: string;
    filename: string;
}
/**
 * Image API component
 *
 * @extends Media
 * @property {String} [caption] The file's caption
 */
export class Image extends Media {
    /**
     * Create a Image object for the API
     *
     * @param {String} image The image file's link or id
     * @param {Boolean} isItAnID Whether image is an id (true) or a link (false)
     * @param {String} [caption] Describes the specified image media
     */
    constructor(image: string, isItAnID?: boolean, caption?: string);
    caption: string;
}
/**
 * Sticker API component
 *
 * @extends Media
 */
export class Sticker extends Media {
    /**
     * Create a Sticker object for the API
     *
     * @param {String} sticker The sticker file's link
     * @param {Boolean} isItAnID Whether sticker is an id (true) or a link (false)
     */
    constructor(sticker: string, isItAnID?: boolean);
}
/**
 * Video API component
 *
 * @extends Media
 * @property {String} [caption] The file's caption
 */
export class Video extends Media {
    /**
     * Create a Video object for the API
     *
     * @param {String} video The video file's link
     * @param {Boolean} isItAnID Whether video is an id (true) or a link (false)
     * @param {String} [caption] Describes the specified video media
     */
    constructor(video: string, isItAnID?: boolean, caption?: string);
    caption: string;
}
//# sourceMappingURL=media.d.ts.map