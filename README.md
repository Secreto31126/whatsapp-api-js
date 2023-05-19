# whatsapp-api-js v1

[![npm version](https://badge.fury.io/js/whatsapp-api-js.svg)](https://badge.fury.io/js/whatsapp-api-js)

#### Hey, I'm not interested in your "v1" "beta" thing! Take me to the [v0 README.md](https://github.com/Secreto31126/whatsapp-api-js/tree/0.8.2#readme)

A TypeScript server agnostic Whatsapp's Official API framework.

## List of contents

-   [Set up](#set-up)
-   [Changelog](#changelog)
-   [Documentation](#documentation)
-   [Contributions](#contributions)
-   [Breaking changes](#breaking-changes)
-   [Beta Releases](#beta-releases)

## Set up

First, you need a Facebook app with the Whatsapp API activated.
You can create your first app following [this steps](https://developers.facebook.com/docs/whatsapp/getting-started/signing-up).
Get the API token, either a temporal or a permanent one.

In your server you can install the module using npm:

```sh
npm install whatsapp-api-js
```

Now you can write code like this:

```js
import WhatsAppAPI from "whatsapp-api-js";
import { Text, Image, Document } from "whatsapp-api-js/messages";
import * as Contacts from "whatsapp-api-js/messages/contacts";

// Kind reminder to not hardcode your token and secret
const TOKEN = "YOUR_TOKEN";
const APP_SECRET = "YOUR_SECRET";

const Whatsapp = new WhatsAppAPI({ token: TOKEN, appSecret: APP_SECRET });

// Assuming post is called on a POST request to your server
function post(e) {
    // The handlers work with any middleware, as long as you pass the correct data
    return Whatsapp.post(JSON.parse(e.data), e.data, e.headers["x-hub-signature-256"]);
}

Whatsapp.on.message = ({ phoneID, from, message, name, raw }) => {
    console.log(`User ${name} (${from}) sent to bot ${phoneID} ${JSON.stringify(message)}`);

    let promise;

    if (message.type === "text") {
        promise = Whatsapp.sendMessage(phoneID, from, new Text(`*${name}* said:\n\n${message.text.body}`), message.id);
    }

    if (message.type === "image") {
        promise = Whatsapp.sendMessage(phoneID, from, new Image(message.image.id, true, `Nice photo, ${name}`));
    }

    if (message.type === "document") {
        promise = Whatsapp.sendMessage(phoneID, from, new Document(message.document.id, true, undefined, "Our document"));
    }

    if (message.type === "contacts") {
        promise = Whatsapp.sendMessage(phoneID, from, new Contacts.Contacts(
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

    console.log(await promise ?? "There are more types of messages, such as locations, templates, interactives, reactions and all the other media types.");

    Whatsapp.markAsRead(phoneID, message.id);
};

Whatsapp.on.sent = ({ phoneID, to, message, raw }) => {
    console.log(`Bot ${phoneID} sent to user ${to} ${message}\n\n${JSON.stringify(raw)}`);
};
```

To recieve the post requests on message, you must setup the webhook at your Facebook app.
While setting up, you will be asked a Verify Token. This can be any string you want.

The app also has a GET wizard for the webhook authentication:

```js
import WhatsAppAPI from "whatsapp-api-js";

const TOKEN = "YOUR_TOKEN";
const APP_SECRET = "YOUR_SECRET";
const VERIFY_TOKEN = "YOUR_VERIFY_TOKEN";

const Whatsapp = new WhatsAppAPI({
    token: TOKEN,
    appSecret: APP_SECRET,
    webhookVerifyToken: VERIFY_TOKEN
});

// Assuming get is called on a GET request to your server
function get(e) {
    return Whatsapp.get(JSON.parse(e.params));
}
```

Once you are done, click administrate, and set the webhook to subscribe to messages only.
There might be a future update to support the other types of subscriptions.

And that's it! Now you have a functioning Whatsapp Bot connected to your server.
For more information on the setup process for specific enviroments, check out the
[Enviroments.md file](https://github.com/Secreto31126/whatsapp-api-js/blob/main/ENVIROMENTS.md).

## Changelog

To know what changed between updates, check out the [releases on Github](https://github.com/Secreto31126/whatsapp-api-js/releases).

## Documentation

The lateset package documentation is available in [whatsappapijs.web.app](https://whatsappapijs.web.app/),
and previous versions are available in [secreto31126.github.io/whatsapp-api-js](https://secreto31126.github.io/whatsapp-api-js/).

## Contributions

If you have some free time and really want to improve the library of fix dumb bugs, feel free to read [CONTRIBUTING.md file](https://github.com/Secreto31126/whatsapp-api-js/blob/main/CONTRIBUTING.md)

## Breaking changes

You can get a full list of breaking changes in the [BREAKING.md file](https://github.com/Secreto31126/whatsapp-api-js/blob/main/BREAKING.md).

## Beta releases

Install the latest beta realease with `npm install whatsapp-api-js@beta`.
As any beta, it is 110% likely to break. I also use this tag to test npm releases.
Use it at your own risk.
