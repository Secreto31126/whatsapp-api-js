import {
    ClientMessage,
    ClientLimitedMessageComponent,
    type ClientBuildableMessageComponent,
    type ClientTypedMessageComponent,
    type TemplateComponent
} from "../types.js";
import type { AtLeastOne, XOR } from "../utils";

import type { Location } from "./location";
import type { Document, Image, Video } from "./media";

import { Product, ProductSection } from "./globals.js";

/**
 * @group Template
 */
export type ButtonParameter = {
    /**
     * The type of the button
     */
    readonly type: "text" | "payload" | "action" | "coupon_code";
    /**
     * The text of the button
     */
    readonly text?: string;
    /**
     * The payload of the button
     */
    readonly payload?: string;
    /**
     * The coupon's code of the button
     */
    readonly coupon_code?: string;
    /**
     * The action of the button
     */
    readonly action?: XOR<
        {
            thumbnail_product_retailer_id: string;
            sections?: AtLeastOne<ProductSection>;
        },
        {
            flow_token: string;
            flow_action_data: unknown;
        }
    >;
};

/**
 * This type is used as a C struct pointer for the _build method
 *
 * @internal
 */
type BuildingPointers = {
    theres_only_body: boolean;
    button_counter: number;
};

/**
 * Template API object
 *
 * @group Template
 */
export class Template extends ClientMessage {
    /**
     * The name of the template
     */
    readonly name: string;
    /**
     * The language of the template
     */
    readonly language: Language;
    /**
     * The components of the template
     */
    readonly components?: Array<NonNullable<TemplateComponent>>;

    /**
     * @override
     * @internal
     */
    get _type(): "template" {
        return "template";
    }

    /**
     * Create a Template object for the API
     *
     * @example
     * ```ts
     * import {
     *     Template,
     *     HeaderComponent,
     *     HeaderParameter,
     *     BodyComponent,
     *     BodyParameter,
     *     Currency,
     *     DateTime
     * } from "whatsapp-api-js/messages";
     *
     * const template_variables_message = new Template(
     *     "template_name",
     *     "en",
     *     new HeaderComponent(
     *         new HeaderParameter("Hello"),
     *         new HeaderParameter(new Currency(1.5 * 1000, "USD", "U$1.5")),
     *         new HeaderParameter(new DateTime("01/01/2023"))
     *     ),
     *     new BodyComponent(
     *         new BodyParameter("Hello"),
     *         new BodyParameter(new Currency(1.5 * 1000, "USD", "U$1.5")),
     *         new BodyParameter(new DateTime("01/01/2023"))
     *     )
     * );
     * ```
     *
     * @param name - Name of the template
     * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param components - Components objects containing the parameters of the message. For text-based templates, the only supported component is {@link BodyComponent}.
     * @throws If the template isn't text-based (only one {@link BodyComponent} is given) and one of the parameters is a string and it's over 1024 characters.
     */
    constructor(
        name: string,
        language: string | Language,
        ...components: TemplateComponent[]
    ) {
        super();
        this.name = name;
        this.language =
            typeof language === "string" ? new Language(language) : language;
        if (components.length) {
            const pointers = {
                theres_only_body:
                    components.length === 1 &&
                    components[0] instanceof BodyComponent,
                button_counter: 0
            };
            this.components = components
                .map((cmpt) => cmpt._build(pointers))
                .filter((e) => !!e) as NonNullable<TemplateComponent>[];
        }
    }

    /**
     * OTP Template generator
     *
     * @example
     * ```ts
     * import { Template } from "whatsapp-api-js/messages";
     *
     * const template_otp_message = Template.OTP("template_name", "en", "123456");
     * ```
     *
     * @param name - Name of the template
     * @param language - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param code - The one time password to be sent
     * @returns A Template object for the API
     */
    static OTP(
        name: string,
        language: string | Language,
        code: string
    ): Template {
        return new Template(
            name,
            language,
            new BodyComponent(new BodyParameter(code)),
            new URLComponent(code)
        );
    }
}

/**
 * Language API object
 *
 * @group Template
 */
export class Language {
    /**
     * The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     */
    readonly code: string;
    /**
     * The language policy
     */
    readonly policy: "deterministic";

