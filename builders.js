/**
 * Turns the contacts components into something the API can understand
 * 
 * @param  {...Array} contactsList Array of arrays of contact components
 * @returns {Object} The contacts objects, each contact contained in Object.contacts array
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
function interactive(type, action, body, header = undefined, footer = undefined) {

}

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

function location(longitude, latitude, name = undefined, address = undefined) {
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

function media(type, media, isItAnID = false, caption = undefined, filename = undefined) {
    const object = {};
    if (isItAnID) object.id = media; else object.link = media;
    if (caption) object.caption = caption;
    if (filename) object.filename = filename;
    return {
        [type]: JSON.stringify(object)
    };
}

function text(body, preview_url = false) {
    return {
        text: JSON.stringify({
            body,
            preview_url
        })
    };
}

exports.builder = { text, media, location, contacts };
