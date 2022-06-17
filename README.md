# whatsapp-api-js
A Whatsapp's Official API helper for Node.js [(and others)](#running-outside-of-nodejs)

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
const { WhatsAppAPI, Handlers, Types } = require("whatsapp-api-js");
const { Text, Media, Contacts } = Types;

const Token = "YOUR_TOKEN";

const Whatsapp = new WhatsAppAPI(Token);

// Assuming post is called on a POST request to your server
function post(e) {
    // The Handlers work with any middleware, as long as you pass the correct data
    return Handlers.post(JSON.parse(e.data), onMessage);
}

function onMessage(phoneID, phone, message, name, raw_data) {
    let promise;

    if (message.type === "text") promise = Whatsapp.sendMessage(phoneID, phone, new Text(`*${name}* said:\n\n${message.text.body}`));

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

    if (promise) promise.then(res => res.json()).then(console.log);
    
    Whatsapp.markAsRead(phoneID, message.id);
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

## Running outside of Node.js

Since @0.4.0, the module will check if fetch is available, and fallback to "cross-fetch" if not.
This will allow the same script to be run in many different enviroments, such as a web browser, Deno,
and maybe even TypeScript, idk about this last one ¯\\\_(ツ)\_/¯.

Personal suggestion, use [esm.sh](https://esm.sh/) to import the code directly from npm, works flawlessly with Deno.

Some examples:

```js
import { WhatsAppAPI } from "https://esm.sh/whatsapp-api-js";
const Whatsapp = new WhatsAppAPI("YOUR_TOKEN_HERE");
```

```html
<script type="module">
 import { WhatsAppAPI } from "https://esm.sh/whatsapp-api-js";
 const Whatsapp = new WhatsAppAPI("YOUR_TOKEN_HERE");
 <!-- Please, never use your API tokens in a website, use this method wisely -->
</script>
```

## Documentation

The package documentation is available in [whatsappapijs.web.app](https://whatsappapijs.web.app/).

## Comments

Even though the code already supports all the message types, there's still a long way to go.
I will keep updating it until I like how it works.

Also, if you are interested in Google App Script support, check out Secreto31126/whatsapp-api-google-app-script.
