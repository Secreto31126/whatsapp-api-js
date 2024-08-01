# Main

## Simple Whatsapp creation

```ts
import { WhatsAppAPI } from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({
    token: "",
    appSecret: ""
});
```

## Using the setup helpers

```ts
import { WhatsAppAPI } from "whatsapp-api-js";
import { Node18 } from "whatsapp-api-js/setup/node";

const Whatsapp = new WhatsAppAPI(
    Node18({
        token: "",
        appSecret: ""
    })
);
```

## Using the middlewares

```ts
import express from "express";
import { WhatsAppAPI } from "whatsapp-api-js/middleware/express";

const Whatsapp = new WhatsAppAPI({
    token: "",
    appSecret: "",
    webhookVerifyToken: ""
});

const app = express();

app.post("/webhook", async (req, res) => {
    res.sendStatus(await Whatsapp.handle_post(req));
});
```

## Sending a message

```ts
import { Text } from "whatsapp-api-js/messages";

const text_message = new Text("Hello world!");

Whatsapp.sendMessage(
    "from (bot phoneID)",
    "to (phone number/wa_id)",
    text_message
);
```

## Replying to a message

```ts
import { Text } from "whatsapp-api-js/messages";

Whatsapp.on.message = async ({ reply }) => {
    await reply(new Text("Hello!"));
};
```

## Documentation

https://whatsappapijs.web.app/classes/WhatsAppAPI.WhatsAppAPI.html
https://whatsappapijs.web.app/modules/setup.html
https://whatsappapijs.web.app/modules/middleware.html
https://whatsappapijs.web.app/modules/emitters.html
