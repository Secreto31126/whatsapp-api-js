/**
 * Reaction API object
 */
export default class Reaction {
    /**
     * The message's id to react to
     */
    message_id: string;
    /**
     * The reaction emoji
     */
    emoji: string;

    /**
     * The type of the object
     * @internal
     */
    get _(): "reaction" {
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
        if (!message_id) throw new Error("Reaction must have a message id");
        if (emoji && !/^\p{Extended_Pictographic}$/u.test(emoji))
            throw new Error("Reaction emoji must be a single emoji");

        this.message_id = message_id;
        this.emoji = emoji;
    }
}
