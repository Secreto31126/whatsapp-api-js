/**
 * @module types
 *
 * @description
 * The types of the library. Mostly for internal use,
 * but if you want to "understand" the code under the hood,
 * feel free to read the docs :)
 */

import type {
    Text,
    Audio,
    Document,
    Image,
    Sticker,
    Video,
    Location,
    Interactive,
    Template,
    Reaction,
    Contacts
} from "./messages/index.d.ts";
import type { AtLeastOne } from "./utils.d.ts";

export const DEFAULT_API_VERSION = "v23.0";

/**
 * The main constructor arguments for the API
 */
export type TheBasicConstructorArguments = {
    /**
     * The API token, given at setup.
     * You must provide an API token to use the framework.
     *
     * It can either be a temporal or permanent one.
     *
     * In order to create a permanent token, first make sure you have
     * linked your WhatsApp account to a Meta Commercial Account in
     * [Meta for Developers Dashboard](https://developers.facebook.com/apps).
     *
     * After that, head to [Bussiness Settings](https://business.facebook.com/settings/system-users),
     * select your app, create a new system user with `admin role`.
     * Then click "Add Actives", select Apps -\> Your App -\> App Administrator.
     *
     * And this was the point were Meta decided I was too sus because
     * I created a second bussiness to follow my own tutorial,
     * and as I didn't want to give them my ID, they banned my account.
     *
     * If you read until here, you probably will figure it out.
     * It's not that hard after getting in the right place.
     *
     * Really wish WhatsApp gets away from Meta soon...
     *
     * (Sorry for the rant, here's the [actual documentation](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started) :)
     */
    token: string;
    /**
     * The app secret, given at setup.
     *
     * The secret is used as a signature to validate payload's authenticity.
     *
     * To get your app secret, head to
     * [Meta for Developers Dashboard](https://developers.facebook.com/apps),
     * select your app and open Settings -\> Basic -\> App Secret -\> Show.
     *
     * If you want to skip the verification and remove the need to provide the secret,
     * set `secure` to `false`.
     */
    appSecret?: string | never;
    /**
     * The webhook verify token, configured at setup.
     * Used exclusively to verify the server against WhatsApp's servers via the GET method.
     *
     * Not required by default, but calling this.get() without it will result in an error.
     */
    webhookVerifyToken?: string;
    /**
     * The version of the API, defaults to {@link DEFAULT_API_VERSION}.
     */
    v?: string;
    /**
     * If set to false, none of the API checks will be performed, and it will be used in a less secure way.
     *
     * Defaults to true.
     */
    secure?: boolean;
    /**
     * The ponyfills to use.
     *
     * This are meant to provide standard APIs implementations
     * on enviroments that don't have them.
     *
     * For example, if using Node 16, you will need to ponyfill
     * the fetch method with any spec complient fetch method.
     *
     * @remarks
     * With the additions of {@link setup} for the most common enviroments,
     * this parameter should no longer be configured manually.
     *
     * @example
     * ```ts
     * import { fetch } from "undici";
     * import { subtle } from "node:crypto";
     *
     * const api = new WhatsAppAPI({
     *     token: "my-token",
     *     appSecret: "my-app-secret",
     *     ponyfill: {
     *         fetch,
     *         subtle
     *     }
     * });
     * ```
     */
    ponyfill?: {
        /**
         * The fetch ponyfill to use for the requests. If not specified, it defaults to the fetch function from the enviroment.
         */
        fetch?: typeof fetch;
        /**
         * The subtle ponyfill to use for the signatures. If not specified, it defaults to crypto.subtle from the enviroment.
         */
        subtle?: Pick<typeof crypto.subtle, "importKey" | "verify">;
    };
};

/**
 * This switch allows TypeScript to cry if appSecret is not provided when secure is true.
 */
export type SecureLightSwitch =
    | {
          secure?: true;
          appSecret: string;
      }
    | {
          secure: false;
          appSecret?: never;
      };

