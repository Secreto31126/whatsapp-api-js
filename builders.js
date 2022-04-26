/**
 * Create an API compatible contacts element
 * 
 * @param {Array} contactsList Array of arrays of contact components
 * @returns {Object} The API compatible contacts objects
 */
function contacts(contactsList) {
    const contacts = [];

    for (const c of contactsList) {
        const contact = {};

        for (const el of c) {
            const name = el.constructor.name;
        
            if (name === "birthday") contact.birthday = el.birthday;
            else if (name === "name") contact.name = el;
            else if (name === "org") contact.org = el;
        
            else {
                if (!contact[name]) contact[name] = [];
                contact[name].push(el);
            }
        }

        if (!contact.name) throw new Error("Contact must have a name object");
        contacts.push(contact);
    }
    
    return {
        contacts: JSON.stringify(contacts)
    };
}

/**
 * 
 * @param {String} type The interactive type, can be either 
 * @param {Object} action The action object, can be either
 * @param {String} body The body of the message
 * @param {Object} header The header of the message
 * @param {String} footer The footer of the message
 */
// function interactive(type, action, body, header = undefined, footer = undefined) {}

// function action(type, button, buttons, sections) {
//     return {
//         action: {
//             button,
//             buttons,
//             sections
//         }
//     };
// }

// function body(text) {
//     return JSON.stringify({ text });
// }

// function footer(text) {
//     return JSON.stringify({ text });
// }

// function header(type, param) {
//     return JSON.stringify({
//         [type]: param
//     });
// }

/**
 * Create an API compatible location element
 * 
 * @param {Number} longitude
 * @param {Number} latitude
 * @param {String} name
 * @param {String} address
 * @returns {Object} The API compatible location object
 */
function location(longitude, latitude, name, address) {
    const location = {
        longitude,
        latitude
    };
    if (name) location.name = name;
    if (address) location.address = address;
    return {
        location: JSON.stringify(location)
    };
}

/**
 * Create an API compatible media element
 * 
 * @param {String} type The type of media, can be either image, audio, video, document, sticker
 * @param {String} media The media's link or id
 * @param {Boolean} isItAnID Whether media is an id (true) or a link (false, default). Videos and stickers must use links.
 * @param {String} caption Describes the specified document or image media. Do not use with audio media.
 * @param {String} filename Describes the filename for the specific document. Use only with document media
 * @returns {Object} The API compatible media object
 */
function media(type, media, isItAnID = false, caption, filename) {
    const object = {};
    if (isItAnID) object.id = media; else object.link = media;
    if (caption) object.caption = caption;
    if (filename) object.filename = filename;
    return {
        [type]: JSON.stringify(object)
    };
}

/**
 * Create an API compatible text element
 * 
 * @param {String} body The text of the text message which can contain URLs which begin with http:// or https:// and formatting
 * @param {Boolean} preview_url Set this field to true if you want to include a URL preview box. Defaults to false.
 * @returns {Object} The API compatible text object
 */
function text(body, preview_url = false) {
    return {
        text: JSON.stringify({
            body,
            preview_url
        })
    };
}

exports.builder = { text, media, location, contacts };
