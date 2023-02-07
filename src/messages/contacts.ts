type Contact = {
    name: Name;
    birthday?: string;
    org?: Organization;
    addresses?: Address[];
    phones?: Phone[];
    emails?: Email[];
    urls?: Url[];
};

/**
 * Contacts API object
 *
 * @property {Array<Contact>} contacts The contacts of the message
 * @property {"contacts"} [_] The type of the object, for internal use only
 */
export class Contacts {
    contacts: Contact[];
    _?: "contacts";

    /**
     * Create a Contacts object for the API
     *
     * @param {...Array<(Address|Birthday|Email|Name|Organization|Phone|Url)>} contact Array of contact's components
     * @throws {Error} If contact is not provided
     * @throws {Error} If contact does not contain a name component
     * @throws {Error} If contact contains more than one name component
     * @throws {Error} If contact contains more than one birthday component
     * @throws {Error} If contact contains more than one organization component
     */
    constructor(
        ...contact: Array<
            Address | Birthday | Email | Name | Organization | Phone | Url
        >[]
    ) {
        if (!contact.length)
            throw new Error("Contacts must have at least one contact");

        this.contacts = [];

        for (const components of contact) {
            const contact = {} as Contact;

            for (const component of components) {
                if (!component._)
                    throw new Error(
                        "Unexpected internal error (component._ is not defined)"
                    );

                const name = component._;
                delete component._;

                if (component instanceof Birthday)
                    if (!contact.birthday)
                        contact.birthday = component.birthday;
                    else
                        throw new Error(
                            "Contacts can only have one birthday component"
                        );
                else if (component instanceof Name)
                    if (!contact.name) contact.name = component;
                    else
                        throw new Error(
                            "Contacts can only have one name component"
                        );
                else if (component instanceof Organization)
                    if (!contact.org) contact.org = component;
                    else
                        throw new Error(
                            "Contacts can only have one organization component"
                        );
                else {
                    if (!(name in contact)) {
                        Object.defineProperty(contact, name, {
                            value: [] as Address[] | Email[] | Phone[] | Url[]
                        });
                    }

                    // TypeScript doesn't know that contact[name] is an array
                    const pointer = contact[name] as typeof component[];
                    pointer.push(component);
                }
            }

            if (!contact.name)
                throw new Error("Contact must have a name component");

            this.contacts.push(contact);
        }

        this._ = "contacts";
    }
}

/**
 * Address API object
 *
 * @property {string} [country] The country of the address
 * @property {string} [country_code] The country code of the address
 * @property {string} [state] The state of the address
 * @property {string} [city] The city of the address
 * @property {string} [street] The street of the address
 * @property {string} [zip] The zip code of the address
 * @property {string} [type] The type of the address
 * @property {"addresses"} [_] The type of the object, for internal use only
 */
export class Address {
    country?: string;
    country_code?: string;
    state?: string;
    city?: string;
    street?: string;
    zip?: string;
    type?: string;
    _?: "addresses";

    /**
     * Builds an address object for a contact.
     * A contact can contain multiple addresses objects.
     *
     * @param {string} [country] Full country name
     * @param {string} [country_code] Two-letter country abbreviation
     * @param {string} [state] State abbreviation
     * @param {string} [city] City name
     * @param {string} [street] Street number and name
     * @param {string} [zip] ZIP code
     * @param {string} [type] Address type. Standard Values: HOME, WORK
     */
    constructor(
        country: string,
        country_code: string,
        state: string,
        city: string,
        street: string,
        zip: string,
        type: string
    ) {
        if (country) this.country = country;
        if (country_code) this.country_code = country_code;
        if (state) this.state = state;
        if (city) this.city = city;
        if (street) this.street = street;
        if (zip) this.zip = zip;
        if (type) this.type = type;
        this._ = "addresses";
    }
}

/**
 * Birthday API object
 *
 * @property {string} birthday The birthday of the contact
 * @property {"birthday"} [_] The type of the object, for internal use only
 */
export class Birthday {
    birthday: string;
    _?: "birthday";

    /**
     * Builds a birthday object for a contact
     *
     * @param {string} year Year of birth (YYYY)
     * @param {string} month Month of birth (MM)
     * @param {string} day Day of birth (DD)
     * @throws {Error} If the year, month, or day don't have a valid length
     */
    constructor(year: string, month: string, day: string) {
        if (year?.length !== 4) throw new Error("Year must be 4 digits");
        if (month?.length !== 2) throw new Error("Month must be 2 digits");
        if (day?.length !== 2) throw new Error("Day must be 2 digits");
        this.birthday = `${year}-${month}-${day}`;
        this._ = "birthday";
    }
}

