/**
 * Contacts API object
 *
 * @group Contacts
 */
export class Contacts {
    /**
     * The contacts of the message
     */
    component;
    get _type() {
        return "contacts";
    }
    /**
     * Create a Contacts object for the API
     *
     * @param contact - Array of contact's components
     * @throws If contact contains multiple of the same components and _many is set to false (for example, Name, Birthday and Organization)
     */
    constructor(...contact) {
        this.component = [];
        for (const components of contact) {
            const contact = {};
            for (const component of components) {
                const name = component._type;
                if (component._many) {
                    if (!(name in contact)) {
                        Object.defineProperty(contact, name, {
                            value: []
                        });
                    }
                    // TypeScript doesn't know that contact[name] is an array
                    const pointer = contact[name];
                    pointer.push(component._build());
                }
                else {
                    if (name in contact)
                        throw new Error(`Contact already has a ${name} component and _many is set to false`);
                    contact[name] = component._build();
                }
            }
            if (!contact.name)
                throw new Error("Contact must have a name component");
            this.component.push(contact);
        }
    }
    _build() {
        return JSON.stringify(this.component);
    }
}
/**
 * Address API object
 *
 * @group Contacts
 */
export class Address {
    /**
     * The country of the address
     */
    country;
    /**
     * The country code of the address
     */
    country_code;
    /**
     * The state of the address
     */
    state;
    /**
     * The city of the address
     */
    city;
    /**
     * The street of the address
     */
    street;
    /**
     * The zip code of the address
     */
    zip;
    /**
     * The type of the address
     */
    type;
    get _many() {
        return true;
    }
    get _type() {
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
    constructor(country, country_code, state, city, street, zip, type) {
        if (country)
            this.country = country;
        if (country_code)
            this.country_code = country_code;
        if (state)
            this.state = state;
        if (city)
            this.city = city;
        if (street)
            this.street = street;
        if (zip)
            this.zip = zip;
        if (type)
            this.type = type;
    }
    _build() {
        return this;
    }
}
/**
 * Birthday API object
 *
 * @group Contacts
 */
export class Birthday {
    /**
     * The birthday of the contact
     */
    birthday;
    get _many() {
        return false;
    }
    get _type() {
        return "birthday";
    }
    /**
     * Builds a birthday object for a contact
     *
     * @param year - Year of birth (YYYY)
     * @param month - Month of birth (MM)
     * @param day - Day of birth (DD)
     * @throws If the year, month, or day don't have a valid length
     */
    constructor(year, month, day) {
        if (year.length !== 4)
            throw new Error("Year must be 4 digits");
        if (month.length !== 2)
            throw new Error("Month must be 2 digits");
        if (day.length !== 2)
            throw new Error("Day must be 2 digits");
        this.birthday = `${year}-${month}-${day}`;
    }
    _build() {
        return this.birthday;
    }
}
/**
 * Email API object
 *
 * @group Contacts
 */
export class Email {
    /**
     * The email of the contact
     */
    email;
    /**
     * The type of the email
     */
    type;
    get _many() {
        return true;
    }
    get _type() {
        return "emails";
    }
    /**
     * Builds an email object for a contact.
     * A contact can contain multiple emails objects.
     *
     * @param email - Email address
     * @param type - Email type. Standard Values: HOME, WORK
     */
    constructor(email, type) {
        if (email)
            this.email = email;
        if (type)
            this.type = type;
    }
    _build() {
        return this;
    }
}
/**
 * Name API object
 *
 * @group Contacts
 */
export class Name {
    /**
     * The formatted name of the contact
     */
    formatted_name;
    /**
     * The first name of the contact
     */
    first_name;
    /**
     * The last name of the contact
     */
    last_name;
    /**
     * The middle name of the contact
     */
    middle_name;
    /**
     * The suffix of the contact
     */
    suffix;
    /**
     * The prefix of the contact
     */
    prefix;
    get _many() {
        return false;
    }
    get _type() {
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
    constructor(formatted_name, first_name, last_name, middle_name, suffix, prefix) {
        this.formatted_name = formatted_name;
        if (first_name)
            this.first_name = first_name;
        if (last_name)
            this.last_name = last_name;
        if (middle_name)
            this.middle_name = middle_name;
        if (suffix)
            this.suffix = suffix;
        if (prefix)
            this.prefix = prefix;
        if (Object.keys(this).length < 2) {
            throw new Error("Name must have at least one of the following: first_name, last_name, middle_name, prefix, suffix");
        }
    }
    _build() {
        return this;
    }
}
/**
 * Organization API object
 *
 * @group Contacts
 */
export class Organization {
    /**
     * The company of the contact
     */
    company;
    /**
     * The department of the contact
     */
    department;
    /**
     * The title of the contact
     */
    title;
    get _many() {
        return false;
    }
    get _type() {
        return "org";
    }
    /**
     * Builds an organization object for a contact
     *
     * @param company - Name of the contact's company
     * @param department - Name of the contact's department
     * @param title - Contact's business title
     */
    constructor(company, department, title) {
        if (company)
            this.company = company;
        if (department)
            this.department = department;
        if (title)
            this.title = title;
    }
    _build() {
        return this;
    }
}
/**
 * Phone API object
 *
 * @group Contacts
 */
export class Phone {
    /**
     * The phone number of the contact
     */
    phone;
    /**
     * The type of the phone number
     */
    type;
    /**
     * The WhatsApp ID of the contact
     */
    wa_id;
    get _many() {
        return true;
    }
    get _type() {
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
    constructor(phone, type, wa_id) {
        if (phone)
            this.phone = phone;
        if (type)
            this.type = type;
        if (wa_id)
            this.wa_id = wa_id;
    }
    _build() {
        return this;
    }
}
/**
 * Url API object
 *
 * @group Contacts
 */
export class Url {
    /**
     * The URL of the contact
     */
    url;
    /**
     * The type of the URL
     */
    type;
    get _many() {
        return true;
    }
    get _type() {
        return "urls";
    }
    /**
     * Builds an url object for a contact.
     * A contact can contain multiple urls objects.
     *
     * @param url - URL
     * @param type - URL type. Standard Values: HOME, WORK
     */
    constructor(url, type) {
        if (url)
            this.url = url;
        if (type)
            this.type = type;
    }
    _build() {
        return this;
    }
}
//# sourceMappingURL=contacts.js.map