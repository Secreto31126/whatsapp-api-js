class addresses {
    /**
     * Builds an address object for a contact
     * 
     * @param {String} country Full country name
     * @param {String} country_code Two-letter country abbreviation
     * @param {String} state State abbreviation
     * @param {String} city City name
     * @param {String} street Street number and name
     * @param {(String|Number)} zip ZIP code
     * @param {String} type Address type. Standard Values: HOME, WORK
     */
    constructor(country, country_code, state, city, street, zip, type) {
        if (country) this.country = country;
        if (country_code) this.country_code = country_code;
        if (state) this.state = state;
        if (city) this.city = city;
        if (street) this.street = street;
        if (zip) this.zip = zip;
        if (type) this.type = type;
    }
}

class birthday {
    /**
     * Builds a birthday object for a contact
     * 
     * @param {String} year Year of birth
     * @param {String} month Month of birth
     * @param {String} day Day of birth
     */
    constructor(year, month, day) {
        if (year.length !== 4) throw new Error("Year must be 4 digits");
        if (month.length !== 2) throw new Error("Month must be 2 digits");
        if (day.length !== 2) throw new Error("Day must be 2 digits");
        this.birthday = `${year}-${month}-${day}`;
    }
}

class emails {
    /**
     * Builds an email object for a contact
     * 
     * @param {String} email Email address
     * @param {String} type Email type. Standard Values: HOME, WORK
     */
    constructor(email, type) {
        if (email) this.email = email;
        if (type) this.type = type;
    }
}

class name {
    /**
     * Builds a name object for a contact, required for the contact
     * 
     * @param {String} formatted_name Full name, as it normally appears
     * @param {String} first_name First name
     * @param {String} last_name Last name
     * @param {String} middle_name Middle name
     * @param {String} suffix Name suffix
     * @param {String} prefix Name prefix
     */
    constructor(formatted_name, first_name, last_name, middle_name, suffix, prefix) {
        if (!formatted_name) throw new Error("Name must have a formatted_name");

        this.formatted_name = formatted_name;
        if (first_name) this.first_name = first_name;
        if (last_name) this.last_name = last_name;
        if (middle_name) this.middle_name = middle_name;
        if (suffix) this.suffix = suffix;
        if (prefix) this.prefix = prefix;

        if (Object.keys(this).length < 2) throw new Error("Name must have at least one of the following: first_name, last_name, middle_name, prefix, suffix");
    }
}

class org {
    /**
     * Builds an organization object for a contact
     * 
     * @param {String} company Name of the contact's company
     * @param {String} department Name of the contact's department
     * @param {String} title Contact's business title
     */
    constructor(company, department, title) {
        if (company) this.company = company;
        if (department) this.department = department;
        if (title) this.title = title;
    }
}

class phones {
    /**
     * Builds a phone object for a contact
     * 
     * @param {String} number Phone number
     * @param {String} type Phone type. Standard Values: CELL, MAIN, IPHONE, HOME, WORK
     * @param {String} wa_id WhatsApp ID. If present, number will be ignored. Usually it's the numeric part of the phone number
     */
    constructor(number, type, wa_id) {
        if (number && !wa_id) this.number = number;
        if (type) this.type = type;
        if (wa_id) this.wa_id = wa_id;
    }
}

class urls {
    /**
     * Builds a url object for a contact
     * 
     * @param {String} url URL
     * @param {String} type URL type. Standard Values: HOME, WORK
     */
    constructor(url, type) {
        if (url) this.url = url;
        if (type) this.type = type;
    }
}

exports.contacts = { addresses, birthday, emails, name, org, phones, urls };
