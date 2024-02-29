import { ClientMessage } from "../types.js";
/**
 * Reaction API object
 *
 * @group Reaction
 */
export declare class Reaction extends ClientMessage {
    /**
     * The message's id to react to
     */
    readonly message_id: string;
    /**
     * The reaction emoji
     */
    readonly emoji: string;
    /**
     * @override
     * @internal
     */
    get _type(): "reaction";
    /**
     * Create a Reaction object for the API
     *
     * @param message_id - The message's id (wamid) to react to
     * @param emoji - The emoji to react with, defaults to empty string to remove a reaction
     * @throws If a non-emoji or more than one emoji is provided
     */
    constructor(message_id: string, emoji?: string);
}
//# sourceMappingURL=reaction.d.ts.map