/**
 * @module errors
 *
 * @description
 * This module contains the custom errors that are thrown by the
 * {@link WhatsAppAPI.get} and {@link WhatsAppAPI.post} methods.
 *
 * I did my best to explain why each error happens, include examples,
 * a few tips, and links to sources for further reading.
 *
 * This file is 300 lines of docs and the remaining is the actual code.
 * So yeah, enjoy reading :]
 */

// This import makes the docs' links work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { WhatsAppAPI } from "./index";

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
 * you can provide a ponyfill for it in the `ponyfill.subtle` option of the `WhatsAppAPI`
 * constructor.
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
 * Thrown when the Webhook Verify Token isn't provided in the constructor
 *
 * @description
 * The Webhook Verify Token is a custom secret key that is used to verify against the API
 * the server is indeed the one that is supposed to receive the incoming requests.
 *
 * Your server will receive a GET request with the `hub.verify_token` and `hub.challenge` parameters.
 * The verify token should be equal to the one you provided in the constructor.
 * Once validated, you should reply with the `hub.challenge` parameter.
 *
 * The verify token is manually generated while setting up the callback URL in the
 * Meta's app dashboard -\> WhatsApp -\> Configuration.
 *
 * @example
 * ```ts
 * new WhatsAppAPI({
 *     webhookVerifyToken: "your-verify-token",
 *     // other options
 * });
 * ```
 *
 * @see https://whatsappapijs.web.app/types/types.TheBasicConstructorArguments.html
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started/#verification-requests
 */
export class WhatsAppAPIMissingVerifyTokenError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor() {
        super("Missing verify token", 500);
    }

    /**
     * @override
     */
    get docs() {
        return this.url("WhatsAppAPIMissingVerifyTokenError");
    }
}

/**
 * Thrown when the search parameters are missing in the request
 *
 * @description
 * In order to validate your server against the API, you need to provide the request params.
 *
 * If you are NOT using a middleware, make sure you are passing the parameters correctly.
 * Otherwise, feel free to open an issue on {@link https://github.com/Secreto31126/whatsapp-api-js/issues | GitHub}.
 *
 * @see https://whatsappapijs.web.app/types/types.GetParams.html
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started/#verification-requests
 */
export class WhatsAppAPIMissingSearchParamsError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor() {
        super("Missing search params", 400);
    }

    /**
     * @override
     */
    get docs() {
        return this.url("WhatsAppAPIMissingSearchParamsError");
    }
}

/**
 * Thrown when the verification token doesn't match from the request
 *
 * @description
 * The verify_token in the request doesn't match the one provided on initialization.
 * Either they are hacking you, or your Webhook Verify Token is invalid.
 *
 * Make sure you provided the correct verify token on initialization.
 * It is manually generated while setting up the callback URL in the
 * Meta's app dashboard -\> WhatsApp -\> Configuration.
 *
 * @example
 * ```ts
 * new WhatsAppAPI({
 *     webhookVerifyToken: "your-verify-token",
 *     // other options
 * });
 * ```
 *
 * @description
 * It might also be possible you didn't provide the correct request params
 * for the verification token (hub.verify_token). If you are using a middleware and
 * this seems to be the case, consider opening an issue on
 * {@link https://github.com/Secreto31126/whatsapp-api-js/issues | GitHub}.
 *
 * @see https://whatsappapijs.web.app/classes/WhatsAppAPI.WhatsAppAPI.html#get
 * @see https://whatsappapijs.web.app/types/types.TheBasicConstructorArguments.html
 * @see https://whatsappapijs.web.app/types/types.GetParams.html
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started/#verification-requests
 */
export class WhatsAppAPIFailedToVerifyTokenError extends WhatsAppAPIError {
    /**
     * @internal
     */
    constructor() {
        super("Invalid token verification", 403);
    }

    /**
     * @override
     */
    get docs() {
        return this.url("WhatsAppAPIFailedToVerifyTokenError");
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
