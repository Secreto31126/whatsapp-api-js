import {
    ClientMessage,
    type ContactComponent,
    ContactUniqueComponent,
    ContactMultipleComponent
} from "../types.js";
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
export class Contacts extends ClientMessage {
    /**
     * The contacts of the message
     */
    readonly component: BuiltContact[];

    get _type(): "contacts" {
        return "contacts";
    }

    /**
     * Create a Contacts object for the API
     *
     * @param contact - Array of contact's components
     * @throws If contact contains multiple of the same components and _many is set to false (for example, Name, Birthday and Organization)
     */
    constructor(
        ...contact: AtLeastOne<
            Array<
                | Address
                | Birthday
                | Email
                | Name
                | Organization
                | Phone
                | Url
                | ContactComponent
            >
        >
    ) {
        super();

        this.component = [];

        for (const components of contact) {
            const contact = {} as BuiltContact;

            for (const component of components) {
                const name = component._type as keyof typeof contact;

                if (component._many) {
                    if (!(name in contact)) {
                        Object.defineProperty(contact, name, {
                            value: [] as Address[] | Email[] | Phone[] | Url[]
                        });
                    }

                    const pointer = contact[name] as (typeof component)[];
                    pointer.push(component._build() as ContactComponent);
                } else {
                    if (name in contact)
                        throw new Error(
                            `Contact already has a ${name} component and _many is set to false`
                        );

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore - TS doesn't know that contact[name] will match the type of the built component
                    contact[name] =
                        // reduce ts-ignore impact
                        component._build() as Exclude<
                            (typeof contact)[keyof typeof contact],
                            undefined
                        >;
                }
            }

            if (!contact.name)
                throw new Error("Contact must have a name component");

            this.component.push(contact);
        }
    }

    /**
     * @override
     */
    _build() {
        return JSON.stringify(this.component);
    }
}

/**
 * Address API object
 *
 * @group Contacts
 */
export class Address extends ContactMultipleComponent {
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
     */
    get _type(): "addresses" {
        return "addresses";
    }

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
    constructor(
        country?: string,
        country_code?: string,
        state?: string,
        city?: string,
        street?: string,
        zip?: string,
        type?: string
    ) {
        super();
        if (country) this.country = country;
        if (country_code) this.country_code = country_code;
        if (state) this.state = state;
        if (city) this.city = city;
        if (street) this.street = street;
        if (zip) this.zip = zip;
        if (type) this.type = type;
    }
}

/**
 * Birthday API object
 *
 * @group Contacts
 */
export class Birthday extends ContactUniqueComponent {
    /**
     * The birthday of the contact
     */
    readonly birthday: string;

    /**
     * @override
     */
    get _type(): "birthday" {
        return "birthday";
    }

    /**
     * Builds a birthday object for a contact
     *
     * @param year - Year of birth (YYYY)
     * @param month - Month of birth (MM)
     * @param day - Day of birth (DD)
     * @throws If the year, month, or day doesn't have a valid length
     */
    constructor(year: string, month: string, day: string) {
        super();
        if (year.length !== 4) throw new Error("Year must be 4 digits");
        if (month.length !== 2) throw new Error("Month must be 2 digits");
        if (day.length !== 2) throw new Error("Day must be 2 digits");
        this.birthday = `${year}-${month}-${day}`;
    }

    /**
     * @override
     */
    _build() {
        return this.birthday;
    }
}

/**
 * Email API object
 *
 * @group Contacts
 */
export class Email extends ContactMultipleComponent {
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
     */
    get _type(): "emails" {
        return "emails";
    }

    /**
     * Builds an email object for a contact.
     * A contact can contain multiple emails objects.
     *
     * @param email - Email address
     * @param type - Email type. Standard Values: HOME, WORK
     */
    constructor(email?: string, type?: string) {
        super();
        if (email) this.email = email;
        if (type) this.type = type;
    }
}

/**
 * Name API object
 *
 * @group Contacts
 */
export class Name extends ContactUniqueComponent {
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
     */
    get _type(): "name" {
        return "name";
    }

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
    constructor(
        formatted_name: string,
        first_name?: string,
        last_name?: string,
        middle_name?: string,
        suffix?: string,
        prefix?: string
    ) {
        super();

        this.formatted_name = formatted_name;
        if (first_name) this.first_name = first_name;
        if (last_name) this.last_name = last_name;
        if (middle_name) this.middle_name = middle_name;
        if (suffix) this.suffix = suffix;
        if (prefix) this.prefix = prefix;

        if (Object.keys(this).length < 2) {
            throw new Error(
                "Name must have at least one of the following: first_name, last_name, middle_name, prefix, suffix"
            );
        }
    }
}

/**
 * Organization API object
 *
 * @group Contacts
 */
export class Organization extends ContactUniqueComponent {
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
     */
    get _type(): "org" {
        return "org";
    }

    /**
     * Builds an organization object for a contact
     *
     * @param company - Name of the contact's company
     * @param department - Name of the contact's department
     * @param title - Contact's business title
     */
    constructor(company?: string, department?: string, title?: string) {
        super();
        if (company) this.company = company;
        if (department) this.department = department;
        if (title) this.title = title;
    }
}

/**
 * Phone API object
 *
 * @group Contacts
 */
export class Phone extends ContactMultipleComponent {
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
     */
    get _type(): "phones" {
        return "phones";
    }

    /**
     * Builds a phone object for a contact.
     * A contact can contain multiple phones objects.
     *
     * @param phone - Phone number, automatically populated with the wa_id value as a formatted phone number
     * @param type - Phone type. Standard Values: CELL, MAIN, IPHONE, HOME, WORK
     * @param wa_id - WhatsApp ID
     */
    constructor(phone?: string, type?: string, wa_id?: string) {
        super();
        if (phone) this.phone = phone;
        if (type) this.type = type;
        if (wa_id) this.wa_id = wa_id;
    }
}

/**
 * Url API object
 *
 * @group Contacts
 */
export class Url extends ContactMultipleComponent {
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
     */
    get _type(): "urls" {
        return "urls";
    }

    /**
     * Builds an url object for a contact.
     * A contact can contain multiple urls objects.
     *
     * @param url - URL
     * @param type - URL type. Standard Values: HOME, WORK
     */
    constructor(url?: string, type?: string) {
        super();
        if (url) this.url = url;
        if (type) this.type = type;
    }
}
