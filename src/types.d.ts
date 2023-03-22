import type {
    Text,
    Audio,
    Document,
    Image,
    Sticker,
    Video,
    Location,
    Contacts,
    Interactive,
    Template,
    Reaction
} from "./messages";

export interface ClientMessage {
    /**
     * The message type
     *
     * @internal
     * @privateRemarks The built-in classes will return values within {@link ClientMessageNames},
     * however, in order to allow custom messages, it's defined as a string.
     */
    get _type(): ClientMessageNames | string;
    /**
     * The message built as a string. In most cases it's just JSON.stringify(this)
     *
     * @internal
     */
    _build(): string;
}

export interface ClientMessageComponent {
    // Allow the user create custom components
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface ClientTypedMessageComponent extends ClientMessageComponent {
    /**
     * The message's component type
     *
     * @internal
     */
    get _type(): string;
}

export interface ClientBuildableMessageComponent
    extends ClientMessageComponent {
    /**
     * The message's component builder method
     *
     * @internal
     */
    _build(...data);
}

// Somehow, Contacts still manages to be annoying
export interface ContactComponent
    extends ClientTypedMessageComponent,
        ClientBuildableMessageComponent {
    /**
     * Whether the component can be repeated multiple times in a contact
     */
    get _many(): boolean;
}

export type ClientMessageBuiltin =
    | Text
    | Audio
    | Document
    | Image
    | Sticker
    | Video
    | Location
    | Contacts
    | Interactive
    | Template
    | Reaction;

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
          | {
                type: string;
                [key: string]: string;
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