    /**
     * Create a Language component for a Template message
     *
     * @param code - The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
     * @param policy - The language policy the message should follow. The only supported option is 'deterministic'.
     */
    constructor(code: string, policy: "deterministic" = "deterministic") {
        this.policy = policy;
        this.code = code;
    }
}

/**
 * Currency API object
 *
 * @group Template
 */
export class Currency implements ClientTypedMessageComponent {
    /**
     * The amount of the currency by 1000
     */
    readonly amount_1000: number;
    /**
     * The currency code
     */
    readonly code: string;
    /**
     * The fallback value
     */
    readonly fallback_value: string;

    /**
     * @override
     * @internal
     */
    get _type(): "currency" {
        return "currency";
    }

    /**
     * Builds a currency object for a Parameter
     *
     * @param amount_1000 - Amount multiplied by 1000
     * @param code - Currency code as defined in ISO 4217
     * @param fallback_value - Default text if localization fails
     * @throws If amount_1000 is not greater than 0
     */
    constructor(amount_1000: number, code: string, fallback_value: string) {
        if (amount_1000 <= 0)
            throw new Error("Currency must have an amount_1000 greater than 0");

        this.amount_1000 = amount_1000;
        this.code = code;
        this.fallback_value = fallback_value;
    }
}

/**
 * DateTime API object
 *
 * @group Template
 */
export class DateTime implements ClientTypedMessageComponent {
    /**
     * The fallback value
     */
    readonly fallback_value: string;

    /**
     * @override
     * @internal
     */
    get _type(): "date_time" {
        return "date_time";
    }

    /**
     * Builds a date_time object for a Parameter
     *
     * @param fallback_value - Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
     */
    constructor(fallback_value: string) {
        this.fallback_value = fallback_value;
    }
}

/**
 * Components API object
 *
 * @see {@link URLComponent}
 * @see {@link PayloadComponent}
 * @see {@link CatalogComponent}
 * @see {@link MPMComponent}
 * @see {@link CopyComponent}
 * @see {@link SkipButtonComponent}
 *
 * @group Template
 */
export abstract class ButtonComponent implements TemplateComponent {
    /**
     * The type of the component
     */
    readonly type = "button";
    /**
     * The subtype of the component
     */
    readonly sub_type:
        | "url"
        | "quick_reply"
        | "catalog"
        | "mpm"
        | "copy_code"
        | "flow";
    /**
     * The parameter of the component
     */
    readonly parameters: [ButtonParameter];
    /**
     * The index of the component (assigned after calling _build)
     */
    protected index = NaN;

    /**
     * Builds a button component for a Template message.
     * The index of each component is defined by the order they are sent to the Template's constructor.
     *
     * @internal
     * @param sub_type - The type of button component to create.
     * @param parameter - The parameter for the component. The index of each component is defined by the order they are sent to the Template's constructor.
     */
    constructor(
        sub_type: ButtonComponent["sub_type"],
        parameter: ButtonParameter
    ) {
        this.sub_type = sub_type;
        this.parameters = [parameter];
    }

    /**
     * @override
     * @internal
     */
    _build(pointers: BuildingPointers): this {
        this.index = pointers.button_counter++;
        return this;
    }
}

/**
 * Button Component API object for call to action buttons
 *
 * @group Template
 */
export class URLComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template message with call to action buttons.
     *
     * @param parameter - The variable for the url button.
     * @throws If parameter is an empty string.
     */
    constructor(parameter: string) {
        super("url", new URLComponent.Button(parameter));
    }

    /**
     * @internal
     */
    private static Button = class implements ButtonParameter {
        readonly type = "text";
        readonly text: string;

        /**
         * Creates a parameter for a Template message with call to action buttons.
         *
         * @param text - The text of the button
         * @throws If text is an empty string
         */
        constructor(text: string) {
            if (!text.length) {
                throw new Error("Button parameter can't be an empty string");
            }

            this.text = text;
        }
    };
}

/**
 * Button Component API object for quick reply buttons
 *
 * @group Template
 */
export class PayloadComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template message with quick reply buttons.
     *
     * @param parameter - Parameter for the component.
     * @throws If parameter is an empty string.
     */
    constructor(parameter: string) {
        super("quick_reply", new PayloadComponent.Button(parameter));
    }

    /**
     * @internal
     */
    private static Button = class implements ButtonParameter {
        readonly type = "payload";
        readonly payload: string;

        /**
         * Creates a parameter for a Template message with quick reply buttons.
         *
         * @param payload - The id of the button.
         * @throws If payload is an empty string.
         */
        constructor(payload: string) {
            if (!payload.length) {
                throw new Error("Button parameter can't be an empty string");
            }

            this.payload = payload;
        }
    };
}

