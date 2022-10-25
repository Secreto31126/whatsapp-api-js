# whatsapp-api-js
A Whatsapp's Official API framework for Node.js @^16 [(and others)](#running-outside-of-nodejs)

## List of contents

- [Disclaimers](#disclaimers)
- [Set up](#set-up)
- [Running outside of Node.js](#running-outside-of-nodejs)
- [Breaking changes](#breaking-changes)
- [Documentation](#documentation)
- [Beta Releases](#beta-releases)
- [Comments](#comments)

## Disclaimers

 1. Whatsapp's Official API is now generally available.
To get started, you can follow [this steps](https://developers.facebook.com/docs/whatsapp/getting-started/signing-up).

 2. This project is a work in progress. Breaking changes are expected from mid-version to mid-version until it hits version 1.0.0.

 3. To know what changes between updates, check out the [releases on Github](https://github.com/Secreto31126/whatsapp-api-js/releases).

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
// Read Running outside of Nodejs to see support for other engines
const { WhatsAppAPI, Handlers, Types } = require("whatsapp-api-js");
const { Text, Media, Contacts } = Types;

const Token = "YOUR_TOKEN";

const Whatsapp = new WhatsAppAPI(Token);

// Assuming post is called on a POST request to your server
function post(e) {
    // The Handlers work with any middleware, as long as you pass the correct data
    return Handlers.post(JSON.parse(e.data), onMessage);
}

async function onMessage(phoneID, phone, message, name, raw_data) {
    console.log(`User ${phone} (${name}) sent to bot ${phoneID} ${JSON.stringify(message)}`);

    let promise;

    if (message.type === "text") promise = Whatsapp.sendMessage(phoneID, phone, new Text(`*${name}* said:\n\n${message.text.body}`), message.id);

    if (message.type === "image") promise = Whatsapp.sendMessage(phoneID, phone, new Media.Image(message.image.id, true, `Nice photo, ${name}`));

    if (message.type === "document") promise = Whatsapp.sendMessage(phoneID, phone, new Media.Document(message.document.id, true, undefined, "Our document"));

    if (message.type === "contacts") promise = Whatsapp.sendMessage(phoneID, phone, new Contacts.Contacts(
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

    console.log(await promise ?? "There are more types of messages, such as locations, templates, interactives, reactions and all the other media types.");
    
    Whatsapp.markAsRead(phoneID, message.id);
}

Whatsapp.logSentMessages((phoneID, phone, message, raw_data) => {
    console.log(`Bot ${phoneID} sent to user ${phone} ${JSON.stringify(message)}\n\n${JSON.stringify(raw_data)}`);
});
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

## Running outside of Node.js

Since @0.4.2, the module will check if fetch is available, and fallback to "undici"
(or "cross-fetch" if using prior @0.8.0) if not. This will allow the same script to
be run in many different enviroments, such as a web browser, Deno and Bun.

With the release of Deno 1.25.0, now you can import npm modules directly to Deno. It's really simple to use:

```js
import { WhatsAppAPI } from "npm:whatsapp-api-js";
const Whatsapp = new WhatsAppAPI("YOUR_TOKEN_HERE");
```

However, the npm support is still experimental and behind the --unstable flag.
If you want to use prior versions of Deno, use [https://esm.sh/whatsapp-api-js](https://esm.sh/) to import the code.

Bun also works by running ```bun install whatsapp-api-js```.

HTML module example:

```html
<script type="module">
 import { WhatsAppAPI } from "https://esm.sh/whatsapp-api-js";
 const Whatsapp = new WhatsAppAPI("YOUR_TOKEN_HERE");
 <!-- Please, never use your API tokens in a website, use this method wisely -->
</script>
```

## Breaking changes

### 0.8.0

The module changed from using "cross-fetch" to "undici" as the fallback fetch implementation in order
to use FormData for the Media upload support, which is not (easily) available in "cross-fetch".

Although this change doesn't affect existing code, it forces the Node.js version to be at least 16.
If the module is downloaded using a lower version, npm will throw an error.

### 0.7.0

With the release of cart support for Cloud API, some naming changes where made within the interactive's classes.
The Section class, which was a component of the ActionList, was renamed to ListSection, to avoid confusion with
the new ProductSection.

### 0.6.0

Since 0.6.0, the module will no longer return the raw fetch request, now it's internally parsed and returned.
This change was made in order to improve the logSentMessages function, as it can now log the server response too.
To get the raw request as before, you can use the `parsed` property of the main object as follows.

```js
const parsed = false;
const Whatsapp = new WhatsAppAPI("YOUR_TOKEN", undefined, parsed);
// All the API operations, like sendMessage, will now return the raw request.
// Keep in mind, now when using logSentMessage the id and response parameters will be undefined.
```

## Documentation

The package documentation is available in [whatsappapijs.web.app](https://whatsappapijs.web.app/) and
[secreto31126.github.io/whatsapp-api-js](https://secreto31126.github.io/whatsapp-api-js/).

## Beta releases

Install the latest beta realease with `npm install whatsapp-api-js@beta`.
As any beta, it is 110% likely to break. I also use this tag to test npm releases.
Use it at your own risk.

## Comments

Even though the code already supports all the message types, there's still a long way to go.
I will keep updating it until I like how it works.

Also, if you are interested in Google App Script support, check out Secreto31126/whatsapp-api-google-app-script.
