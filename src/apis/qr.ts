import type {
    ServerCreateQRResponse,
    ServerDeleteQRResponse,
    ServerRetrieveQRResponse,
    ServerUpdateQRResponse
} from "../types";

export interface API {
    /**
     * Generate a QR code for sharing the bot
     *
     * @param phoneID - The bot's phone ID
     * @param message - The quick message on the QR code
     * @param format - The format of the QR code, default is "png"
     * @returns The server response
     */
    createQR(
        phoneID: string,
        message: string,
        format: "png" | "svg"
    ): Promise<ServerCreateQRResponse>;

    /**
     * Get one or many QR codes of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to find. If not specified, all QRs will be returned
     * @returns The server response
     */
    retrieveQR(phoneID: string, id?: string): Promise<ServerRetrieveQRResponse>;

    /**
     * Update a QR code of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to edit
     * @param message - The new quick message for the QR code
     * @returns The server response
     */
    updateQR(
        phoneID: string,
        id: string,
        message: string
    ): Promise<ServerUpdateQRResponse>;

    /**
     * Delete a QR code of the bot
     *
     * @param phoneID - The bot's phone ID
     * @param id - The QR's id to delete
     * @returns The server response
     */
    deleteQR(phoneID: string, id: string): Promise<ServerDeleteQRResponse>;
}
