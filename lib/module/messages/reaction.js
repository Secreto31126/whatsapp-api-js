/**
 * Reaction API object
 *
 * @group Reaction
 */
export default class Reaction {
    /**
     * The message's id to react to
     */
    message_id;
    /**
     * The reaction emoji
     */
    emoji;
    get _type() {
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
    constructor(message_id, emoji = "") {
        if (emoji && !/^\p{Extended_Pictographic}$/u.test(emoji))
            throw new Error("Reaction emoji must be a single emoji");
        this.message_id = message_id;
        this.emoji = emoji;
    }
    _build() {
        return JSON.stringify(this);
    }
}
//# sourceMappingURL=reaction.js.map