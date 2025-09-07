import type { ServerBlockResponse, ServerUnblockResponse } from "../types";

export interface API {
    /**
     * Block a user from sending messages to the bot
     *
     * The block API has 2 restrictions:
     *  - You can only block users that have messaged your business in the last 24 hours
     *  - You can only block up to 64k users
     *
     * @param phoneID - The bot's phone ID from which to block
     * @param users - The user phone numbers to block (the API doesn't fail if it's empty)
     * @returns The server response
     */
    blockUser(
        phoneID: string,
        ...users: string[]
    ): Promise<ServerBlockResponse>;

    /**
     * Unblock a user from the bot's block list
     *
     * @remarks Contrary to blocking, unblocking isn't restricted by the 24 hours rule
     *
     * @param phoneID - The bot's phone ID from which to unblock
     * @param users - The user phone numbers to unblock (the API doesn't fail if it's empty)
     * @returns The server response
     */
    unblockUser(
        phoneID: string,
        ...users: string[]
    ): Promise<ServerUnblockResponse>;
}