/**
 * Button Component API object for catalog button
 *
 * @group Template
 */
export class CatalogComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template catalog button.
     *
     * @param thumbnail - The product to use as thumbnail.
     */
    constructor(thumbnail: Product) {
        super("catalog", new CatalogComponent.Action(thumbnail));
    }

    /**
     * @internal
     */
    private static Action = class implements ButtonParameter {
        readonly type = "action";
        readonly action: {
            thumbnail_product_retailer_id: string;
        };

        /**
         * Creates a parameter for a Template message with a catalog button.
         *
         * @param thumbnail - The product to use as thumbnail.
         */
        constructor(thumbnail: Product) {
            this.action = {
                thumbnail_product_retailer_id: thumbnail.product_retailer_id
            };
        }
    };
}

/**
 * Button Component API object for Multi-Product Message
 *
 * @group Template
 */
export class MPMComponent extends ButtonComponent {
    /**
     * Creates a button component for a MPM Template.
     *
     * @param thumbnail - The product to use as thumbnail.
     * @param sections - The sections of the MPM. Must have between 1 and 10 sections. Must have less than 30 products *across* all sections.
     * @throws If sections is over 10 elements.
     * @throws If sections is over 1 element and one of the sections doesn't have a title.
     */
    constructor(thumbnail: Product, ...sections: AtLeastOne<ProductSection>) {
        super("mpm", new MPMComponent.Action(thumbnail, sections));
    }

    /**
     * @internal
     */
    private static Action = class
        extends ClientLimitedMessageComponent<ProductSection, 10>
        implements ButtonParameter
    {
        readonly type = "action";
        readonly action: {
            thumbnail_product_retailer_id: string;
            sections: AtLeastOne<ProductSection>;
        };

        /**
         * Creates a parameter for a MPM Template.
         *
         * @param thumbnail - The product to use as thumbnail.
         * @param sections - The sections of the MPM. Must have between 1 and 10 sections.
         * @throws If sections is over 10 elements.
         * @throws If sections is over 1 element and one of the sections doesn't have a title.
         */
        constructor(thumbnail: Product, sections: AtLeastOne<ProductSection>) {
            super("MPMComponent", "sections", sections, 10);

            // TODO: Idk if this rule applies here.
            if (sections.length > 1) {
                if (!sections.every((s) => !!s.title)) {
                    throw new Error(
                        "All sections must have a title if more than 1 section is provided"
                    );
                }
            }

            this.action = {
                thumbnail_product_retailer_id: thumbnail.product_retailer_id,
                sections
            };
        }
    };
}

/**
 * Button Component API object for copy coupon button
 *
 * @group Template
 */
export class CopyComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template message with copy coupon button.
     *
     * @param parameter - The coupon's code of the button to copy.
     * @throws If parameter is an empty string.
     */
    constructor(parameter: string) {
        super("copy_code", new CopyComponent.Action(parameter));
    }

    /**
     * @internal
     */
    private static Action = class implements ButtonParameter {
        readonly type = "coupon_code";
        readonly coupon_code: string;

        /**
         * Creates a parameter for a Template message with copy coupon button.
         *
         * @param coupon_code - The coupon's code of the button.
         * @throws If coupon_code is an empty string.
         */
        constructor(coupon_code: string) {
            if (!coupon_code.length) {
                throw new Error("Action coupon_code can't be an empty string");
            }

            this.coupon_code = coupon_code;
        }
    };
}

/**
 * Button Component API object for flow button
 *
 * @group Template
 */
export class FlowComponent extends ButtonComponent {
    /**
     * Creates a button component for a Template message with flow button.
     *
     * @param flow_token - Honestly, I don't know what this is, the documentation only says this might be "FLOW_TOKEN" and defaults to "unused".
     * @param flow_action_data - JSON object with the data payload for the first screen.
     */
    constructor(flow_token: string, flow_action_data: unknown) {
        super("flow", new FlowComponent.Action(flow_token, flow_action_data));
    }

