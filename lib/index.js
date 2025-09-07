import {
  ClientMessage
} from "./types.js";
import { escapeUnicode } from "./utils.js";
import { DEFAULT_API_VERSION } from "./types.js";
import {
  WhatsAppAPIMissingAppSecretError,
  WhatsAppAPIMissingCryptoSubtleError,
  WhatsAppAPIMissingRawBodyError,
  WhatsAppAPIMissingSignatureError,
  WhatsAppAPIMissingVerifyTokenError,
  WhatsAppAPIUnexpectedError,
  WhatsAppAPIFailedToVerifyError,
  WhatsAppAPIMissingSearchParamsError,
  WhatsAppAPIFailedToVerifyTokenError
} from "./errors.js";
class WhatsAppAPI {
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
   * If false, the API will be used in a less secure way, removing the need for appSecret. Defaults to true.
   */
  secure;
  /**
   * The callbacks for the events (message, sent, status, call)
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
  on = {
    call: {}
  };
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
   * @template EmittersReturnType - The return type of the emitters
   * ({@link OnMessage}, {@link OnStatus})
   *
   * @throws If fetch is not defined in the enviroment and the provided ponyfill isn't a function
   * @throws If secure is true, crypto.subtle is not defined in the enviroment and the provided ponyfill isn't an object
   */
  constructor({
    token,
    appSecret,
    webhookVerifyToken,
    v,
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
  }
  //#region Message Operations
  async sendMessage(phoneID, to, message, context, biz_opaque_callback_data) {
    const type = message._type;
    const request = {
      messaging_product: "whatsapp",
      type,
      to
    };
    request[type] = message;
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
    const response = await this.getBody(promise);
    const has_msg = "messages" in response;
    const args = {
      phoneID,
      to,
      type,
      message,
      request,
      id: has_msg ? response.messages[0].id : void 0,
      held_for_quality_assessment: has_msg ? "message_status" in response.messages[0] ? response.messages[0].message_status === "held_for_quality_assessment" : void 0 : void 0,
      response,
      offload: WhatsAppAPI.offload,
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
  async markAsRead(phoneID, messageId, indicator) {
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
          message_id: messageId,
          typing_indicator: indicator ? { type: indicator } : void 0
        })
      }
    );
    return this.getBody(promise);
  }
  //#endregion
  //#region Call Operations
  async initiateCall(phoneID, to, sdp, biz_opaque_callback_data) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${phoneID}/calls`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          action: "connect",
          biz_opaque_callback_data,
          session: {
            sdp_type: "offer",
            sdp
          }
        })
      }
    );
    return this.getBody(promise);
  }
  async preacceptCall(phoneID, callID, sdp) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${phoneID}/calls`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          call_id: callID,
          action: "pre_accept",
          session: {
            sdp_type: "offer",
            sdp
          }
        })
      }
    );
    return this.getBody(promise);
  }
  async rejectCall(phoneID, callID) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${phoneID}/calls`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          call_id: callID,
          action: "reject"
        })
      }
    );
    return this.getBody(promise);
  }
  async acceptCall(phoneID, callID, sdp, biz_opaque_callback_data) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${phoneID}/calls`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          call_id: callID,
          action: "accept",
          biz_opaque_callback_data,
          session: {
            sdp_type: "offer",
            sdp
          }
        })
      }
    );
    return this.getBody(promise);
  }
  async terminateCall(phoneID, callID) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${phoneID}/calls`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          call_id: callID,
          action: "terminate"
        })
      }
    );
    return this.getBody(promise);
  }
  //#endregion
  //#region QR Operations
  async createQR(phoneID, message, format = "png") {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls?generate_qr_image=${format}&prefilled_message=${message}`,
      {
        method: "POST"
      }
    );
    return this.getBody(promise);
  }
  async retrieveQR(phoneID, id) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id ?? ""}`
    );
    return this.getBody(promise);
  }
  async updateQR(phoneID, id, message) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${phoneID}/message_qrdls/${id}?prefilled_message=${message}`,
      {
        method: "POST"
      }
    );
    return this.getBody(promise);
  }
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
  async retrieveMedia(id, phoneID) {
    const params = phoneID ? `phone_number_id=${phoneID}` : "";
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${this.v}/${id}?${params}`
    );
    return this.getBody(promise);
  }
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
  fetchMedia(url) {
    return this.$$apiFetch$$(new URL(url), {
      headers: {
        // Thanks @tecoad
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
      }
    });
  }
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
  // #region Block Operations
  async blockUser(phoneID, ...users) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${phoneID}/block_users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          block_users: users.map((user) => ({ user }))
        })
      }
    );
    return this.getBody(promise);
  }
  async unblockUser(phoneID, ...users) {
    const promise = this.$$apiFetch$$(
      `https://graph.facebook.com/${phoneID}/block_users`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          block_users: users.map((user) => ({ user }))
        })
      }
    );
    return this.getBody(promise);
  }
  async post(data, raw_body, signature) {
    if (this.secure) {
      if (!raw_body) throw new WhatsAppAPIMissingRawBodyError();
      if (!signature) throw new WhatsAppAPIMissingSignatureError();
      if (!await this.verifyRequestSignature(raw_body, signature)) {
        throw new WhatsAppAPIFailedToVerifyError();
      }
    }
    if (!data.object) {
      throw new WhatsAppAPIUnexpectedError("Invalid payload", 400);
    }
    const { field, value } = data.entry[0].changes[0];
    const phoneID = value.metadata.phone_number_id;
    if (field === "messages") {
      if (field in value) {
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
          received: (i) => this.markAsRead(phoneID, message.id, i),
          block: () => this.blockUser(phoneID, from),
          offload: WhatsAppAPI.offload,
          Whatsapp: this
        };
        return this.on?.message?.(args);
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
          offload: WhatsAppAPI.offload,
          Whatsapp: this
        };
        return this.on?.status?.(args);
      }
    } else if (field === "calls") {
      if (field in value) {
        const call = value.calls[0];
        const contact = value.contacts?.[0];
        const from = contact?.wa_id ?? call.from;
        const name = contact?.profile.name;
        if (call.event === "connect") {
          const args = {
            phoneID,
            from,
            call,
            name,
            raw: data,
            preaccept: () => this.preacceptCall(
              phoneID,
              call.id,
              call.session.sdp
            ),
            accept: (biz_opaque_callback_data) => this.acceptCall(
              phoneID,
              call.id,
              call.session.sdp,
              biz_opaque_callback_data
            ),
            reject: () => this.rejectCall(phoneID, call.id),
            terminate: () => this.terminateCall(phoneID, call.id),
            offload: WhatsAppAPI.offload,
            Whatsapp: this
          };
          return this.on?.call?.connect?.(args);
        } else if (call.event === "terminate") {
          const args = {
            phoneID,
            from,
            call,
            name,
            raw: data,
            offload: WhatsAppAPI.offload,
            Whatsapp: this
          };
          return this.on?.call?.terminate?.(args);
        }
      } else if ("statuses" in value) {
        const statuses = value.statuses[0];
        const phone = statuses.recipient_id;
        const status = statuses.status;
        const id = statuses.id;
        const timestamp = statuses.timestamp;
        const biz_opaque_callback_data = statuses.biz_opaque_callback_data;
        const args = {
          phoneID,
          phone,
          status,
          id,
          timestamp,
          biz_opaque_callback_data,
          raw: data,
          offload: WhatsAppAPI.offload,
          Whatsapp: this
        };
        return this.on?.call?.status?.(args);
      }
    }
    throw new WhatsAppAPIUnexpectedError("Unexpected payload", 200);
  }
  get(params) {
    if (!this.webhookVerifyToken) {
      throw new WhatsAppAPIMissingVerifyTokenError();
    }
    const {
      "hub.mode": mode,
      "hub.verify_token": token,
      "hub.challenge": challenge
    } = params;
    if (!mode || !token) {
      throw new WhatsAppAPIMissingSearchParamsError();
    }
    if (mode === "subscribe" && token === this.webhookVerifyToken) {
      return challenge;
    }
    throw new WhatsAppAPIFailedToVerifyTokenError();
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
   * @throws Class {@link WhatsAppAPIMissingAppSecretError} if the appSecret isn't defined
   * @throws Class {@link WhatsAppAPIMissingCryptoSubtleError} if crypto.subtle or ponyfill isn't available
   */
  async verifyRequestSignature(raw_body, signature) {
    if (!this.appSecret) throw new WhatsAppAPIMissingAppSecretError();
    if (!this.subtle) throw new WhatsAppAPIMissingCryptoSubtleError();
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
    const result = await this.subtle.sign("HMAC", key, data);
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
    return (await promise).json();
  }
  /**
   * Offload a function to the next tick of the event loop
   *
   * @param f - The function to offload from the main thread
   */
  static offload(f) {
    Promise.resolve().then(f);
  }
}
export {
  WhatsAppAPI
};
//# sourceMappingURL=index.js.map
