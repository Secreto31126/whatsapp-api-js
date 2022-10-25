/**
 * Contacts API object
 *
 * @property {Array<Object>} contacts The contacts of the message
 * @property {String} [_] The type of the object, for internal use only
 */
class Contacts {
    /**
     * Create a Contacts object for the API
     *
     * @param {...Array<(Address|Birthday|Email|Name|Organization|Phone|Url)>} contact Array of contact's components
     * @throws {Error} If contact is not provided
     * @throws {Error} If contact contains more than one name component
     * @throws {Error} If contact contains more than one birthday component
     * @throws {Error} If contact contains more than one organization component
     */
    constructor(...contact) {
        if (!contact.length)
            throw new Error("Contacts must have at least one contact");

        this.contacts = [];

        for (const components of contact) {
            const contact = {};

            for (const component of components) {
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
                    if (!contact[name]) contact[name] = [];
                    contact[name].push(component);
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
 * @property {String} [country] The country of the address
 * @property {String} [country_code] The country code of the address
 * @property {String} [state] The state of the address
 * @property {String} [city] The city of the address
 * @property {String} [street] The street of the address
 * @property {String} [zip] The zip code of the address
 * @property {String} [type] The type of the address
 * @property {String} [_] The type of the object, for internal use only
 */
class Address {
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
    constructor(country, country_code, state, city, street, zip, type) {
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
 * @property {String} birthday The birthday of the contact
 * @property {String} [_] The type of the object, for internal use only
 */
class Birthday {
    /**
     * Builds a birthday object for a contact
     *
     * @param {String} year Year of birth (YYYY)
     * @param {String} month Month of birth (MM)
     * @param {String} day Day of birth (DD)
     * @throws {Error} If the year, month, or day don't have a valid length
     */
    constructor(year, month, day) {
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
 * @property {String} [email] The email of the contact
 * @property {String} [type] The type of the email
 * @property {String} [_] The type of the object, for internal use only
 */
class Email {
    /**
     * Builds an email object for a contact.
     * A contact can contain multiple emails objects.
     *
     * @param {String} [email] Email address
     * @param {String} [type] Email type. Standard Values: HOME, WORK
     */
    constructor(email, type) {
        if (email) this.email = email;
        if (type) this.type = type;
        this._ = "emails";
    }
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
class Name {
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
    constructor(
        formatted_name,
        first_name,
        last_name,
        middle_name,
        suffix,
        prefix
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
 * @property {String} [company] The company of the contact
 * @property {String} [department] The department of the contact
 * @property {String} [title] The title of the contact
 * @property {String} [_] The type of the object, for internal use only
 */
class Organization {
    /**
     * Builds an organization object for a contact
     *
     * @param {String} [company] Name of the contact's company
     * @param {String} [department] Name of the contact's department
     * @param {String} [title] Contact's business title
     */
    constructor(company, department, title) {
        if (company) this.company = company;
        if (department) this.department = department;
        if (title) this.title = title;
        this._ = "org";
    }
}

/**
 * Phone API object
 *
 * @property {String} [phone] The phone number of the contact
 * @property {String} [type] The type of the phone number
 * @property {String} [wa_id] The WhatsApp ID of the contact
 * @property {String} [_] The type of the object, for internal use only
 */
class Phone {
    /**
     * Builds a phone object for a contact.
     * A contact can contain multiple phones objects.
     *
     * @param {String} [phone] Phone number, automatically populated with the wa_id value as a formatted phone number
     * @param {String} [type] Phone type. Standard Values: CELL, MAIN, IPHONE, HOME, WORK
     * @param {String} [wa_id] WhatsApp ID
     */
    constructor(phone, type, wa_id) {
        if (phone) this.phone = phone;
        if (type) this.type = type;
        if (wa_id) this.wa_id = wa_id;
        this._ = "phones";
    }
}

/**
 * Url API object
 *
 * @property {String} [url] The URL of the contact
 * @property {String} [type] The type of the URL
 * @property {String} [_] The type of the object, for internal use only
 */
class Url {
    /**
     * Builds an url object for a contact.
     * A contact can contain multiple urls objects.
     *
     * @param {String} [url] URL
     * @param {String} [type] URL type. Standard Values: HOME, WORK
     */
    constructor(url, type) {
        if (url) this.url = url;
        if (type) this.type = type;
        this._ = "urls";
    }
}

module.exports = {
    Contacts,
    Address,
    Birthday,
    Email,
    Name,
    Organization,
    Phone,
    Url
};
