import type { ClientMessage, ClientTypingIndicators, ServerMarkAsReadResponse, ServerMessageResponse } from "../types";
export interface API {
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
    sendMessage(phoneID: string, to: string, message: ClientMessage, context?: string, biz_opaque_callback_data?: string): Promise<ServerMessageResponse>;
    /**
     * Send a Whatsapp message to multiple phone numbers.
     *
     * In order to avoid reaching the
     * [API rate limit](https://developers.facebook.com/docs/whatsapp/cloud-api/overview?locale=en_US#throughput),
     * this method will send the messages in batches of 50 per second by default,
     * but this can be changed using the `batch_size` and `delay` parameters.
     *
     * The API rate limit can be increased by contacting Facebook as explained
     * [here](https://developers.facebook.com/docs/whatsapp/cloud-api/overview?locale=en_US#throughput).
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
     * const phoneID = "YOUR_BOT_NUMBER";
     * const users = ["YOUR_USER1_NUMBER", "YOUR_USER2_NUMBER"];
     * const message = new Text("Hello World");
     *
     * const responses = Whatsapp.broadcastMessage(phoneID, users, message);
     *
     * Promise.all(responses).then(console.log);
     * ```
     *
     * @param phoneID - The bot's phone ID
     * @param to - The users' phone numbers
     * @param message - A Whatsapp message, built using the corresponding module for each type of message.
     * @param batch_size - The number of messages to send per batch
     * @param delay - The delay between each batch of messages in milliseconds
     * @returns The server's responses
     * @throws if batch_size is lower than 1
     * @throws if delay is lower than 0
     */
    broadcastMessage(phoneID: string, to: string[], message: ClientMessage, batch_size: number, delay: number): Array<ReturnType<API["sendMessage"]>>;
    /**
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
     * const phoneID = "YOUR_BOT_NUMBER";
     * const users = [{ user: "USER1_ID" }, { user: "USER2_ID" }];
     * const message_builder = ({ user }) => [DB.fetch(user).phone, new Text(`Hello ${user}`)];
     *
     * const responses = Whatsapp.broadcastMessage(phoneID, users, message);
     *
     * Promise.all(responses).then(console.log);
     * ```
     *
     * @typeParam T - The type of the data to be used in the message builder
     * @param phoneID - The bot's phone ID
     * @param to - The users' data
     * @param message_builder - A Whatsapp message builder, it returns an array with the phone number and the message.
     * @param batch_size - The number of messages to send per batch
     * @param delay - The delay between each batch of messages in milliseconds
     * @returns The server's responses
     * @throws if batch_size is lower than 1
     * @throws if delay is lower than 0
     */
    broadcastMessage<T>(phoneID: string, to: T[], message_builder: (data: T) => [string, ClientMessage], batch_size: number, delay: number): Array<ReturnType<API["sendMessage"]>>;
    /**
     * Mark a message as read, and optionally include a reply indicator
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/typing-indicators
     *
     * @param phoneID - The bot's phone ID
     * @param messageId - The message ID
     * @param indicator - The type of reply indicator
     * @returns The server response
     */
    markAsRead(phoneID: string, messageId: string, indicator?: ClientTypingIndicators): Promise<ServerMarkAsReadResponse>;
}
//# sourceMappingURL=message.d.ts.map