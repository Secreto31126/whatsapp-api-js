import { ClientMessage, type ContactComponent, ContactUniqueComponent, ContactMultipleComponent } from "../types.js";
import type { AtLeastOne } from "../utils";
/**
 * @group Contacts
 */
export type BuiltContact = {
    name: Name;
} & Partial<{
    birthday: string;
    org: Organization;
    addresses: Address[];
    phones: Phone[];
    emails: Email[];
    urls: Url[];
}>;
/**
 * Contacts API object
 *
 * @group Contacts
 */
export declare class Contacts extends ClientMessage {
    /**
     * The contacts of the message
     */
    readonly component: BuiltContact[];
    /**
     * @override
     * @internal
     */
    get _type(): "contacts";
    /**
     * Create a Contacts object for the API
     *
     * @example
     * ```ts
     * import { Contacts, Name, Address, Phone } from "whatsapp-api-js/messages";
     *
     * const contact_message = new Contacts([
     *     new Name("John Doe", "John", "Doe", undefined, "Mr.", "Jr."),
     *     new Address(
     *         "United States",
     *         "US",
     *         "FL",
     *         "Miami",
     *         "221B Baker Street",
     *         "33101",
     *         "Mystery"
     *     ),
     *     new Phone("+123456789", "Mystery", "123456789")
     * ]);
     * ```
     *
     * @param contact - Array of contact's components
     * @throws If contact contains multiple of the same components and _many is set to false (for example, Name, Birthday and Organization)
     */
    constructor(...contact: AtLeastOne<Array<Address | Birthday | Email | Name | Organization | Phone | Url | ContactComponent>>);
    /**
     * @override
     * @internal
     */
    _build(): string;
}
/**
 * Address API object
 *
 * @group Contacts
 */
export declare class Address extends ContactMultipleComponent {
    /**
     * The country of the address
     */
    readonly country?: string;
    /**
     * The country code of the address
     */
    readonly country_code?: string;
    /**
     * The state of the address
     */
    readonly state?: string;
    /**
     * The city of the address
     */
    readonly city?: string;
    /**
     * The street of the address
     */
    readonly street?: string;
    /**
     * The zip code of the address
     */
    readonly zip?: string;
    /**
     * The type of the address
     */
    readonly type?: string;
    /**
     * @override
     * @internal
     */
    get _type(): "addresses";
    /**
     * Builds an address object for a contact.
     * A contact can contain multiple addresses objects.
     *
     * @param country - Full country name
     * @param country_code - Two-letter country abbreviation
     * @param state - State abbreviation
     * @param city - City name
     * @param street - Street number and name
     * @param zip - ZIP code
     * @param type - Address type. Standard Values: HOME, WORK
     */
    constructor(country?: string, country_code?: string, state?: string, city?: string, street?: string, zip?: string, type?: string);
}
/**
 * Birthday API object
 *
 * @group Contacts
 */
export declare class Birthday extends ContactUniqueComponent {
    /**
     * The birthday of the contact
     */
    readonly birthday: string;
    /**
     * @override
     * @internal
     */
    get _type(): "birthday";
    /**
     * Builds a birthday object for a contact
     *
     * @param year - Year of birth (YYYY)
     * @param month - Month of birth (MM)
     * @param day - Day of birth (DD)
     * @throws If the year, month, or day doesn't have a valid length
     */
    constructor(year: string, month: string, day: string);
    /**
     * @override
     * @internal
     */
    _build(): string;
}
/**
 * Email API object
 *
 * @group Contacts
 */
export declare class Email extends ContactMultipleComponent {
    /**
     * The email of the contact
     */
    readonly email?: string;
    /**
     * The type of the email
     */
    readonly type?: string;
    /**
     * @override
     * @internal
     */
    get _type(): "emails";
    /**
     * Builds an email object for a contact.
     * A contact can contain multiple emails objects.
     *
     * @param email - Email address
     * @param type - Email type. Standard Values: HOME, WORK
     */
    constructor(email?: string, type?: string);
}
/**
 * Name API object
 *
 * @group Contacts
 */
export declare class Name extends ContactUniqueComponent {
    /**
     * The formatted name of the contact
     */
    readonly formatted_name: string;
    /**
     * The first name of the contact
     */
    readonly first_name?: string;
    /**
     * The last name of the contact
     */
    readonly last_name?: string;
    /**
     * The middle name of the contact
     */
    readonly middle_name?: string;
    /**
     * The suffix of the contact
     */
    readonly suffix?: string;
    /**
     * The prefix of the contact
     */
    readonly prefix?: string;
    /**
     * @override
     * @internal
     */
    get _type(): "name";
    /**
     * Builds a name object for a contact, required for contacts.
     * The object requires a formatted_name and at least another property.
     *
     * @param formatted_name - Full name, as it normally appears
     * @param first_name - First name
     * @param last_name - Last name
     * @param middle_name - Middle name
     * @param suffix - Name suffix
     * @param prefix - Name prefix
     * @throws If no other component apart from formatted_name is defined
     */
    constructor(formatted_name: string, first_name?: string, last_name?: string, middle_name?: string, suffix?: string, prefix?: string);
}
/**
 * Organization API object
 *
 * @group Contacts
 */
export declare class Organization extends ContactUniqueComponent {
    /**
     * The company of the contact
     */
    readonly company?: string;
    /**
     * The department of the contact
     */
    readonly department?: string;
    /**
     * The title of the contact
     */
    readonly title?: string;
    /**
     * @override
     * @internal
     */
    get _type(): "org";
    /**
     * Builds an organization object for a contact
     *
     * @param company - Name of the contact's company
     * @param department - Name of the contact's department
     * @param title - Contact's business title
     */
    constructor(company?: string, department?: string, title?: string);
}
/**
 * Phone API object
 *
 * @group Contacts
 */
export declare class Phone extends ContactMultipleComponent {
    /**
     * The phone number of the contact
     */
    readonly phone?: string;
    /**
     * The type of the phone number
     */
    readonly type?: string;
    /**
     * The WhatsApp ID of the contact
     */
    readonly wa_id?: string;
    /**
     * @override
     * @internal
     */
    get _type(): "phones";
    /**
     * Builds a phone object for a contact.
     * A contact can contain multiple phones objects.
     *
     * @param phone - Phone number, automatically populated with the wa_id value as a formatted phone number
     * @param type - Phone type. Standard Values: CELL, MAIN, IPHONE, HOME, WORK
     * @param wa_id - WhatsApp ID
     */
    constructor(phone?: string, type?: string, wa_id?: string);
}
/**
 * Url API object
 *
 * @group Contacts
 */
export declare class Url extends ContactMultipleComponent {
    /**
     * The URL of the contact
     */
    readonly url?: string;
    /**
     * The type of the URL
     */
    readonly type?: string;
    /**
     * @override
     * @internal
     */
    get _type(): "urls";
    /**
     * Builds an url object for a contact.
     * A contact can contain multiple urls objects.
     *
     * @param url - URL
     * @param type - URL type. Standard Values: HOME, WORK
     */
    constructor(url?: string, type?: string);
}
//# sourceMappingURL=contacts.d.ts.map