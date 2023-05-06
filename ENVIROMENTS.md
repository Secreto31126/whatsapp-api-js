# Enviroments

The code is server agnostic, which allows it to work on most environments.
In order to simplify the hassle of setting it up, we provide some helpers
for the most popular environments.

## Node.js

If using ESM, you can import the module like this:

```js
import WhatsAppAPI from "whatsapp-api-js";
```

If using CommonJS, you can require the package, although you will need to use the default export:

```js
const WhatsAppAPI = require("whatsapp-api-js").default;
```

For each version of Node, you can use the `setup` function to simplify the process.

- Node 19 and above:

```js
import WhatsAppAPI from "whatsapp-api-js";
import { NodeNext } from "whatsapp-api-js/setup/node";

const Whatsapp = new WhatsAppAPI(
    NodeNext({
        token: "123",
        appSecret: "123"
    })
);
```

- Node 18:

```js
import WhatsAppAPI from "whatsapp-api-js";
import { Node18 } from "whatsapp-api-js/setup/node";

const Whatsapp = new WhatsAppAPI(
    Node18({
        token: "123",
        appSecret: "123"
    })
);
```

- Node 12 to 17:

```js
import WhatsAppAPI from "whatsapp-api-js";
import { Node12 } from "whatsapp-api-js/setup/node";

// As fetch isn't available until Node 18, you will need to pass a ponyfill as a parameter
import fetch from "node-fetch"; // or any other fetch implementation

const Whatsapp = new WhatsAppAPI(
    Node12({
        token: "123",
        appSecret: "123",
    }, fetch)
);
```

## Deno

With the release of Deno 1.25.0, now you can import npm modules directly to Deno. It's really simple to use:

```js
import WhatsAppAPI from "npm:whatsapp-api-js";
```

If you want to use prior versions of Deno, use [https://esm.sh/whatsapp-api-js](https://esm.sh/whatsapp-api-js) to import the code.

Deno also counts with a setup helper:

```js
import WhatsAppAPI from "npm:whatsapp-api-js";
import Deno from "whatsapp-api-js/setup/deno";

const Whatsapp = new WhatsAppAPI(
    Deno({
        token: "123",
        appSecret: "123"
    })
);
```

## Bun

Bun _should_ also work by running:

```sh
bun install whatsapp-api-js
```

```js
import WhatsAppAPI from "whatsapp-api-js";
import Bun from "whatsapp-api-js/setup/bun";

const Whatsapp = new WhatsAppAPI(
    Bun({
        token: "123",
        appSecret: "123"
    })
);
```

## Websites

HTML module example:

```html
<script type="module">
    import WhatsAppAPI from "https://esm.sh/whatsapp-api-js";
    <!-- Please, never use your API tokens in a website, use this method wisely -->
</script>
```

## Google App Script

In the transition to v1, Google App Script support was lost, but we are working on bringing it back.

In the meantime, check out Secreto31126/whatsapp-api-google-app-script.
It's outdated, unsuported and not recommended, but it gets the job done.

(I still use it :)
