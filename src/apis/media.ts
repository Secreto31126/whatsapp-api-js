import type {
    ServerMediaDeleteResponse,
    ServerMediaRetrieveResponse,
    ServerMediaUploadResponse
} from "../types";

export interface API {
    /**
     * Get a Media object data with an ID
     *
     * @see {@link fetchMedia}
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     */
    retrieveMedia(
        id: string,
        phoneID?: string
    ): Promise<ServerMediaRetrieveResponse>;

    /**
     * Upload a Media to the API server
     *
     * @example
     * ```ts
     * // author ekoeryanto on issue #322
     * import { WhatsAppAPI } from "whatsapp-api-js";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     *
     * const Whatsapp = new WhatsAppAPI({ token, appSecret });
     *
     * const url = "https://example.com/image.png";
     *
     * const image = await fetch(url);
     * const blob = await image.blob();
     *
     * // If required:
     * // import FormData from "undici";
     *
     * const form = new FormData();
     * form.set("file", blob);
     *
     * console.log(await Whatsapp.uploadMedia("phoneID", form));
     * // Expected output: { id: "mediaID" }
     * ```
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     *
     * const Whatsapp = new WhatsAppAPI({ token, appSecret });
     *
     * // If required:
     * // import FormData from "undici";
     * // import { Blob } from "node:buffer";
     *
     * const form = new FormData();
     *
     * // If you don't mind reading the whole file into memory:
     * form.set("file", new Blob([fs.readFileSync("image.png")], "image/png"));
     *
     * // If you do, you will need to use streams. The module "form-data",
     * // although not spec compliant (hence needing to set check to false),
     * // has an easy way to do this:
     * // form.append("file", fs.createReadStream("image.png"), { contentType: "image/png" });
     *
     * console.log(await Whatsapp.uploadMedia("phoneID", form));
     * // Expected output: { id: "mediaID" }
     * ```
     *
     * @param phoneID - The bot's phone ID
     * @param form - The Media's FormData.
     * Must have a 'file' property with the file to upload as a blob and a valid mime-type in the 'type' field of the blob.
     * Example for Node ^18: `new FormData().set("file", new Blob([stringOrFileBuffer], "image/png"));`.
     * Previous versions of Node will need an external FormData, such as undici's.
     * To use non spec complaints versions of FormData (eg: form-data) or Blob set the 'check' parameter to false.
     * @param check - Wether the FormData should be checked before uploading.
     * The FormData must have the method .get("name") to work with the checks.
     * If it doesn't (for example, using the module "form-data"), set this to false.
     * Defaults to true.
     * @returns The server response
     * @throws If check is set to true and form is not a FormData
     * @throws If check is set to true and the form doesn't have valid required properties (file, type)
     * @throws If check is set to true and the form file is too big for the file type
     */
    uploadMedia(
        phoneID: string,
        form: unknown,
        check: boolean
    ): Promise<ServerMediaUploadResponse>;

    /**
     * Get a Media fetch from an url.
     * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
     *
     * @example
     * ```ts
     * import { WhatsAppAPI } from "whatsapp-api-js";
     *
     * const token = "token";
     * const appSecret = "appSecret";
     *
     * const Whatsapp = new WhatsAppAPI({ token, appSecret });
     *
     * const id = "mediaID";
     * const { url } = await Whatsapp.retrieveMedia(id);
     * const response = Whatsapp.fetchMedia(url);
     * ```
     *
     * @param url - The Media's url
     * @returns The fetch raw response
     * @throws If url is not a valid url
     */
    fetchMedia(url: string): Promise<Response>;

    /**
     * Delete a Media object with an ID
     *
     * @param id - The Media's ID
     * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
     * @returns The server response
     */
    deleteMedia(
        id: string,
        phoneID?: string
    ): Promise<ServerMediaDeleteResponse>;
}
