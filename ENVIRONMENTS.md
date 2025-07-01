# Environments

The code is server agnostic, which allows it to work with most runtimes and
frameworks. In order to simplify the hassle of setting it up, we provide some
helpers for the most popular choices.

## Node.js

If using ESM, you can import the module like this:

```js
import { WhatsAppAPI } from "whatsapp-api-js";
```

If using CommonJS, you can require the package:

```js
const { WhatsAppAPI } = require("whatsapp-api-js");
```

For each version of Node, you can use the `setup` function to simplify the
process.

- Node 19 and above (using Express and it's middleware):

```js
import { WhatsAppAPI } from "whatsapp-api-js/middleware/express";
import { NodeNext } from "whatsapp-api-js/setup/node";

import express from "express";

const Whatsapp = new WhatsAppAPI(
    NodeNext({
        token: "123",
        appSecret: "123"
    })
);

const app = express();

app.post("/message", async (req, res) => {
    res.status(await Whatsapp.handle_post(req));
});
```

- Node 18 (deprecated):

```js
import { WhatsAppAPI } from "whatsapp-api-js";
import { Node18 } from "whatsapp-api-js/setup/node";

const Whatsapp = new WhatsAppAPI(
    Node18({
        token: "123",
        appSecret: "123"
    })
);
```

- Node 15 to 17 (deprecated):

```js
import { WhatsAppAPI } from "whatsapp-api-js";
import { Node15 } from "whatsapp-api-js/setup/node";

// As fetch isn't available until Node 18, you will need to pass a ponyfill as a parameter
import fetch from "node-fetch"; // or any other fetch implementation

const Whatsapp = new WhatsAppAPI(
    Node15(
        {
            token: "123",
            appSecret: "123"
        },
        fetch
    )
);
```

## Deno

With the release of Deno 1.25.0, now you can import npm modules directly to
Deno. It's really simple to use:

```js
import { WhatsAppAPI } from "npm:whatsapp-api-js";
```

If you want to use prior versions of Deno, use
[https://esm.sh/whatsapp-api-js](https://esm.sh/whatsapp-api-js) to import the
code.

Deno also counts with setup and middleware helpers:

```js
import { WhatsAppAPI } from "npm:whatsapp-api-js/middleware/deno";
import { Deno } from "whatsapp-api-js/setup/deno";

const Whatsapp = new WhatsAppAPI(
    Deno({
        token: "123",
        appSecret: "123"
    })
);

Deno.serve(async (req) => {
    if (req.url === "/message" && req.method === "POST") {
        return new Response(null, {
            status: await Whatsapp.handle_post(req)
        });
    }
});
```

## Bun

Bun _should_ also work by running:

```sh
bun install whatsapp-api-js
```

```js
import { WhatsAppAPI } from "whatsapp-api-js/middleware/bun";
import { Bun } from "whatsapp-api-js/setup/bun";

const Whatsapp = new WhatsAppAPI(
    Bun({
        token: "123",
        appSecret: "123"
    })
);

Bun.serve({
    fetch: async (req) => {
        if (req.url === "/message" && req.method === "POST") {
            req.respond({ status: await Whatsapp.handle_post(req) });
        }
    }
});
```

## Websites

HTML module example:

```html
<script type="module">
    import { WhatsAppAPI } from "https://esm.sh/whatsapp-api-js";
    <!-- Please, never use your API tokens in a website, use this method wisely -->
</script>
```

## Google App Script

The library is exported as standalone to Google App Script. You can import it
using the code:

```
1iTMl1x_CayBWuLYBBZH0DM72eXqjuavZ0nAwSZ6y3jj9ELXOMckcHmW6
```

Unfortunately, type definitions, middlewares and setup methods aren't available,
as the standalone version doesn't include them while bundling.

```js
const { WhatsAppAPI, Text } = WhatsAppScript; // Or whatever name you gave to the library

async function fetchPonyfill(url, options = {}) {
    if (options?.body) {
        options.payload = options.body;
        delete options.body;
    }

    if (options?.headers?.["Content-Type"]) {
        options.contentType = options.headers["Content-Type"];
        delete options.headers["Content-Type"];
    }

    if (options?.method) {
        options.method = options.method.toLowerCase();
    }

    const request = UrlFetchApp.fetch(url, {
        ...options,
        muteHttpExceptions: true
    });

    return {
        text: async () => request.getContentText,
        json: async () => JSON.parse(request.getContentText())
    };
}

const Whatsapp = new WhatsAppAPI({
    token: YOUR_TOKEN,
    webhookVerifyToken: YOUR_WEBHOOK_VERIFY_TOKEN,
    // GAS doesn't support crypto nor getting the headers of a request, there's no way to verify payloads
    secure: false,
    ponyfill: {
        fetch: fetchPonyfill
    }
});

Whatsapp.on.message = ({ name, reply }) => {
    reply(new Text(`Hello ${name}!`));
    return 200;
};

async function doPost(e) {
    const data = JSON.parse(e.postData.contents);

    let status_code;
    try {
        status_code = await Whatsapp.post(data);
    } catch (e) {
        status_code = e?.httpStatus ?? 500;
    }

    // GAS doesn't support sending custom status codes
    return ContentService.createTextOutput(status_code);
}
```
