import { WhatsAppAPI } from "../index.js";
class WhatsAppAPIMiddleware extends WhatsAppAPI {
  /**
   * The max payload size received from the client.
   * If the message is longer than the limit, the API
   * will throw 413 to prevent a DoS attack.
   *
   * It's strongly advised not to increase this value
   * over 3mb, as it's the upper limit from the API, but
   * if you really have to, just edit this variable.
   *
   * Thanks @EQSTLab for the report!
   *
   * @see https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview#payload-size
   */
  static _MAX_PAYLOAD_SIZE = 3 * 1024 * 1024;
}
export {
  WhatsAppAPIMiddleware
};
//# sourceMappingURL=globals.js.map
