import type { ClientIndividualRecipientIdentifier, ServerBlockResponse, ServerUnblockResponse } from "../types";
export interface API {
    /**
     * Block a user from sending messages to the bot
     *
     * The block API has 2 restrictions:
     *  - You can only block users that have messaged your business in the last 24 hours
     *  - You can only block up to 64k users
     *
     * @deprecated Prefer using the new signature with recipient identifier
     *
     * @param phoneID - The bot's phone ID from which to block
     * @param users - The user phone numbers to block (the API doesn't fail if it's empty)
     * @returns The server response
     */
    blockUser(phoneID: string, ...users: string[]): Promise<ServerBlockResponse>;
    /**
     * Block a user from sending messages to the bot
     *
     * The block API has 2 restrictions:
     *  - You can only block users that have messaged your business in the last 24 hours
     *  - You can only block up to 64k users
     *
     * @remarks If an identifier is missing both phone and bsuid,
     * the call will still be executed and an API exception will happen
     *
     * @param phoneID - The bot's phone ID from which to block
     * @param users - The user identifiers to block (the API doesn't fail if it's empty)
     * @returns The server response
     */
    blockUser(phoneID: string, ...users: ClientIndividualRecipientIdentifier[]): Promise<ServerBlockResponse>;
    /**
     * Unblock a user from the bot's block list
     *
     * @remarks Contrary to blocking, unblocking isn't restricted by the 24 hours rule
     *
     * @deprecated Prefer using the new signature with recipient identifier
     *
     * @param phoneID - The bot's phone ID from which to unblock
     * @param users - The user phone numbers to unblock (the API doesn't fail if it's empty)
     * @returns The server response
     */
    unblockUser(phoneID: string, ...users: string[]): Promise<ServerUnblockResponse>;
    /**
     * Unblock a user from the bot's block list
     *
     * @remarks
     * - Contrary to blocking, unblocking isn't restricted by the 24 hours rule
     * - If an identifier is missing both phone and bsuid,
     * the call will still be executed and an API exception will happen
     *
     * @param phoneID - The bot's phone ID from which to unblock
     * @param users - The user identifiers to unblock (the API doesn't fail if it's empty)
     * @returns The server response
     */
    unblockUser(phoneID: string, ...users: ClientIndividualRecipientIdentifier[]): Promise<ServerUnblockResponse>;
}
//# sourceMappingURL=block.d.ts.map