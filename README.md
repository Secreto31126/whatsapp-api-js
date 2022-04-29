# whatsapp-api-js
A Whatsapp's Official API helper for Node.js (WIP)

## Disclaimers

 1. Whatsapp's Official API is currently on beta acccess.
To participate, you can fill [this form](https://www.facebook.com/business/m/whatsapp/business-api).

 2. This project is a work in progress. Breaking changes are expected from version to version until we hit version 1.0.0.

## Set up

First, you need a Facebook app with the Whatsapp API activated.
You can create your first app following [this steps](https://developers.facebook.com/docs/whatsapp/getting-started/signing-up).
Get the API token, either a temporal or a permanent one.

In your server you can install the module using npm:

```
npm install whatsapp-api-js
```

Now you can write code like this:

```js
const { WhatsAppAPI, Handlers } = require("whatsapp-api-js");
const { Text, Media, Contacts } = require("whatsapp-api-js").Types;

const Token = "YOUR_TOKEN";

const Whatsapp = new WhatsAppAPI(Token);

// Assuming post is called on a POST request to your server
function post(e) {
    // The Handlers work with any middleware, as long as you pass the correct data
    return Handlers.post(JSON.parse(e.data), onMessage);
}

function onMessage(phoneID, phone, message, name, raw_data) {
    if (message.type === "text") Whatsapp.sendMessage(phoneID, phone, new Text(`*${name}* said:\n\n${message.text.body}`));

    if (message.type === "image") Whatsapp.sendMessage(phoneID, phone, new Media.Image(message.image.id, true, `Nice photo, ${name}`));

    if (message.type === "document") Whatsapp.sendMessage(phoneID, phone, new Media.Document(message.document.id, true, undefined, "Our document"));

    if (message.type === "contacts") Whatsapp.sendMessage(phoneID, phone, new Contacts.Contacts(
        [
            new Contacts.Name(name, "First name", "Last name"),
            new Contacts.Phone(phone),
            new Contacts.Birthday("2022", "04", "25"),
        ],
        [
            new Contacts.Name("John", "First name", "Last name"),
            new Contacts.Organization("Company", "Department", "Title"),
            new Contacts.Url("https://www.google.com", "WORK"),
        ]
    ));
}
```

To recieve the post requests on message, you must setup the webhook at your Facebook app.
While setting up, you will be asked a Verify Token. This can be any string you want.

The app also has a GET wizard for the webhook authentication:

```js
const { Handlers } = require("whatsapp-api-js");

// Assuming get is called on a GET request to your server
function get(e) {
    // The Handlers work with any middleware, as long as you pass the correct data
    return Handlers.get(JSON.parse(e.params), "your_verify_token");
}
```

Once you are done, click administrate, and set the webhook to subscribe to messages only.
There might be a future update to support the other types of subscriptions.

And that's it! Now you have a functioning Whatsapp Bot connected to your server.
The code still doesn't support 100% of the functionalities, like interactive and template messages,
but I am working on adding them ASAP.

Also, if you are interested in Google App Script support, check out Secreto31126/whatsapp-api-google-app-script.