    /**
     * @internal
     */
    private static Action = class implements ButtonParameter {
        readonly type = "action";
        readonly action: {
            flow_token: string;
            flow_action_data: unknown;
        };

        /**
         * Creates a parameter for a Template message with flow button.
         *
         * @param flow_token - Idk, some string.
         * @param flow_action_data - JSON object with the data payload for the first screen.
         */
        constructor(flow_token: string, flow_action_data: unknown) {
            this.action = {
                flow_token,
                flow_action_data
            };
        }
    };
}

/**
 * (Fake) Button Component API object for skipping buttons that don't require a parameter (such as phone number buttons)
 *
 * @group Template
 */
export class SkipButtonComponent extends ButtonComponent {
    /**
     * Skips a button component index for a Template message.
     */
    constructor() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - This is a fake button component, no need to pass parameters
        super();
    }

    /**
     * @override
     * @internal
     */
    _build(pointers: BuildingPointers): this {
        pointers.button_counter++;
        return null as unknown as this;
    }
}

/**
 * Components API object
 *
 * @group Template
 */
export class HeaderComponent implements TemplateComponent {
    /**
     * The type of the component
     */
    readonly type: "header";
    /**
     * The parameters of the component
     */
    readonly parameters: HeaderParameter[];

    /**
     * Builds a header component for a Template message
     *
     * @param parameters - Parameters of the body component
     */
    constructor(...parameters: AtLeastOne<HeaderParameter>) {
        this.type = "header";
        this.parameters = parameters;
    }

    /**
     * @override
     * @internal
     */
    _build(): this {
        return this;
    }
}

/**
 * Parameter API object
 *
 * @group Template
 */
export class HeaderParameter {
    /**
     * The type of the parameter
     */
    readonly type:
        | "text"
        | "currency"
        | "date_time"
        | "image"
        | "document"
        | "video"
        | "location";
    /**
     * The text of the parameter
     */
    readonly text?: string;
    /**
     * The currency of the parameter
     */
    readonly currency?: Currency;
    /**
     * The datetime of the parameter
     */
    readonly date_time?: DateTime;
    /**
     * The image of the parameter
     */
    readonly image?: Image;
    /**
     * The document of the parameter
     */
    readonly document?: Document;
    /**
     * The video of the parameter
     */
    readonly video?: Video;
    /**
     * The location of the parameter
     */
    readonly location?: Location;

    /**
     * Builds a parameter object for a HeaderComponent.
     * For text parameter, the character limit is 60.
     * For Document parameter, only PDF documents are supported for document-based message templates (not checked).
     * For Location parameter, the location must have a name and address.
     *
     * @param parameter - The parameter to be used in the template's header
     * @throws If parameter is a string and it's over 60 characters
     * @throws If parameter is a Location and it doesn't have a name and address
     */
    constructor(
        parameter:
            | string
            | Currency
            | DateTime
            | Image
            | Document
            | Video
            | Location
    ) {
        if (typeof parameter === "string") {
            if (parameter.length > 60)
                throw new Error("Header text must be 60 characters or less");

            this.type = "text";
        } else {
            if (
                parameter._type === "location" &&
                !(parameter.name && parameter.address)
            ) {
                throw new Error("Header location must have a name and address");
            }

            this.type = parameter._type;
        }

        Object.defineProperty(this, this.type, {
            value: parameter,
            enumerable: true
        });
    }
}

/**
 * Components API object
 *
 * @group Template
 */
export class BodyComponent implements TemplateComponent {
    /**
     * The type of the component
     */
    readonly type: "body";
    /**
     * The parameters of the component
     */
    readonly parameters: BodyParameter[];

    /**
     * Builds a body component for a Template message
     *
     * @param parameters - Parameters of the body component
     */
    constructor(...parameters: AtLeastOne<BodyParameter>) {
        this.type = "body";
        this.parameters = parameters;
    }

    /**
     * @override
     * @internal
     * @throws If theres_only_body is false and one of the parameters is a string and it's over 1024 characters
     */
    _build({ theres_only_body }: BuildingPointers): this {
        // If it needs to check for the shorter max text length
        if (!theres_only_body) {
            for (const param of this.parameters) {
                if (param.text && param.text?.length > 1024) {
                    throw new Error(
                        "Body text must be 1024 characters or less"
                    );
                }
            }
        }

        return this;
    }
}

