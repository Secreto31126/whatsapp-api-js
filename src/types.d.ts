import type Text from "./messages/text";
import type { Audio, Document, Image, Sticker, Video } from "./messages/media";
import type Location from "./messages/location";
import type { Contacts } from "./messages/contacts";
import type { Interactive } from "./messages/interactive";
import type { Template } from "./messages/template";
import type Reaction from "./messages/reaction";

export type ClientMessage =
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
} & (
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
    | ServerUnknownMessage
);

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

export type ServerMessageResponse =
    | {
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
      }
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

export type ServerCreateQR = ServerQR | ServerErrorResponse;

export type ServerRetrieveQR =
    | {
          data: ServerQR[];
      }
    | ServerErrorResponse;

export type ServerUpdateQR = ServerQR | ServerErrorResponse;

export type ServerDeleteQR = ServerSuccessResponse | ServerErrorResponse;

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
