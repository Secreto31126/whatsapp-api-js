/**
 * Contacts API object
 *
 * @property {Array<Object>} contacts The contacts of the message
 * @property {String} [_] The type of the object, for internal use only
 */
export class Contacts {
    /**
     * Create a Contacts object for the API
     *
     * @param {...Array<(Address|Birthday|Email|Name|Organization|Phone|Url)>} contact Array of contact's components
     * @throws {Error} If contact is not provided
     * @throws {Error} If contact contains more than one name component
     * @throws {Error} If contact contains more than one birthday component
     * @throws {Error} If contact contains more than one organization component
     */
    constructor(...contact: Array<(Address | Birthday | Email | Name | Organization | Phone | Url)>[]);
    contacts: {}[];
    _: string;
}
/**
 * Address API object
 *
 * @property {String} [country] The country of the address
 * @property {String} [country_code] The country code of the address
 * @property {String} [state] The state of the address
 * @property {String} [city] The city of the address
 * @property {String} [street] The street of the address
 * @property {String} [zip] The zip code of the address
 * @property {String} [type] The type of the address
 * @property {String} [_] The type of the object, for internal use only
 */
export class Address {
    /**
     * Builds an address object for a contact.
     * A contact can contain multiple addresses objects.
     *
     * @param {String} [country] Full country name
     * @param {String} [country_code] Two-letter country abbreviation
     * @param {String} [state] State abbreviation
     * @param {String} [city] City name
     * @param {String} [street] Street number and name
     * @param {String} [zip] ZIP code
     * @param {String} [type] Address type. Standard Values: HOME, WORK
     */
    constructor(country?: string, country_code?: string, state?: string, city?: string, street?: string, zip?: string, type?: string);
    country: string;
    country_code: string;
    state: string;
    city: string;
    street: string;
    zip: string;
    type: string;
    _: string;
}
/**
 * Birthday API object
 *
 * @property {String} birthday The birthday of the contact
 * @property {String} [_] The type of the object, for internal use only
 */
export class Birthday {
    /**
     * Builds a birthday object for a contact
     *
     * @param {String} year Year of birth (YYYY)
     * @param {String} month Month of birth (MM)
     * @param {String} day Day of birth (DD)
     * @throws {Error} If the year, month, or day don't have a valid length
     */
    constructor(year: string, month: string, day: string);
    birthday: string;
    _: string;
}
/**
 * Email API object
 *
 * @property {String} [email] The email of the contact
 * @property {String} [type] The type of the email
 * @property {String} [_] The type of the object, for internal use only
 */
export class Email {
    /**
     * Builds an email object for a contact.
     * A contact can contain multiple emails objects.
     *
     * @param {String} [email] Email address
     * @param {String} [type] Email type. Standard Values: HOME, WORK
     */
    constructor(email?: string, type?: string);
    email: string;
    type: string;
    _: string;
}
/**
 * Name API object
 *
 * @property {String} formatted_name The formatted name of the contact
 * @property {String} [first_name] The first name of the contact
 * @property {String} [last_name] The last name of the contact
 * @property {String} [middle_name] The middle name of the contact
 * @property {String} [suffix] The suffix of the contact
 * @property {String} [prefix] The prefix of the contact
 * @property {String} [_] The type of the object, for internal use only
 */
export class Name {
    /**
     * Builds a name object for a contact, required for contacts.
     * The object requires a formatted_name and at least another property.
     *
     * @param {String} formatted_name Full name, as it normally appears
     * @param {String} [first_name] First name
     * @param {String} [last_name] Last name
     * @param {String} [middle_name] Middle name
     * @param {String} [suffix] Name suffix
     * @param {String} [prefix] Name prefix
     * @throws {Error} If formatted_name is not defined
     * @throws {Error} If no other component apart from formatted_name is defined
     */
    constructor(formatted_name: string, first_name?: string, last_name?: string, middle_name?: string, suffix?: string, prefix?: string);
    formatted_name: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    suffix: string;
    prefix: string;
    _: string;
}
/**
 * Organization API object
 *
 * @property {String} [company] The company of the contact
 * @property {String} [department] The department of the contact
 * @property {String} [title] The title of the contact
 * @property {String} [_] The type of the object, for internal use only
 */
export class Organization {
    /**
     * Builds an organization object for a contact
     *
     * @param {String} [company] Name of the contact's company
     * @param {String} [department] Name of the contact's department
     * @param {String} [title] Contact's business title
     */
    constructor(company?: string, department?: string, title?: string);
    company: string;
    department: string;
    title: string;
    _: string;
}
/**
 * Phone API object
 *
 * @property {String} [phone] The phone number of the contact
 * @property {String} [type] The type of the phone number
 * @property {String} [wa_id] The WhatsApp ID of the contact
 * @property {String} [_] The type of the object, for internal use only
 */
export class Phone {
    /**
     * Builds a phone object for a contact.
     * A contact can contain multiple phones objects.
     *
     * @param {String} [phone] Phone number, automatically populated with the wa_id value as a formatted phone number
     * @param {String} [type] Phone type. Standard Values: CELL, MAIN, IPHONE, HOME, WORK
     * @param {String} [wa_id] WhatsApp ID
     */
    constructor(phone?: string, type?: string, wa_id?: string);
    phone: string;
    type: string;
    wa_id: string;
    _: string;
}
/**
 * Url API object
 *
 * @property {String} [url] The URL of the contact
 * @property {String} [type] The type of the URL
 * @property {String} [_] The type of the object, for internal use only
 */
export class Url {
    /**
     * Builds an url object for a contact.
     * A contact can contain multiple urls objects.
     *
     * @param {String} [url] URL
     * @param {String} [type] URL type. Standard Values: HOME, WORK
     */
    constructor(url?: string, type?: string);
    url: string;
    type: string;
    _: string;
}
//# sourceMappingURL=contacts.d.ts.map