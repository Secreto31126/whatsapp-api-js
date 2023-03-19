import type { ClientMessage } from "../types.js";

/**
 * Reaction API object
 *
 * @group Reaction
 */
export default class Reaction implements ClientMessage {
    /**
     * The message's id to react to
     */
    readonly message_id: string;
    /**
     * The reaction emoji
     */
    readonly emoji: string;

    get _type(): "reaction" {
        return "reaction";
    }

    /**
     * Create a Reaction object for the API
     *
     * @param message_id - The message's id (wamid) to react to
     * @param emoji - The emoji to react with, defaults to empty string to remove a reaction
     * @throws If message_id is not provided
     * @throws If a non-emoji or more than one emoji is provided
     */
    constructor(message_id: string, emoji = "") {
        if (emoji && !/^\p{Extended_Pictographic}$/u.test(emoji))
            throw new Error("Reaction emoji must be a single emoji");

        this.message_id = message_id;
        this.emoji = emoji;
    }

    _build() {
        return JSON.stringify(this);
    }
}
