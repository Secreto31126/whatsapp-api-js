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

## Initiating a call

```ts
import { WebRTCMagic } from "some-magical-webrtc-library";

const spd = await WebRTCMagic.offer();
Whatsapp.initiateCall(
    "from (bot phoneID)",
    "to (phone number/wa_id)",
    spd
);

// If the user accepts the call, you can connect
// to it as shown in the following example
```

## Connecting to a call

The call.connect event is triggered on user initiated calls
or when the bot is calling and the user picks up.

```ts
import { WebRTCMagic } from "some-magical-webrtc-library";

Whatsapp.on.call.connect = async ({ preaccept, accept, call }) => {
    await preaccept();

    // Handle the call with your favorite WebRTC library
    const rtc = new WebRTCMagic(call.session.sdp);

    rtc.on("connected", async (connection) => {
        await accept();
        await connection.play("rickroll.mp3");
    });
};

Whatsapp.on.call.terminate = async ({ from, call }) => {
    console.log(`Call from ${from} lasted ${call.duration} seconds`);
};
```

## Documentation

https://whatsappapijs.web.app/classes/WhatsAppAPI.WhatsAppAPI.html
https://whatsappapijs.web.app/modules/setup.html
https://whatsappapijs.web.app/modules/middleware.html
https://whatsappapijs.web.app/modules/emitters.html
