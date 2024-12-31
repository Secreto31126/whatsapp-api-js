/**
 * @module errors
 *
 * This module contains the custom errors that are thrown by the
 * {@link index.ts#WhatsAppAPI.get} and {@link index.ts#WhatsAppAPI.post} methods.
 */

/**
 * The library's base exception class.
 */
export abstract class WhatsAppAPIError extends Error {
    /**
     * The HTTP status code of the error
     */
    readonly httpStatus: number;

    /**
     * @internal
     */
    constructor(message: string, httpStatus: number) {
        super(message);
        this.name = "WhatsAppAPIError";
        this.httpStatus = httpStatus;
    }

    protected url(name: string) {
        return `https://whatsappapijs.web.app/classes/errors.${name}.html`;
    }

    /**
     * @returns The URL to the error's documentation
     */
    abstract get docs(): string;
}

/**
 * Thrown when the request body is missing
 *
 * @description
 * In order to validate the request, the raw body (original string) of the request is required to do the signature verification.
 *
 * If you are using a middleware, make sure you aren't consuming the request body before the API can access it.
 * Otherwise, feel free to open an issue on {@link https://github.com/Secreto31126/whatsapp-api-js/issues | GitHub}.
 *
 * @example
 * ```ts
 * await whatsapp.post(JSON.parse(req.body), req.body, req.headers.get("x-hub-signature-256"));
 * ```
 *
 * @see https://whatsappapijs.web.app/classes/WhatsAppAPI.WhatsAppAPI.html#post
 */
export class WhatsAppAPIMissingRawBodyError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor() {
        super("Missing raw body", 400);
    }

    /**
     * @override
     */
    get docs() {
        return this.url("WhatsAppAPIMissingRawBodyError");
    }
}

/**
 * Thrown when the request's signature is missing
 *
 * @description
 * In order to validate the request, the `x-hub-signature-256` header is required to do the signature verification.
 *
 * If you are NOT using a middleware, make sure you are passing the headers correctly (check case sensitivity).
 * Otherwise, feel free to open an issue on {@link https://github.com/Secreto31126/whatsapp-api-js/issues | GitHub}.
 *
 * @example
 * ```ts
 * await whatsapp.post(JSON.parse(req.body), req.body, req.headers.get("x-hub-signature-256"));
 * ```
 *
 * @see https://whatsappapijs.web.app/classes/WhatsAppAPI.WhatsAppAPI.html#post
 */
export class WhatsAppAPIMissingSignatureError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor() {
        super("Missing signature", 401);
    }

    /**
     * @override
     */
    get docs() {
        return this.url("WhatsAppAPIMissingSignatureError");
    }
}

/**
 * Thrown when the App Secret isn't provided in the constructor
 *
 * @description
 * The App Secret is a private key that is used to verify the authenticity of the incoming requests.
 * It can be found in your Meta's app dashboard, inside App Settings -\> Basic.
 *
 * @example
 * ```ts
 * new WhatsAppAPI({
 *     appSecret: "your-app-secret",
 *     // other options
 * });
 * ```
 *
 * @see https://whatsappapijs.web.app/types/types.TheBasicConstructorArguments.html
 */
export class WhatsAppAPIMissingAppSecretError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor() {
        super("Missing app secret", 500);
    }

    /**
     * @override
     */
    get docs() {
        return this.url("WhatsAppAPIMissingAppSecretError");
    }
}

/**
 * Thrown when the `crypto.subtle` API isn't available in the current environment
 *
 * @description
 * The `crypto.subtle` API is required to verify the signature of the incoming requests.
 * However, it isn't available in all environments. If your environment doesn't support it,
 * you can provide a ponyfill for it in the `crypto` option of the `WhatsAppAPI` constructor.
 *
 * @example
 * ```ts
 * new WhatsAppAPI({
 *     appSecret: "your-app-secret",
 *     ponyfill: {
 *         subtle: my_custom_crypto.subtle
 *     },
 *     // other options
 * });
 * ```
 *
 * @see https://whatsappapijs.web.app/types/types.TheBasicConstructorArguments.html
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto (specifically, `importKey` and `sign` methods)
 */
export class WhatsAppAPIMissingCryptoSubtleError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor() {
        super("Missing crypto subtle", 501);
    }

    /**
     * @override
     */
    get docs() {
        return this.url("WhatsAppAPIMissingCryptoSubtleError");
    }
}

/**
 * Thrown when the signature provided in the request's headers isn't valid
 *
 * @description
 * The signature provided in the request's headers isn't valid.
 * Either they are hacking you, or your App Secret is invalid.
 *
 * Make sure you provided the correct app secret on initialization.
 * It can be found in your Meta's app dashboard, inside App Settings -\> Basic.
 *
 * @example
 * ```ts
 * new WhatsAppAPI({
 *     appSecret: "your-app-secret",
 *     // other options
 * });
 * ```
 *
 * @description
 * It might also be possible you didn't provide the correct request header
 * for the signature (x-hub-signature-256). If you are using a middleware and
 * this seems to be the case, consider opening an issue on
 * {@link https://github.com/Secreto31126/whatsapp-api-js/issues | GitHub}.
 *
 * ⚠ If you are just testing the API, you can disable the signature verification
 * by setting the `secure` option to `false` on the `WhatsAppAPI` constructor.
 * Obviously, this is not recommended for production.
 *
 * @example
 * ```ts
 * new WhatsAppAPI({
 *     // appSecret: "Not required",
 *     secure: false,
 *     // other options
 * });
 * ```
 *
 * @see https://whatsappapijs.web.app/classes/WhatsAppAPI.WhatsAppAPI.html#post
 * @see https://whatsappapijs.web.app/types/types.TheBasicConstructorArguments.html
 * @see https://developer.mozilla.org/docs/Web/HTTP/Headers
 */
export class WhatsAppAPIFailedToVerifyError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor() {
        super("Signature doesn't match", 401);
    }

    /**
     * @override
     */
    get docs() {
        return this.url("WhatsAppAPIFailedToVerifyError");
    }
}

/**
 * Thrown in unusual cases, such as on empty or unknown payloads from the API side.
 *
 * It 100% should never happen, and if it does, feel free to open an issue on
 * {@link https://github.com/Secreto31126/whatsapp-api-js/issues | GitHub} so we can
 * investigate these impossibles scenarios.
 */
export class WhatsAppAPIUnexpectedError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor(message: string, httpStatus: number) {
        super(message + " ¯\\_(ツ)_/¯", httpStatus);
    }

    get docs() {
        return this.url("WhatsAppAPIUnexpectedError");
    }
}