/**
 * Created this type if in the future the constructor needs more complex types.
 */
export type ExtraTypesThatMakeTypescriptWork = SecureLightSwitch;

/**
 * Monkey patching TypeDoc inability to handle complex types.
 *
 * You should absolutely read {@link TheBasicConstructorArguments} in order to use the framework.
 */
export type WhatsAppAPIConstructorArguments = TheBasicConstructorArguments &
    ExtraTypesThatMakeTypescriptWork;

/**
 * The base class of all the library messages
 *
 * Polymorphism is cool :]
 */
export abstract class ClientMessage {
    /**
     * The message type
     *
     * @internal
     */
    abstract get _type(): ClientMessageNames;
}

export interface ClientTypedMessageComponent {
    /**
     * The message's component type
     *
     * @internal
     */
    get _type(): string;
}

export interface ClientBuildableMessageComponent {
    /**
     * The message's component builder method
     *
     * @internal
     */
    _build(..._: unknown[]): unknown;
}

export abstract class ClientLimitedMessageComponent<T, N extends number> {
    /**
     * Throws an error if the array length is greater than the specified number.
     *
     * @param p - The parent component name
     * @param c - The component name
     * @param a - The array to check the length of
     * @param n - The maximum length
     * @throws `${p} can't have more than ${n} ${c}`
     */
    constructor(p: string, c: string, a: Array<T>, n: N) {
        if (a.length > n) {
            throw new Error(`${p} can't have more than ${n} ${c}`);
        }
    }
}

/**
 * All sections are structured the same way, so this abstract class is used to reduce code duplication
 *
 * @remarks
 * - All sections must have between 1 and N elements
 * - All sections must have a title if more than 1 section is provided
 *
 * @typeParam T - The type of the components of the section
 * @typeParam N - The maximum number of elements in the section
 */
export abstract class Section<
    T,
    N extends number
> extends ClientLimitedMessageComponent<T, N> {
    /**
     * The title of the section
     */
    readonly title?: string;

    /**
     * Builds a section component
     *
     * @param name - The name of the section's type
     * @param keys_name - The name of the section's keys
     * @param elements - The elements of the section
     * @param max - The maximum number of elements in the section
     * @param title - The title of the section
     * @param title_length - The maximum length of the title
     * @throws If more than N elements are provided
     * @throws If title is over 24 characters if provided
     */
    constructor(
        name: string,
        keys_name: string,
        elements: AtLeastOne<T>,
        max: N,
        title?: string,
        title_length = 24
    ) {
        super(name, keys_name, elements, max);

        if (title) {
            if (title.length > title_length) {
                throw new Error(
                    `${name} title must be ${title_length} characters or less`
                );
            }

            this.title = title;
        }
    }
}

// Somehow, Contacts still manages to be annoying
export abstract class ContactComponent
    implements ClientTypedMessageComponent, ClientBuildableMessageComponent
{
    /**
     * @override
     * @internal
     */
    _build(): unknown {
        return this;
    }

    /**
     * Whether the component can be repeated multiple times in a contact.
     *
     * @internal
     */
    abstract get _many(): boolean;
    /**
     * @override
     * @internal
     */
    abstract get _type(): string;
}

/**
 * A contact multiple component can be repeated multiple times in a contact.
 */
export abstract class ContactMultipleComponent extends ContactComponent {
    /**
     * @override
     * @internal
     */
    get _many(): true {
        return true;
    }

    /**
     * @override
     * @internal
     */
    abstract get _type(): string;
}

/**
 * A contact unique component can only be used once in a contact.
 */
export abstract class ContactUniqueComponent extends ContactComponent {
    /**
     * @override
     * @internal
     */
    get _many(): false {
        return false;
    }

    /**
     * @override
     * @internal
     */
    abstract get _type(): string;
}

/**
 * Polymorphism intensifies. Also helps with the _type typings :)
 */
