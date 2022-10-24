export = Reaction;
/**
 * Reaction API object
 *
 * @property {String} message_id The message's id to react to
 * @property {String} emoji The reaction emoji
 * @property {String} [_] The type of the object, for internal use only
 */
declare class Reaction {
    /**
     * Create a Reaction object for the API
     *
     * @param {String} message_id The message's id (wamid) to react to
     * @param {String} emoji The emoji to react with, defaults to empty string to remove a reaction
     * @throws {Error} If message_id is not provided
     * @throws {Error} If a non-emoji or more than one emoji is provided
     */
    constructor(message_id: string, emoji?: string);
    message_id: string;
    emoji: string;
    _: string;
}
//# sourceMappingURL=reaction.d.ts.map