/**
 * Parameter API object
 *
 * @group Template
 */
export class BodyParameter {
    /**
     * The type of the parameter
     */
    readonly type: "text" | "currency" | "date_time";
    /**
     * The text of the parameter
     */
    readonly text?: string;
    /**
     * The currency of the parameter
     */
    readonly currency?: Currency;
    /**
     * The datetime of the parameter
     */
    readonly date_time?: DateTime;

    /**
     * Builds a parameter object for a BodyComponent.
     * For text parameter, the character limit is 32768 if only one BodyComponent is used for the Template, else it's 1024.
     *
     * @param parameter - The parameter to be used in the template
     * @throws If parameter is a string and it's over 32768 characters
     * @throws If parameter is a string, there are other components in the Template and it's over 1024 characters
     * @see {@link BodyComponent._build} The method that checks the 1024 character limit
     */
    constructor(parameter: string | Currency | DateTime) {
        if (typeof parameter === "string") {
            // Check the upper limit of the string length here
            // If a shorter one is needed, check and throw an
            // error on the build method of BodyComponent
            if (parameter.length > 32_768)
                throw new Error("Body text must be 32768 characters or less");

            this.type = "text";
        } else {
            this.type = parameter._type;
        }

        Object.defineProperty(this, this.type, {
            value: parameter,
            enumerable: true
        });
    }
}

/**
 * Components API object
 *
 * @group Template
 */
export class CarouselComponent
    extends ClientLimitedMessageComponent<CarouselCard, 10>
    implements TemplateComponent
{
    /**
     * The type of the component
     */
    readonly type = "carousel";
    /**
     * The cards of the component
     */
    readonly cards: CarouselCard[];

    /**
     * Builds a carousel component for a Template message
     *
     * @param cards - The cards of the component
     * @throws If cards is over 10 elements
     */
    constructor(...cards: AtLeastOne<CarouselCard>) {
        super("CarouselComponent", "CarouselCard", cards, 10);

        const pointers = {
            counter: 0
        };

        this.cards = cards.map((cmpt) => cmpt._build(pointers));
    }

    /**
     * @override
     * @internal
     */
    _build(): this {
        return this;
    }
}

/**
 * Card API object
 *
 * @group Template
 */
export class CarouselCard implements ClientBuildableMessageComponent {
    /**
     * The index of the card (assigned after calling _build)
     */
    protected card_index = NaN;
    /**
     * The components of the card
     */
    readonly components: NonNullable<
        HeaderComponent | BodyComponent | ButtonComponent
    >[];

    /**
     * Builds a carousel card for a CarouselComponent.
     *
     * @remarks
     * If this looks odly similar to Template constructor's signature, it's because it is.
     *
     * @param header - The header parameter for the card
     * @param components - The other components for the card
     */
    constructor(
        header: Image | Video,
        ...components: (BodyComponent | ButtonComponent)[]
    ) {
        const tmp = new Template(
            "",
            "",
            new HeaderComponent(new HeaderParameter(header)),
            ...components
        );

        this.components = tmp.components as NonNullable<
            HeaderComponent | BodyComponent | ButtonComponent
        >[];
    }

    /**
     * @override
     * @internal
     */
    _build(ptr: { counter: number }): this {
        this.card_index = ptr.counter++;
        return this;
    }
}

/**
 * Components API object
 *
 * @group Template
 */
export class LTOComponent implements TemplateComponent {
    /**
     * The type of the component
     */
    readonly type = "limited_time_offer";
    /**
     * The parameters of the component
     */
    readonly parameters: [
        {
            type: "limited_time_offer";
            limited_time_offer: {
                expiration_time_ms: number;
            };
        }
    ];

    /**
     * Builds a limited-time offer component for a Template message
     *
     * @param expiration - Offer code expiration time as a UNIX timestamp in milliseconds
     * @throws If expiration is negative
     */
    constructor(expiration: number) {
        if (expiration < 0) {
            throw new Error(
                "Expiration time must be a positive Unix timestamp"
            );
        }

        this.parameters = [
            {
                type: "limited_time_offer",
                limited_time_offer: {
                    expiration_time_ms: expiration
                }
            }
        ];
    }

    /**
     * @override
     * @internal
     */
    _build(): this {
        return this;
    }
}
