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
    | ServerOrderMessage
    | ServerButtonMessage
    | ServerUnknownMessage
    | ServerReactionMessage
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
