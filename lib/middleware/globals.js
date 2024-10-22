// src/types.ts
var DEFAULT_API_VERSION = "v20.0";
var ClientMessage = class {
  /**
   * The message built as a string. In most cases it's just JSON.stringify(this)
   *
   * @internal
   */
  _build() {
    return JSON.stringify(this);
  }
};

// src/utils.ts
function escapeUnicode(str) {
  return str.replace(/[^\0-~]/g, (ch) => {
    return "\\u" + ("000" + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}

// src/index.ts
var WhatsAppAPI = class _WhatsAppAPI {
  //#region Properties
  /**
   * The API token
   */
  token;
  /**
   * The app secret
   */
  appSecret;
  /**
   * The webhook verify token
   */
  webhookVerifyToken;
  /**
   * The API version to use
   */
  v;
  /**
   * The fetch function for the requests
   */
  fetch;
  /**
   * The CryptoSubtle library for checking the signatures
   */
  subtle;
  /**
   * If true, API operations will return the fetch promise instead. Intended for low level debugging.
   */
  parsed;
  /**
   * If false, the API will be used in a less secure way, removing the need for appSecret. Defaults to true.
   */
  secure;
  /**
   * The callbacks for the events (message, sent, status)
   *
   * @example
   * ```ts
   * const Whatsapp = new WhatsAppAPI({
   *     token: "my-token",
   *     appSecret: "my-app-secret"
   * });
   *
   * // Set the callback
   * Whatsapp.on.message = ({ from, phoneID }) => console.log(`Message from ${from} to bot ${phoneID}`);
   *
   * // If you need to disable the callback:
   * // Whatsapp.on.message = undefined;
   * ```
   */
  on = {};
  //#endregion
  /**
   * Main entry point for the API.
   *
   * It's highly recommended reading the named parameters docs at
   * {@link types.TheBasicConstructorArguments},
   * at least for `token`, `appSecret` and `webhookVerifyToken` properties,
   * which are the most common in normal usage.
   *
   * The other parameters are used for fine tunning the framework,
   * such as `ponyfill`, which allows the code to execute on platforms
   * that are missing standard APIs such as fetch and crypto.
   *
   * @example
   * ```ts
   * import { WhatsAppAPI } from "whatsapp-api-js";
   *
   * const Whatsapp = new WhatsAppAPI({
   *    token: "YOUR_TOKEN",
   *    appSecret: "YOUR_APP_SECRET"
   * });
   * ```
   *
   * @throws If fetch is not defined in the enviroment and the provided ponyfill isn't a function
   * @throws If secure is true, crypto.subtle is not defined in the enviroment and the provided ponyfill isn't an object
   */
  constructor({
    token,
    appSecret,
    webhookVerifyToken,
    v,
    parsed = true,
    secure = true,
    ponyfill = {}
  }) {
    this.token = token;
    this.secure = !!secure;
    if (this.secure) {
      this.appSecret = appSecret;
      if (typeof ponyfill.subtle !== "object" && (typeof crypto !== "object" || typeof crypto?.subtle !== "object")) {
        throw new Error(
          "subtle is not defined in the enviroment. Consider using a setup helper, defined at 'whatsapp-api-js/setup', or provide a valid ponyfill object with the argument 'ponyfill.subtle'."
        );
      }
      this.subtle = ponyfill.subtle || crypto.subtle;
    }
    if (webhookVerifyToken) this.webhookVerifyToken = webhookVerifyToken;
    if (typeof ponyfill.fetch !== "function" && typeof fetch !== "function") {
      throw new Error(
        "fetch is not defined in the enviroment. Consider using a setup helper, defined at 'whatsapp-api-js/setup', or provide a valid ponyfill object with the argument 'ponyfill.fetch'."
      );
    }
    this.fetch = ponyfill.fetch || fetch;
    if (v) this.v = v;
    else {
      console.warn(
        `[whatsapp-api-js] Cloud API version not defined. In production, it's strongly recommended pinning it to the desired version with the "v" argument. Defaulting to "${DEFAULT_API_VERSION}".`
      );
      this.v = DEFAULT_API_VERSION;
    }
    this.parsed = !!parsed;
  }
  //#region Message Operations
  /**
   * Send a Whatsapp message
   *
   * @example
   * ```ts
   * import { WhatsAppAPI } from "whatsapp-api-js";
   * import { Text } from "whatsapp-api-js/messages/text";
   *
   * const Whatsapp = new WhatsAppAPI({
   *     token: "YOUR_TOKEN",
   *     appSecret: "YOUR_APP_SECRET"
   * });
   *
   * Whatsapp.sendMessage(
   *     "BOT_PHONE_ID",
   *     "USER_PHONE",
   *     new Text("Hello World")
   * ).then(console.log);
   * ```
   *
   * @param phoneID - The bot's phone ID
   * @param to - The user's phone number
   * @param message - A Whatsapp message, built using the corresponding module for each type of message.
   * @param context - The message ID of the message to reply to
   * @param biz_opaque_callback_data - An arbitrary 512B string, useful for tracking (length not checked by the framework)
   * @returns The server response
   */
  async sendMessage(phoneID, to, message, context, biz_opaque_callback_data) {
    const type = message._type;
    const request = {
      messaging_product: "whatsapp",
      type,
      to
    };
    request[type] = // Prettier will probably kill me, but this comment has a purpose.
    // It prevents ts-ignore from ignoring more than intended.
    message._build();
    if (context) request.context = { message_id: context };
    if (biz_opaque_callback_data)
      request.biz_opaque_callback_data = biz_opaque_callback_data;
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      }
    );
    const response = this.parsed ? await (await promise).json() : void 0;
    const args = {
      phoneID,
      to,
      type,
      message,
      request,
      id: response ? "messages" in response ? response.messages[0].id : void 0 : void 0,
      held_for_quality_assessment: response ? "messages" in response ? "message_status" in response.messages[0] ? response.messages[0].message_status === "held_for_quality_assessment" : void 0 : void 0 : void 0,
      response,
      offload: _WhatsAppAPI.offload,
      Whatsapp: this
    };
    try {
      await this.on?.sent?.(args);
    } catch (error) {
      console.error(error);
    }
    return response ?? promise;
  }
  broadcastMessage(phoneID, to, message_builder, batch_size = 50, delay = 1e3) {
    const responses = [];
    if (batch_size < 1) {
      throw new RangeError("batch_size must be greater than 0");
    }
    if (delay < 0) {
      throw new RangeError("delay must be greater or equal to 0");
    }
    to.forEach((data, i) => {
      responses.push(
        new Promise((resolve) => {
          setTimeout(
            async () => {
              let phone;
              let message;
              if (message_builder instanceof ClientMessage) {
                phone = data;
                message = message_builder;
              } else {
                [phone, message] = await message_builder(
                  data
                );
              }
              this.sendMessage(phoneID, phone, message).then(
                resolve
              );
            },
            delay * (i / batch_size | 0)
          );
        })
      );
    });
    return responses;
  }
  /**
   * Mark a message as read
   *
   * @param phoneID - The bot's phone ID
   * @param messageId - The message ID
   * @returns The server response
   */
  async markAsRead(phoneID, messageId) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId
        })
      }
    );
    return this.getBody(promise);
  }
  //#endregion
  //#region QR Operations
  /**
   * Generate a QR code for sharing the bot
   *
   * @param phoneID - The bot's phone ID
   * @param message - The quick message on the QR code
   * @param format - The format of the QR code
   * @returns The server response
   */
  async createQR(phoneID, message, format = "png") {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls?generate_qr_image=${format}&prefilled_message=${message}`,
      {
        method: "POST"
      }
    );
    return this.getBody(promise);
  }
  /**
   * Get one or many QR codes of the bot
   *
   * @param phoneID - The bot's phone ID
   * @param id - The QR's id to find. If not specified, all QRs will be returned
   * @returns The server response
   */
  async retrieveQR(phoneID, id) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id ?? ""}`
    );
    return this.getBody(promise);
  }
  /**
   * Update a QR code of the bot
   *
   * @param phoneID - The bot's phone ID
   * @param id - The QR's id to edit
   * @param message - The new quick message for the QR code
   * @returns The server response
   */
  async updateQR(phoneID, id, message) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id}?prefilled_message=${message}`,
      {
        method: "POST"
      }
    );
    return this.getBody(promise);
  }
  /**
   * Delete a QR code of the bot
   *
   * @param phoneID - The bot's phone ID
   * @param id - The QR's id to delete
   * @returns The server response
   */
  async deleteQR(phoneID, id) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id}`,
      {
        method: "DELETE"
      }
    );
    return this.getBody(promise);
  }
  //#endregion
  //#region Media Operations
  /**
   * Get a Media object data with an ID
   *
   * @see {@link fetchMedia}
   *
   * @param id - The Media's ID
   * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
   * @returns The server response
   */
  async retrieveMedia(id, phoneID) {
    const params = phoneID ? `phone_number_id=${phoneID}` : "";
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${id}?${params}`
    );
    return this.getBody(promise);
  }
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
   * @param form - The Media's FormData. Must have a 'file' property with the file to upload as a blob and a valid mime-type in the 'type' field of the blob. Example for Node ^18: `new FormData().set("file", new Blob([stringOrFileBuffer], "image/png"));` Previous versions of Node will need an external FormData, such as undici's. To use non spec complaints versions of FormData (eg: form-data) or Blob set the 'check' parameter to false.
   * @param check - If the FormData should be checked before uploading. The FormData must have the method .get("name") to work with the checks. If it doesn't (for example, using the module "form-data"), set this to false.
   * @returns The server response
   * @throws If check is set to true and form is not a FormData
   * @throws If check is set to true and the form doesn't have valid required properties (file, type)
   * @throws If check is set to true and the form file is too big for the file type
   */
  async uploadMedia(phoneID, form, check = true) {
    if (check) {
      if (!form || typeof form !== "object" || !("get" in form) || typeof form.get !== "function")
        throw new TypeError(
          "File's Form must be an instance of FormData"
        );
      const file = form.get("file");
      if (!file.type)
        throw new Error("File's Blob must have a type specified");
      const validMediaTypes = [
        "audio/aac",
        "audio/mp4",
        "audio/mpeg",
        "audio/amr",
        "audio/ogg",
        "text/plain",
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/msword",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "video/mp4",
        "video/3gp",
        "image/webp"
      ];
      if (!validMediaTypes.includes(file.type))
        throw new Error(`Invalid media type: ${file.type}`);
      const validMediaSizes = {
        audio: 16e6,
        text: 1e8,
        application: 1e8,
        image: 5e6,
        video: 16e6,
        sticker: 5e5
      };
      const mediaType = file.type === "image/webp" ? "sticker" : file.type.split("/")[0];
      if (file.size && file.size > validMediaSizes[mediaType])
        throw new Error(
          `File is too big (${file.size} bytes) for a ${mediaType} (${validMediaSizes[mediaType]} bytes limit)`
        );
    }
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/media?messaging_product=whatsapp`,
      {
        method: "POST",
        body: form
      }
    );
    return this.getBody(promise);
  }
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
  fetchMedia(url) {
    return this.$$apiFetch$$(new URL(url), {
      headers: {
        // Thanks @tecoad
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
      }
    });
  }
  /**
   * Delete a Media object with an ID
   *
   * @param id - The Media's ID
   * @param phoneID - Business phone number ID. If included, the operation will only be processed if the ID matches the ID of the business phone number that the media was uploaded on.
   * @returns The server response
   */
  async deleteMedia(id, phoneID) {
    const params = phoneID ? `phone_number_id=${phoneID}` : "";
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${id}?${params}`,
      {
        method: "DELETE"
      }
    );
    return this.getBody(promise);
  }
  // #endregion
  // #region Webhooks
  /**
   * POST helper, must be called inside the post function of your code.
   * When setting up the webhook, only subscribe to messages. Other subscritions support might be added later.
   *
   * @example
   * ```ts
   * // author arivanbastos on issue #114
   * // Simple http example implementation with Whatsapp.post() on Node@^19
   * import { WhatsAppAPI } from "whatsapp-api-js";
   * import { NodeNext } from "whatsapp-api-js/setup/node";
   *
   * import { createServer } from "http";
   *
   * const token = "token";
   * const appSecret = "appSecret";
   * const Whatsapp = new WhatsAppAPI<number>(NodeNext({ token, appSecret }));
   *
   * function handler(req, res) {
   *     if (req.method == "POST") {
   *         const chunks = [];
   *         req.on("data", (chunk) => chunks.push(chunk));
   *
   *         req.on("end", async () => {
   *             const body = Buffer.concat(chunks).toString();
   *
   *             try {
   *                 const response = await Whatsapp.post(JSON.parse(body), body, req.headers["x-hub-signature-256"]);
   *                 res.writeHead(response);
   *             } catch (err) {
   *                 res.writeHead(err);
   *             }
   *
   *             res.end();
   *         });
   *     } else res.writeHead(501).end();
   * };
   *
   * Whatsapp.on.message = ({ phoneID, from, message, name, reply, offload }) => {
   *     console.log(`User ${name} (${from}) sent to bot ${phoneID} a(n) ${message.type}`);
   *     offload(() => reply(new Text("Hello!")));
   *     return 202;
   * };
   *
   * const server = createServer(handler);
   * server.listen(3000);
   * ```
   *
   * @param data - The POSTed data object sent by Whatsapp
   * @param raw_body - The raw body of the POST request
   * @param signature - The x-hub-signature-256 (all lowercase) header signature sent by Whatsapp
   * @returns The emitter's return value, undefined if the corresponding emitter isn't set
   * @throws 400 if secure and the raw body is missing
   * @throws 401 if secure and the signature is missing
   * @throws 500 if secure and the appSecret isn't defined
   * @throws 501 if secure and crypto.subtle or ponyfill isn't available
   * @throws 401 if secure and the signature doesn't match the hash
   * @throws 400 if the POSTed data is not a valid Whatsapp API request
   * @throws 500 if the user's callback throws an error
   * @throws 200, if the POSTed data is valid but not a message or status update (ignored)
   */
  async post(data, raw_body, signature) {
    if (this.secure) {
      if (!raw_body) throw 400;
      if (!signature) throw 401;
      if (!await this.verifyRequestSignature(raw_body, signature)) {
        throw 401;
      }
    }
    if (!data.object) throw 400;
    const value = data.entry[0].changes[0].value;
    const phoneID = value.metadata.phone_number_id;
    if ("messages" in value) {
      const message = value.messages[0];
      const contact = value.contacts?.[0];
      const from = contact?.wa_id ?? message.from;
      const name = contact?.profile.name;
      const args = {
        phoneID,
        from,
        message,
        name,
        raw: data,
        reply: (response, context = false, biz_opaque_callback_data) => this.sendMessage(
          phoneID,
          from,
          response,
          context ? message.id : void 0,
          biz_opaque_callback_data
        ),
        offload: _WhatsAppAPI.offload,
        Whatsapp: this
      };
      try {
        return await this.on?.message?.(args);
      } catch {
        throw 500;
      }
    } else if ("statuses" in value) {
      const statuses = value.statuses[0];
      const phone = statuses.recipient_id;
      const status = statuses.status;
      const id = statuses.id;
      const timestamp = statuses.timestamp;
      const conversation = statuses.conversation;
      const pricing = statuses.pricing;
      const error = statuses.errors?.[0];
      const biz_opaque_callback_data = statuses.biz_opaque_callback_data;
      const args = {
        phoneID,
        phone,
        status,
        id,
        timestamp,
        conversation,
        pricing,
        error,
        biz_opaque_callback_data,
        raw: data,
        offload: _WhatsAppAPI.offload,
        Whatsapp: this
      };
      try {
        return await this.on?.status?.(args);
      } catch {
        throw 500;
      }
    }
    throw 200;
  }
  /**
   * GET helper, must be called inside the get function of your code.
   * Used once at the first webhook setup.
   *
   * @example
   * ```ts
   * // Simple http example implementation with Whatsapp.get() on Node@^19
   * import { WhatsAppAPI } from "whatsapp-api-js";
   * import { NodeNext } from "whatsapp-api-js/setup/node";
   *
   * import { createServer } from "http";
   *
   * const token = "token";
   * const appSecret = "appSecret";
   * const Whatsapp = new WhatsAppAPI(NodeNext({ token, appSecret }));
   *
   * function handler(req, res) {
   *     if (req.method == "GET") {
   *         const params = new URLSearchParams(req.url.split("?")[1]);
   *
   *         const response = Whatsapp.get(Object.fromEntries(params));
   *
   *         res.writeHead(200, {"Content-Type": "text/html"});
   *         res.write(response)
   *         res.end();
   *     } else res.writeHead(501).end();
   * };
   *
   * const server = createServer(handler);
   * server.listen(3000);
   * ```
   *
   * @param params - The request object sent by Whatsapp
   * @returns The challenge string, it must be the http response body
   * @throws 500 if webhookVerifyToken is not specified
   * @throws 400 if the request is missing data
   * @throws 403 if the verification tokens don't match
   */
  get(params) {
    if (!this.webhookVerifyToken) throw 500;
    const {
      "hub.mode": mode,
      "hub.verify_token": token,
      "hub.challenge": challenge
    } = params;
    if (!mode || !token) {
      throw 400;
    }
    if (mode === "subscribe" && token === this.webhookVerifyToken) {
      return challenge;
    }
    throw 403;
  }
  // #endregion
  /**
   * Make an authenticated request to any url.
   * When using this method, be sure to pass a trusted url, since the request will be authenticated with the token.
   *
   * It's strongly recommended NOT using this method as you might risk exposing your API key accidentally,
   * but it's here in case you need a specific API operation which is not implemented by the library.
   *
   * @param url - The url to fetch
   * @param options - The fetch options (headers.Authorization is already included)
   * @returns The fetch response
   */
  async $$apiFetch$$(url, options = {}) {
    return this.fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...options.headers
      }
    });
  }
  /**
   * Verify the signature of a request
   *
   * @param raw_body - The raw body of the request
   * @param signature - The signature to validate
   * @returns If the signature is valid
   * @throws 500 if the appSecret isn't defined
   * @throws 501 if crypto.subtle or ponyfill isn't available
   */
  async verifyRequestSignature(raw_body, signature) {
    if (!this.appSecret) throw 500;
    if (!this.subtle) throw 501;
    signature = signature.split("sha256=")[1];
    if (!signature) return false;
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(this.appSecret);
    const key = await this.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "HMAC", hash: "SHA-256" },
      true,
      ["sign", "verify"]
    );
    const data = encoder.encode(escapeUnicode(raw_body));
    const result = await this.subtle.sign("HMAC", key, data.buffer);
    const result_array = Array.from(new Uint8Array(result));
    const check = result_array.map((b) => b.toString(16).padStart(2, "0")).join("");
    return signature === check;
  }
  /**
   * Get the body of a fetch response
   *
   * @internal
   * @param promise - The fetch response
   * @returns The json body parsed
   */
  async getBody(promise) {
    return this.parsed ? await (await promise).json() : promise;
  }
  /**
   * Offload a function to the next tick of the event loop
   *
   * @param f - The function to offload from the main thread
   */
  static offload(f) {
    Promise.resolve().then(f);
  }
};

// src/middleware/globals.ts
var WhatsAppAPIMiddleware = class extends WhatsAppAPI {
};
export {
  WhatsAppAPIMiddleware
};
