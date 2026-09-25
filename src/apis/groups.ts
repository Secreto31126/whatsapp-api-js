import type {
    ClientGroupJoinApprovalMode,
    ClientIndividualRecipientIdentifier,
    ServerGroupField,
    ServerCreateGroupResponse,
    ServerRetrieveGroupsResponse,
    ServerRetrieveGroupResponse,
    ServerUpdateGroupResponse,
    ServerDeleteGroupResponse,
    ServerGroupInviteLinkResponse,
    ServerRemoveGroupParticipantsResponse,
    ServerRetrieveGroupJoinRequestsResponse,
    ServerApproveGroupJoinRequestsResponse,
    ServerRejectGroupJoinRequestsResponse
} from "../types.d.ts";
import type { AtLeastOne } from "../utils.d.ts";

export interface API {
    /**
     * Create a new group
     *
     * The group isn't ready when this resolves. Its id and invite link
     * arrive later on the group_lifecycle_update webhook.
     *
     * @remarks Only available for Official Business Accounts
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param subject - The group's name (128 characters max)
     * @param description - The group's description (2048 characters max)
     * @param joinApprovalMode - If users need to be approved before joining, defaults to "auto_approve"
     * @returns The server response
     */
    createGroup(
        phoneID: string,
        subject: string,
        description?: string,
        joinApprovalMode?: ClientGroupJoinApprovalMode
    ): Promise<ServerCreateGroupResponse>;

    /**
     * Get the active groups of the bot
     *
     * @beta
     * @param phoneID - The bot's phone ID
     * @param limit - How many groups to get, between 1 and 1024 (Meta defaults to 25)
     * @param after - Cursor to get the next page
     * @param before - Cursor to get the previous page
     * @returns The server response
     */
    retrieveGroups(
        phoneID: string,
        limit?: number,
        after?: string,
        before?: string
    ): Promise<ServerRetrieveGroupsResponse>;

    /**
     * Get the info of a group
     *
     * @beta
     * @param groupID - The group's ID
     * @param fields - The fields to get. If empty, only the group's id is returned
     * @returns The server response
     */
    retrieveGroup(
        groupID: string,
        fields?: ServerGroupField[]
    ): Promise<ServerRetrieveGroupResponse>;

    /**
     * Update the subject and/or description of a group
     *
     * @see {@link updateGroupPicture} to change the group's picture
     *
     * @beta
     * @param groupID - The group's ID
     * @param settings - The new subject (128 characters max) and/or description (2048 characters max)
     * @returns The server response
     */
    updateGroup(
        groupID: string,
        settings: { subject?: string; description?: string }
    ): Promise<ServerUpdateGroupResponse>;

    /**
     * Update the picture of a group
     *
     * @remarks
     * - The image must be a square JPEG of at least 192x192 pixels and up to 5MB
     * - The image scale and resolution isn't validated by the library
     *
     * @beta
     * @param groupID - The group's ID
     * @param form - The picture's FormData, with the image in the "file" field
     * @param check - If the FormData should be checked before uploading
     * @returns The server response
     * @throws If check is set to true and form is not a FormData
     * @throws If check is set to true and the form file is not a JPEG
     * @throws If check is set to true and the form file is too big
     */
    updateGroupPicture(
        groupID: string,
        form: unknown,
        check?: boolean
    ): Promise<ServerUpdateGroupResponse>;

    /**
     * Delete a group
     *
     * @beta
     * @param groupID - The group's ID
     * @returns The server response
     */
    deleteGroup(groupID: string): Promise<ServerDeleteGroupResponse>;

    /**
     * Get the invite link of a group
     *
     * @beta
     * @param groupID - The group's ID
     * @returns The server response
     */
    retrieveGroupInviteLink(
        groupID: string
    ): Promise<ServerGroupInviteLinkResponse>;

    /**
     * Create a new invite link for a group, the old one stops working
     *
     * @beta
     * @param groupID - The group's ID
     * @returns The server response
     */
    resetGroupInviteLink(
        groupID: string
    ): Promise<ServerGroupInviteLinkResponse>;

    /**
     * Remove participants from a group
     *
     * @remarks There's no way to add participants, users can only join via the invite link.
     *
     * @beta
     * @param groupID - The group's ID
     * @param users - The recipient identifiers (phone and/or bsuid) of the users to remove
     * @returns The server response
     * @throws If more than 8 users are provided
     */
    removeGroupParticipants(
        groupID: string,
        ...users: AtLeastOne<ClientIndividualRecipientIdentifier>
    ): Promise<ServerRemoveGroupParticipantsResponse>;

    /**
     * Get the pending join requests of a group
     *
     * @remarks Only useful if the group was created with "approval_required"
     *
     * @beta
     * @param groupID - The group's ID
     * @returns The server response
     */
    retrieveGroupJoinRequests(
        groupID: string
    ): Promise<ServerRetrieveGroupJoinRequestsResponse>;

    /**
     * Let users into a group
     *
     * @beta
     * @param groupID - The group's ID
     * @param requests - The join request IDs to approve
     * @returns The server response
     */
    approveGroupJoinRequests(
        groupID: string,
        ...requests: AtLeastOne<string>
    ): Promise<ServerApproveGroupJoinRequestsResponse>;

    /**
     * Reject users from joining a group
     *
     * @beta
     * @param groupID - The group's ID
     * @param requests - The join request IDs to reject
     * @returns The server response
     */
    rejectGroupJoinRequests(
        groupID: string,
        ...requests: AtLeastOne<string>
    ): Promise<ServerRejectGroupJoinRequestsResponse>;
}