/**
 * Email API object
 *
 * @property {string} [email] The email of the contact
 * @property {string} [type] The type of the email
 * @property {"emails"} [_] The type of the object, for internal use only
 */
export class Email {
    email?: string;
    type?: string;
    _?: "emails";

    /**
     * Builds an email object for a contact.
     * A contact can contain multiple emails objects.
     *
     * @param {string} [email] Email address
     * @param {string} [type] Email type. Standard Values: HOME, WORK
     */
    constructor(email: string, type: string) {
        if (email) this.email = email;
        if (type) this.type = type;
        this._ = "emails";
    }
}

/**
 * Name API object
 *
 * @property {string} formatted_name The formatted name of the contact
 * @property {string} [first_name] The first name of the contact
 * @property {string} [last_name] The last name of the contact
 * @property {string} [middle_name] The middle name of the contact
 * @property {string} [suffix] The suffix of the contact
 * @property {string} [prefix] The prefix of the contact
 * @property {"name"} [_] The type of the object, for internal use only
 */
export class Name {
    formatted_name: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    suffix?: string;
    prefix?: string;
    _?: "name";

    /**
     * Builds a name object for a contact, required for contacts.
     * The object requires a formatted_name and at least another property.
     *
     * @param {string} formatted_name Full name, as it normally appears
     * @param {string} [first_name] First name
     * @param {string} [last_name] Last name
     * @param {string} [middle_name] Middle name
     * @param {string} [suffix] Name suffix
     * @param {string} [prefix] Name prefix
     * @throws {Error} If formatted_name is not defined
     * @throws {Error} If no other component apart from formatted_name is defined
     */
    constructor(
        formatted_name: string,
        first_name: string,
        last_name: string,
        middle_name: string,
        suffix: string,
        prefix: string
    ) {
        if (!formatted_name) throw new Error("Name must have a formatted_name");

        this.formatted_name = formatted_name;
        if (first_name) this.first_name = first_name;
        if (last_name) this.last_name = last_name;
        if (middle_name) this.middle_name = middle_name;
        if (suffix) this.suffix = suffix;
        if (prefix) this.prefix = prefix;

        if (Object.keys(this).length < 2)
            throw new Error(
                "Name must have at least one of the following: first_name, last_name, middle_name, prefix, suffix"
            );
        this._ = "name";
    }
}

/**
 * Organization API object
 *
 * @property {string} [company] The company of the contact
 * @property {string} [department] The department of the contact
 * @property {string} [title] The title of the contact
 * @property {"org"} [_] The type of the object, for internal use only
 */
export class Organization {
    company?: string;
    department?: string;
    title?: string;
    _?: "org";

    /**
     * Builds an organization object for a contact
     *
     * @param {string} [company] Name of the contact's company
     * @param {string} [department] Name of the contact's department
     * @param {string} [title] Contact's business title
     */
    constructor(company: string, department: string, title: string) {
        if (company) this.company = company;
        if (department) this.department = department;
        if (title) this.title = title;
        this._ = "org";
    }
}

/**
 * Phone API object
 *
 * @property {string} [phone] The phone number of the contact
 * @property {string} [type] The type of the phone number
 * @property {string} [wa_id] The WhatsApp ID of the contact
 * @property {"phones"} [_] The type of the object, for internal use only
 */
export class Phone {
    phone?: string;
    type?: string;
    wa_id?: string;
    _?: "phones";

    /**
     * Builds a phone object for a contact.
     * A contact can contain multiple phones objects.
     *
     * @param {string} [phone] Phone number, automatically populated with the wa_id value as a formatted phone number
     * @param {string} [type] Phone type. Standard Values: CELL, MAIN, IPHONE, HOME, WORK
     * @param {string} [wa_id] WhatsApp ID
     */
    constructor(phone: string, type: string, wa_id: string) {
        if (phone) this.phone = phone;
        if (type) this.type = type;
        if (wa_id) this.wa_id = wa_id;
        this._ = "phones";
    }
}

/**
 * Url API object
 *
 * @property {string} [url] The URL of the contact
 * @property {string} [type] The type of the URL
 * @property {"urls"} [_] The type of the object, for internal use only
 */
export class Url {
    url?: string;
    type?: string;
    _?: "urls";

    /**
     * Builds an url object for a contact.
     * A contact can contain multiple urls objects.
     *
     * @param {string} [url] URL
     * @param {string} [type] URL type. Standard Values: HOME, WORK
     */
    constructor(url: string, type: string) {
        if (url) this.url = url;
        if (type) this.type = type;
        this._ = "urls";
    }
}