export interface InteractiveAction extends ClientTypedMessageComponent {
    /**
     * @overload
     * @internal
     */
    get _type():
        | "list"
        | "button"
        | "catalog_message"
        | "product"
        | "product_list"
        | "cta_url"
        | "flow"
        | "location_request_message"
        | "call_permission_request";
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TemplateComponent extends ClientBuildableMessageComponent {}

export class TemplateNamedParameter {
    /**
     * The name of the parameter, optional if using number variables
     */
    readonly parameter_name?: string;

    /**
     * @param parameter_name - The name of the parameter
     * @throws If parameter_name is over 20 characters or contains characters other than lowercase a-z and _
     */
    constructor(parameter_name?: string) {
        if (!parameter_name) return;

        if (!/^[a-z_]{1,20}$/.test(parameter_name))
            throw new Error(
                "parameter_name can't be over 20 characters long and must contain only lowercase a-z and _"
            );

        this.parameter_name = parameter_name;
    }
}

export type ClientMessageNames =
    | "text"
    | "audio"
    | "document"
    | "image"
    | "sticker"
    | "video"
    | "location"
    | "contacts"
    | "interactive"
    | "template"
    | "reaction";

export type ClientTypingIndicators = "text";

// #region Client Message Request

export type ClientMessageRequest = {
    /**
     * The messaging product
     */
    messaging_product: "whatsapp";
    /**
     * The user's phone number
     */
    to: string;
    /**
     * Currently you can only send messages to individuals
     */
    recipient_type: "individual";
    /**
     * The message to reply to
     */
    context?: {
        /**
         * The message id to reply to
         */
        message_id: string;
    };
    /**
     * An arbitrary 512B string, useful for tracking.
     *
     * Any app subscribed to the messages webhook field on the WhatsApp Business Account can get this string,
     * as it is included in statuses object within webhook payloads.
     *
     * Cloud API does not process this field, it just returns it as part of sent/delivered/read message webhooks.
     */
    biz_opaque_callback_data?: string;
} & {
    [Type in ClientMessageNames]?: ClientMessage;
} & (
        | {
              type: "text";
              text: Text;
          }
        | {
              type: "audio";
              audio: Audio;
          }
        | {
              type: "document";
              document: Document;
          }
        | {
              type: "image";
              image: Image;
          }
        | {
              type: "sticker";
              sticker: Sticker;
          }
        | {
              type: "video";
              video: Video;
          }
        | {
              type: "location";
              location: Location;
          }
        | {
              type: "contacts";
              contacts: Contacts;
          }
        | {
              type: "interactive";
              interactive: Interactive;
          }
        | {
              type: "template";
              template: Template;
          }
        | {
              type: "reaction";
              reaction: Reaction;
          }
    );

// #endregion

export type ServerTextMessage = {
    type: "text";
    text: {
        body: string;
    };
};

export type ServerAudioMessage = {
    type: "audio";
    audio: {
        mime_type: string;
        sha256: string;
        id: string;
    };
};

export type ServerDocumentMessage = {
    type: "document";
    document: {
        caption?: string;
        filename: string;
        mime_type: string;
        sha256: string;
        id: string;
    };
};

export type ServerImageMessage = {
    type: "image";
    image: {
        caption?: string;
        mime_type: string;
        sha256: string;
        id: string;
    };
};

export type ServerStickerMessage = {
    type: "sticker";
    sticker: {
        id: string;
        animated: boolean;
        mime_type: "image/webp";
        sha256: string;
    };
};

export type ServerVideoMessage = {
    type: "video";
    video: {
        mime_type: string;
        sha256: string;
        id: string;
    };
};

export type ServerLocationMessage = {
    type: "location";
    location: {
        latitude: string;
        longitude: string;
        name?: string;
        address?: string;
    };
};

export type ServerContactsMessage = {
    type: "contacts";
    contacts: [
        {
            addresses?: [
                {
                    city?: string;
                    country?: string;
                    country_code?: string;
                    state?: string;
                    street?: string;
                    type?: string;
                    zip?: string;
                }
            ];
            birthday?: string;
            emails?: [
                {
                    email?: string;
                    type?: string;
                }
            ];
            name: {
                formatted_name: string;
                first_name?: string;
                last_name?: string;
                middle_name?: string;
                suffix?: string;
                prefix?: string;
            };
            org?: {
                company?: string;
                department?: string;
                title?: string;
            };
            phones?: [
                {
                    phone?: string;
                    wa_id?: string;
                    type?: string;
                }
            ];
            urls?: [
                {
                    url?: string;
                    type?: string;
                }
            ];
        }
    ];
};

export type ServerInteractiveButtonMessage = {
    type: "button_reply";
    button_reply: {
        id: string;
        title: string;
    };
};

export type ServerInteractiveListMessage = {
    type: "list_reply";
    list_reply: {
        id: string;
        title: string;
        description?: string;
    };
};

export type ServerInteractiveNFMMessage = {
    type: "nfm_reply";
    nfm_reply:
        | {
              name: "address_message";
              body?: string;
              response_json: string;
          }
        | {
              name: "flow";
              body: "Sent";
              response_json: string;
          }
        | {
              name?: string;
              body?: string;
              response_json: string;
          };
};

export type ServerInteractiveCallPermissionMessage = {
    type: "call_permission_reply";
    call_permission_reply: {
        response: "accept" | "reject";
        is_permanent: false;
        expiration_timestamp: number;
        response_source: "user_action" | "automatic";
    };
};

export type ServerInteractiveMessage = {
    type: "interactive";
    interactive:
        | ServerInteractiveButtonMessage
        | ServerInteractiveListMessage
        | ServerInteractiveNFMMessage
        | ServerInteractiveCallPermissionMessage;
};

export type ServerButtonMessage = {
    type: "button";
    button: {
        text: string;
        payload: string;
    };
};

export type ServerReactionMessage = {
    type: "reaction";
    reaction: {
        emoji: string;
        message_id: string;
    };
};

export type ServerOrderMessage = {
    type: "order";
    order: {
        catalog_id: string;
        product_items: {
            product_retailer_id: string;
            quantity: string;
            item_price: string;
            currency: string;
        }[];
        text?: string;
    };
};

export type ServerSystemMessage = {
    type: "system";
    system: {
        body: string;
        identity: string;
        /**
         * @deprecated Since v12.0 it is undefined, use `wa_id` instead.
         *
         * I'm actually stunned this exists, since I started the library with v13 or 14.
         */
        new_wa_id: number | string;
        wa_id: string;
        type:
            | "customer_changed_number"
            | "customer_identity_changed"
            | string /* Backwards compatibility */;
        customer: string;
    };
};

export type ServerRequestWelcomeMessage = {
    type: "request_welcome";
};

export type ServerUnknownMessage = {
    type: "unknown";
    errors: [
        {
            code: number;
            details: "Message type is not currently supported";
            title: "Unsupported message type";
        }
    ];
};

export type ServerMessageTypes =
    | ServerTextMessage
    | ServerAudioMessage
    | ServerDocumentMessage
    | ServerImageMessage
    | ServerStickerMessage
    | ServerVideoMessage
    | ServerLocationMessage
    | ServerContactsMessage
    | ServerInteractiveMessage
    | ServerButtonMessage
    | ServerReactionMessage
    | ServerOrderMessage
    | ServerSystemMessage
    | ServerRequestWelcomeMessage
    | ServerUnknownMessage;

export type ServerMessage = {
    from: string;
    id: string;
    timestamp: string;
    context?: {
        forwarded?: boolean;
        frequently_forwarded?: boolean;
        from?: string;
        id?: string;
        referred_product?: {
            catalog_id: string;
            product_retailer_id: string;
        };
    };
    identity?: {
        acknowledged: boolean;
        created_timestamp: string;
        hash: string;
    };
    /**
     * Never saw this property on the wild, but it's documented
     */
    errors?: [ServerError];
    referral?: {
        source_url: string;
        source_id: string;
        source_type: "ad" | "post";
        headline: string;
        body: string;
        ctwa_clid: string;
        media_type: "image" | "video";
    } & (
        | {
              media_type: "image";
              image_url: string;
          }
        | {
              media_type: "video";
              video_url: string;
              thumbnail_url: string;
          }
    );
} & ServerMessageTypes;

export type ServerCall = {
    id: `wacid.${string}`;
    from: string;
    to: string;
    timestamp: `${number}`;
    direction: "USER_INITIATED" | "BUSINESS_INITIATED";
};

export type ServerCallConnect = ServerCall & {
    event: "connect";
    session: {
        sdp_type: "offer";
        sdp: string;
    };
};

export type ServerCallTerminate = ServerCall & {
    event: "terminate";
    status: "COMPLETED" | "FAILED";
    biz_opaque_callback_data: string;
    start_time?: `${number}`;
    end_time?: `${number}`;
    duration?: number;
};

export type ServerContacts = {
    profile: {
        name?: string;
    };
    wa_id: string;
};

export type ServerInitiation =
    | "authentication"
    | "marketing"
    | "utility"
    | "service"
    | "referral_conversion";

export type ServerStatus = "sent" | "delivered" | "read" | "failed";

export type ServerPricing = {
    pricing_model: "PMP";
    /**
     * @deprecated Since v16 with the release of the new pricing model
     */
    billable?: boolean;
    type: "regular" | "free_customer_service" | "free_entry_point";
    category:
        | ServerInitiation
        | "authentication_international"
        | "marketing_lite";
};

export type ServerConversation = {
    id: string;
    expiration_timestamp: number;
    origin: {
        type: ServerInitiation;
    };
};

export type ServerError = {
    code: number;
    title: string;
    message: string;
    error_data: {
        details: string;
    };
};

export type GetParams = {
    "hub.mode": "subscribe";
    "hub.verify_token": string;
    "hub.challenge": string;
};

export type PostDataMessageField = {
    field: "messages";
    value:
        | {
              contacts?: [ServerContacts];
              messages: [ServerMessage];
          }
        | {
              statuses: [
                  {
                      id: string;
                      status: ServerStatus;
                      timestamp: string;
                      recipient_id: string;
                      biz_opaque_callback_data?: string;
                  } & (
                      | {
                            conversation?: ServerConversation;
                            pricing: ServerPricing;
                            errors: undefined;
                        }
                      | {
                            conversation: undefined;
                            pricing: undefined;
                            errors: [ServerError];
                        }
                  )
              ];
          };
};

export type PostDataCallField = {
    field: "calls";
    value:
        | {
              contacts: [ServerContacts];
              calls: [ServerCallConnect | ServerCallTerminate];
          }
        | {
              statuses: [
                  {
                      id: `wacid.${string}`;
                      status: "RINGING" | "ACCEPTED" | "REJECTED";
                      timestamp: `${number}`;
                      recipient_id: string;
                      biz_opaque_callback_data?: string;
                      type: "call";
                  }
              ];
          };
};

export type PostData = {
    object: "whatsapp_business_account";
    entry: {
        id: string;
        changes: ({
            value: {
                messaging_product: "whatsapp";
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
            };
        } & (PostDataMessageField | PostDataCallField))[];
    }[];
};

/**
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes
 */
export type ServerErrorResponse = {
    error: {
        message: string;
        type: string;
        code: number;
        error_data: {
            messaging_product: "whatsapp";
            details: string;
        };
        error_subcode: number;
        fbtrace_id: string;
    };
};

export type NoServerError = {
    error?: never;
};

export type ServerSuccessResponse = {
    success: true;
} & NoServerError;

export type ServerSentMessageResponse = {
    messaging_product: "whatsapp";
    contacts: [
        {
            input: string;
            wa_id: string;
        }
    ];
    messages: [
        {
            id: string;
            message_status?: "accepted" | "held_for_quality_assessment";
        }
    ];
};

export type ServerMessageResponse =
    | (ServerSentMessageResponse & NoServerError)
    | ServerErrorResponse;

export type ServerMarkAsReadResponse =
    | ServerSuccessResponse
    | ServerErrorResponse;

export type ServerInitiateCallResponse =
    | {
          messaging_product: "whatsapp";
          calls: [{ id: `wacid.${string}` }];
      }
    | ServerErrorResponse;

export type ServerPreacceptCallResponse =
    | (ServerSuccessResponse & { messaging_product: "whatsapp" })
    | ServerErrorResponse;

export type ServerRejectCallResponse =
    | (ServerSuccessResponse & { messaging_product: "whatsapp" })
    | ServerErrorResponse;

export type ServerAcceptCallResponse =
    | (ServerSuccessResponse & { messaging_product: "whatsapp" })
    | ServerErrorResponse;

export type ServerTerminateCallResponse =
    | (ServerSuccessResponse & { messaging_product: "whatsapp" })
    | ServerErrorResponse;

export type ServerQR = {
    code: string;
    prefilled_message: string;
    deep_link_url: string;
    qr_image_url?: string;
};

export type ServerCreateQRResponse =
    | (ServerQR & NoServerError)
    | ServerErrorResponse;

export type ServerRetrieveQRResponse =
    | ({ data: ServerQR[] } & NoServerError)
    | ServerErrorResponse;

export type ServerUpdateQRResponse =
    | (ServerQR & NoServerError)
    | ServerErrorResponse;

export type ServerDeleteQRResponse =
    | ServerSuccessResponse
    | ServerErrorResponse;

export type ServerMedia = {
    id: string;
};

export type ServerMediaUploadResponse =
    | (ServerMedia & NoServerError)
    | ServerErrorResponse;

export type ValidMimeTypes =
    | "audio/aac"
    | "audio/mp4"
    | "audio/mpeg"
    | "audio/amr"
    | "audio/ogg"
    | "text/plain"
    | "application/pdf"
    | "application/vnd.ms-powerpoint"
    | "application/msword"
    | "application/vnd.ms-excel"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "image/jpeg"
    | "image/png"
    | "video/mp4"
    | "video/3gp"
    | "image/webp";

export type ServerMediaRetrieveResponse =
    | ({
          messaging_product: "whatsapp";
          url: string;
          mime_type: ValidMimeTypes;
          sha256: string;
          file_size: string;
      } & ServerMedia &
          NoServerError)
    | ServerErrorResponse;

export type ServerMediaDeleteResponse =
    | ServerSuccessResponse
    | ServerErrorResponse;

export type ServerBlockedError = Pick<
    ServerErrorResponse["error"],
    "message" | "type" | "code"
> & {
    error_data: {
        details: string;
    };
};

export type ServerBlockedUser = {
    input: string;
    wa_id: string;
};

export type ServerBlockFailedUser = {
    input: string;
    errors: Omit<ServerBlockedError, "type">[];
};

export type ServerBlockResponse =
    | {
          messaging_product: "whatsapp";
          block_users: {
              added_users: ServerBlockedUser[];
              failed_users?: ServerBlockFailedUser[];
          };
          errors?: ServerBlockedError;
      }
    | ServerErrorResponse;

export type ServerUnblockResponse =
    | {
          messaging_product: "whatsapp";
          block_users: {
              removed_users: ServerBlockedUser[];
              // Not sure if this actually exists...
              failed_users?: ServerBlockFailedUser[];
          };
          errors?: ServerBlockedError;
      }
    | ServerErrorResponse;
