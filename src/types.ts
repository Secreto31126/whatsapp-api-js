/// <reference types="node" />

import type { fetch as FetchType } from "undici";
import type { subtle as CryptoSubtle } from "node:crypto";

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
     * (Sorry for the rant, here's the [actual documentation](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started))
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
     * The version of the API, defaults to v16.0
     */
    v?: string;
    /**
     * Whether to return a pre-processed response from the API or the raw fetch response.
     * Intended for low level debugging.
     */
    parsed?: boolean;
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
        fetch?: typeof FetchType;
        /**
         * The subtle ponyfill to use for the signatures. If not specified, it defaults to crypto.subtle from the enviroment.
         */
        subtle?: typeof CryptoSubtle;
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

export abstract class ClientMessage {
    /**
     * The message type
     *
     * @internal
     */
    abstract get _type(): ClientMessageNames;
    /**
     * The message built as a string. In most cases it's just JSON.stringify(this)
     *
     * @internal
     */
    _build(): string {
        return JSON.stringify(this);
    }
}

export interface ClientTypedMessageComponent {
    /**
     * The message's component type
     *
     * @internal
     */
    get _type(): string;
}

export abstract class ClientBuildableMessageComponent {
    /**
     * The message's component builder method
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _build(..._: unknown[]): unknown {
        return this;
    }
}

export abstract class ClientLimitedMessageComponent<T, N extends number> {
    /**
     * Throws an error if the array length is greater than the specified number.
     *
     * @param p - The parent component name
     * @param c - The component name
     * @param a - The array to check the length of
     * @param n - The maximum length
     */
    constructor(p: string, c: string, a: Array<T>, n: N) {
        if (a.length > n) {
            throw new Error(`${p} can't have more than ${n} ${c}`);
        }
    }
}

// Somehow, Contacts still manages to be annoying
export abstract class ContactComponent
    implements ClientTypedMessageComponent, ClientBuildableMessageComponent
{
    /**
     * Whether the component can be repeated multiple times in a contact.
     * Defaults to false.
     *
     * @internal
     */
    get _many(): boolean {
        return false;
    }

    abstract get _type(): string;
    abstract _build(): unknown;
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

// #region Client Message Request

export type ClientMessageRequest =
    | {
          /**
           * The messaging product
           */
          messaging_product: "whatsapp";
          /**
           * The user's phone number
           */
          to: string;
          /**
           * Undocumented, optional (the framework doesn't use it)
           */
          recipient_type?: "individual";
          /**
           * The message to reply to
           */
          context?: {
              /**
               * The message id to reply to
               */
              message_id: string;
          };
      } & (
          | {
                type: "text";
                text?: string;
            }
          | {
                type: "audio";
                audio?: string;
            }
          | {
                type: "document";
                document?: string;
            }
          | {
                type: "image";
                image?: string;
            }
          | {
                type: "sticker";
                sticker?: string;
            }
          | {
                type: "video";
                video?: string;
            }
          | {
                type: "location";
                location?: string;
            }
          | {
                type: "contacts";
                contacts?: string;
            }
          | {
                type: "interactive";
                interactive?: string;
            }
          | {
                type: "template";
                template?: string;
            }
          | {
                type: "reaction";
                reaction?: string;
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

export type ServerInteractiveMessage = {
    type: "interactive";
    interactive:
        | {
              type: "button_reply";
              button_reply: {
                  id: string;
                  title: string;
              };
              list_reply: never;
          }
        | {
              type: "list_reply";
              list_reply: {
                  id: string;
                  title: string;
                  description: string;
              };
              button_reply: never;
          };
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
        messsage_id: string;
    };
};

export type ServerOrderMessage = {
    type: "order";
    order: {
        catalog_id: string;
        product_items: [
            {
                product_retailer_id: string;
                quantity: string;
                item_price: string;
                currency: string;
            }
        ];
        text?: string;
    };
};

export type ServerSystemMessage = {
    type: "system";
    system: {
        body: string;
        new_wa_id: number | string; // TODO: check if this is always a number
        type: string | "user_changed_number";
    };
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
        created_timestamp: number;
        hash: string;
    };
    referral?: {
        source_url: string;
        source_id: string;
        source_type: string;
        headline: string;
        body: string;
        media_type: string;
        image_url: string;
        video_url: string;
        thumbnail_url: string;
    };
} & ServerMessageTypes;

export type ServerContacts = {
    profile: {
        name?: string;
    };
    wa_id: string;
};

export type ServerInitiation =
    | "user_initiated"
    | "business_initated"
    | "referral_conversion";

export type ServerStatus = "sent" | "delivered" | "read" | "failed" | "deleted";

export type ServerPricing = {
    pricing_model: "CBP";
    billable: boolean;
    category: ServerInitiation;
};

export type ServerConversation = {
    id: string;
    expiration_timestamp: number;
    origin: {
        type: ServerInitiation;
    };
};

export type ServerError = {
    code: string;
    title: string;
};

export type GetParams = {
    "hub.mode": "subscribe";
    "hub.verify_token": string;
    "hub.challenge": string;
};

export type PostData = {
    object: "whatsapp_business_account";
    entry: {
        id: string;
        changes: {
            value:
                | {
                      messaging_product: "whatsapp";
                      metadata: {
                          display_phone_number: string;
                          phone_number_id: string;
                      };
                  } & (
                      | {
                            contacts: [ServerContacts];
                            messages: [ServerMessage];
                        }
                      | {
                            statuses: [
                                {
                                    id: string;
                                    status: ServerStatus;
                                    timestamp: string;
                                    recipient_id: string;
                                } & (
                                    | {
                                          conversation: ServerConversation;
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
                        }
                  );
            field: "messages";
        }[];
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

export type ServerSuccessResponse = {
    success: true;
};

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
        }
    ];
};

export type ServerMessageResponse =
    | ServerSentMessageResponse
    | ServerErrorResponse;

export type ServerMarkAsReadResponse =
    | ServerSuccessResponse
    | ServerErrorResponse;

export type ServerQR = {
    code: string;
    prefilled_message: string;
    deep_link_url: string;
    qr_image_url?: string;
};

export type ServerCreateQRResponse = ServerQR | ServerErrorResponse;

export type ServerRetrieveQRResponse =
    | {
          data: ServerQR[];
      }
    | ServerErrorResponse;

export type ServerUpdateQRResponse = ServerQR | ServerErrorResponse;

export type ServerDeleteQRResponse =
    | ServerSuccessResponse
    | ServerErrorResponse;

export type ServerMedia = {
    id: string;
};

export type ServerMediaUploadResponse = ServerMedia | ServerErrorResponse;

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
      } & ServerMedia)
    | ServerErrorResponse;

export type ServerMediaDeleteResponse =
    | ServerSuccessResponse
    | ServerErrorResponse;
