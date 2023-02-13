type BuiltContact = {
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
 */
export class Contacts {
    /**
     * The contacts of the message
     */
    contacts: BuiltContact[];
    /**
     * The type of the object
     * @internal
     */
    _?: "contacts";

    /**
     * Create a Contacts object for the API
     *
     * @param contact - Array of contact's components
     * @throws If contact is not provided
     * @throws If contact does not contain a name component
     * @throws If contact contains more than one name component
     * @throws If contact contains more than one birthday component
     * @throws If contact contains more than one organization component
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
            const contact = {} as BuiltContact;

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
 */
export class Address {
    /**
     * The country of the address
     */
    country?: string;
    /**
     * The country code of the address
     */
    country_code?: string;
    /**
     * The state of the address
     */
    state?: string;
    /**
     * The city of the address
     */
    city?: string;
    /**
     * The street of the address
     */
    street?: string;
    /**
     * The zip code of the address
     */
    zip?: string;
    /**
     * The type of the address
     */
    type?: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "addresses";

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
 */
export class Birthday {
    /**
     * The birthday of the contact
     */
    birthday: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "birthday";

    /**
     * Builds a birthday object for a contact
     *
     * @param year - Year of birth (YYYY)
     * @param month - Month of birth (MM)
     * @param day - Day of birth (DD)
     * @throws If the year, month, or day don't have a valid length
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
 */
export class Email {
    /**
     * The email of the contact
     */
    email?: string;
    /**
     * The type of the email
     */
    type?: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "emails";

    /**
     * Builds an email object for a contact.
     * A contact can contain multiple emails objects.
     *
     * @param email - Email address
     * @param type - Email type. Standard Values: HOME, WORK
     */
    constructor(email?: string, type?: string) {
        if (email) this.email = email;
        if (type) this.type = type;
        this._ = "emails";
    }
}

/**
 * Name API object
 */
export class Name {
    /**
     * The formatted name of the contact
     */
    formatted_name: string;
    /**
     * The first name of the contact
     */
    first_name?: string;
    /**
     * The last name of the contact
     */
    last_name?: string;
    /**
     * The middle name of the contact
     */
    middle_name?: string;
    /**
     * The suffix of the contact
     */
    suffix?: string;
    /**
     * The prefix of the contact
     */
    prefix?: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "name";

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
     * @throws If formatted_name is not defined
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
 */
export class Organization {
    /**
     * The company of the contact
     */
    company?: string;
    /**
     * The department of the contact
     */
    department?: string;
    /**
     * The title of the contact
     */
    title?: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "org";

    /**
     * Builds an organization object for a contact
     *
     * @param company - Name of the contact's company
     * @param department - Name of the contact's department
     * @param title - Contact's business title
     */
    constructor(company?: string, department?: string, title?: string) {
        if (company) this.company = company;
        if (department) this.department = department;
        if (title) this.title = title;
        this._ = "org";
    }
}

/**
 * Phone API object
 */
export class Phone {
    /**
     * The phone number of the contact
     */
    phone?: string;
    /**
     * The type of the phone number
     */
    type?: string;
    /**
     * The WhatsApp ID of the contact
     */
    wa_id?: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "phones";

    /**
     * Builds a phone object for a contact.
     * A contact can contain multiple phones objects.
     *
     * @param phone - Phone number, automatically populated with the wa_id value as a formatted phone number
     * @param type - Phone type. Standard Values: CELL, MAIN, IPHONE, HOME, WORK
     * @param wa_id - WhatsApp ID
     */
    constructor(phone?: string, type?: string, wa_id?: string) {
        if (phone) this.phone = phone;
        if (type) this.type = type;
        if (wa_id) this.wa_id = wa_id;
        this._ = "phones";
    }
}

/**
 * Url API object
 */
export class Url {
    /**
     * The URL of the contact
     */
    url?: string;
    /**
     * The type of the URL
     */
    type?: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "urls";

    /**
     * Builds an url object for a contact.
     * A contact can contain multiple urls objects.
     *
     * @param url - URL
     * @param type - URL type. Standard Values: HOME, WORK
     */
    constructor(url?: string, type?: string) {
        if (url) this.url = url;
        if (type) this.type = type;
        this._ = "urls";
    }
}
