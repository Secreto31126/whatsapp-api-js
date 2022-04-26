# whatsapp-api-js
A Whatsapp's Official API helper for Node.js (WIP)

## Disclaimer

Whatsapp's Official API is currently on beta acccess.
To participate, you can fill [this form](https://www.facebook.com/business/m/whatsapp/business-api).

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
const WhatsAppAPI = require("whatsapp-api-js").WhatsApp;
const Handler = require("whatsapp-api-js").Handlers;
const { name, phone, birthday } = require("whatsapp-api-js").Contacts;

const Token = "YOUR_TOKEN";

const Whatsapp = new WhatsAppAPI(Token);

// Assuming post is called on a POST request to your server
function post(e) {
    // The Handlers work with any middleware, as long as you pass the correct data
    return Handler.post(JSON.parse(e.data), onMessage);
}

function onMessage(phoneID, phone, message, name, raw_data) {
    if (message.type === "text") Whatsapp.sendTextMessage(phoneID, phone, `*${name}* said:\n\n${message.text.body}`);

    if (message.type === "image") Whatsapp.sendImageMessage(phoneID, phone, message.image.id, true, `Nice photo, ${name}`);

    if (message.type === "document") Whatsapp.sendDocumentMessage(phoneID, phone, message.document.id, true, undefined, "Our document");

    if (message.type === "video") Whatsapp.sendVideoMessage(phoneID, phone, "a_video_url_goes_here");

    if (message.type === "sticker") Whatsapp.sendStickerMessage(phoneID, phone, "a_sticker_url_goes_here");

    if (message.type === "audio") Whatsapp.sendAudioMessage(phoneID, phone, message.audio.id, true);
    
    if (message.type === "location") Whatsapp.sendLocationMessage(phoneID, phone, 0, 0);

    if (message.type === "contacts") Whatsapp.sendContactMessage(phoneID, phone, [
        new name(name, "First name", "Last name"),
        new phone(phone),
        new birthday("2022", "04", "25"),
    ]);
}
```

To recieve the post requests on message, you must setup the webhook at your Facebook app.
While setting up, you will be asked a Verify Token. This can be any string you want.

The app also has a GET wizard for the webhook authentication:

```js
const Handler = require("whatsapp-api-js").Handlers;

// Assuming get is called on a GET request to your server
function get(e) {
    return Whatsapp.get(JSON.parse(e.params), "your_verify_token");
}
```

Once you are done, click administrate, and set the webhook to subscribe to messages only.
There might be a future update to support the other types of subscriptions.

And that's it! Now you have a functioning Whatsapp Bot connected to your server.
The code still doesn't support 100% of the functionalities, like interactive and template messages,
but I am working on adding them ASAP.

Also, if you are interested in Google App Script support, check out Secreto31126/whatsapp-api-google-app.script.
