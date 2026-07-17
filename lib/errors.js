class WhatsAppAPIError extends Error {
  /**
   * The HTTP status code of the error
   */
  httpStatus;
  /**
   * @internal
   */
  constructor(message, httpStatus) {
    super(message);
    this.name = "WhatsAppAPIError";
    this.httpStatus = httpStatus;
  }
  url(name) {
    return `https://whatsappapijs.web.app/classes/errors.${name}.html`;
  }
}
class WhatsAppAPIMissingRawBodyError extends WhatsAppAPIError {
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
class WhatsAppAPIMissingSignatureError extends WhatsAppAPIError {
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
class WhatsAppAPIMissingAppSecretError extends WhatsAppAPIError {
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
class WhatsAppAPIMissingCryptoSubtleError extends WhatsAppAPIError {
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
class WhatsAppAPIFailedToVerifyError extends WhatsAppAPIError {
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
class WhatsAppAPIMissingVerifyTokenError extends WhatsAppAPIError {
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
class WhatsAppAPIMissingSearchParamsError extends WhatsAppAPIError {
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
class WhatsAppAPIFailedToVerifyTokenError extends WhatsAppAPIError {
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
class WhatsAppAPIUnexpectedError extends WhatsAppAPIError {
  /**
   * @internal
   */
  constructor(message, httpStatus) {
    super(message + " \xAF\\_(\u30C4)_/\xAF", httpStatus);
  }
  get docs() {
    return this.url("WhatsAppAPIUnexpectedError");
  }
}
export {
  WhatsAppAPIError,
  WhatsAppAPIFailedToVerifyError,
  WhatsAppAPIFailedToVerifyTokenError,
  WhatsAppAPIMissingAppSecretError,
  WhatsAppAPIMissingCryptoSubtleError,
  WhatsAppAPIMissingRawBodyError,
  WhatsAppAPIMissingSearchParamsError,
  WhatsAppAPIMissingSignatureError,
  WhatsAppAPIMissingVerifyTokenError,
  WhatsAppAPIUnexpectedError
};
//# sourceMappingURL=errors.js.map
