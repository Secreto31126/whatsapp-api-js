import type {
    ServerAcceptCallResponse,
    ServerInitiateCallResponse,
    ServerPreacceptCallResponse,
    ServerRejectCallResponse,
    ServerTerminateCallResponse
} from "../types";

export interface API {
    /**
     * Initiate a call.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#initiate-call
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param to - The callee phone number
     * @param sdp - The SDP invitation string (RFC 8866)
     * @param biz_opaque_callback_data - An arbitrary 512B string, useful for tracking (length not checked by the framework)
     * @returns The server response
     */
    initiateCall(
        phoneID: string,
        to: string,
        sdp: string,
        biz_opaque_callback_data?: string
    ): Promise<ServerInitiateCallResponse>;

    /**
     * Pre-accept a call, before attempting to open the WebRTC connection.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param callID - The call ID
     * @param sdp - The SDP invitation string (RFC 8866)
     * @returns The server response
     */
    preacceptCall(
        phoneID: string,
        callID: `wacid.${string}`,
        sdp: string
    ): Promise<ServerPreacceptCallResponse>;

    /**
     * Reject a call, before attempting to open the WebRTC connection.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param callID - The call ID
     * @returns The server response
     */
    rejectCall(
        phoneID: string,
        callID: `wacid.${string}`
    ): Promise<ServerRejectCallResponse>;

    /**
     * Accept a call, after opening the WebRTC connection.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param callID - The call ID
     * @param sdp - The SDP invitation string (RFC 8866)
     * @param biz_opaque_callback_data - An arbitrary 512B string, useful for tracking (length not checked by the framework)
     * @returns The server response
     */
    acceptCall(
        phoneID: string,
        callID: `wacid.${string}`,
        sdp: string,
        biz_opaque_callback_data?: string
    ): Promise<ServerAcceptCallResponse>;

    /**
     * Terminate a call.
     *
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param callID - The call ID
     * @returns The server response
     */
    terminateCall(
        phoneID: string,
        callID: `wacid.${string}`
    ): Promise<ServerTerminateCallResponse>;
}
