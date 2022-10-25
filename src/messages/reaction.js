/**
 * Reaction API object
 *
 * @property {String} message_id The message's id to react to
 * @property {String} emoji The reaction emoji
 * @property {String} [_] The type of the object, for internal use only
 */
class Reaction {
    /**
     * Create a Reaction object for the API
     *
     * @param {String} message_id The message's id (wamid) to react to
     * @param {String} emoji The emoji to react with, defaults to empty string to remove a reaction
     * @throws {Error} If message_id is not provided
     * @throws {Error} If a non-emoji or more than one emoji is provided
     */
    constructor(message_id, emoji = "") {
        if (!message_id) throw new Error("Reaction must have a message id");
        if (emoji && !/^\p{Extended_Pictographic}$/u.test(emoji))
            throw new Error("Reaction emoji must be a single emoji");

        this.message_id = message_id;
        this.emoji = emoji;
        this._ = "reaction";
    }
}

module.exports = Reaction;
