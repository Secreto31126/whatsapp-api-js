# Breaking changes

## 2.0.0

### Classes renamed

With the release of **"full catalog"** support for Cloud API, the
library needed some files and classes renaming to avoid confusion
between the new features and the original catalog messages.

Among the affected classes and files are:

 - `interactive.ts`
    - `ActionCatalog` -> `ActionProduct`: `ActionCatalog` is now used
    for the Catalog messages. The original class was renamed as
    `ActionProduct`.
    - `Section`, `Product` and `ProductSection`: These classes were
    moved from the file `messages/interactive.ts` to
    `messages/globals.ts`, as they are also used in templates now.
    `Product` and `ProductSection` are still exposed, but `Section` was
    marked as internal (it's still exported, but the fact you can
    access it doesn't mean you should do it. The lack of
    package-private is quite annoying to deal with).

 - `template.ts`
    - `ButtonComponent` -> `URLComponent`, `PayloadComponent`,
    `CatalogComponent`, `MPMComponent`: Due to the added complexity in
    order to support the new Catalog and MPM templates, the
    `ButtonComponent` was split into 4 different classes, each one
    representing the different button types. For example, an URL
    component was updated from `new ButtonComponent("url", "example")`
    to `new URLComponent("example")`.
    - `ButtonComponent`: The class was replaced with an abstract class
    and marked as internal (still exported).
    - `URLComponent`: The class now has a runtime limit of 2 buttons
    per message, as the WhatsApp API only supports 2 url buttons per
    template.
    - `ButtonParameter`: The class was replaced with a type and marked
    as internal (still exported).

### Node min version bumped

Node 14 and 16 support was dropped as they reached EoL. The engine
requirement is now `>=18`.

## 1.0.0

The module was rewritten in TypeScript, which allows for better type support and documentation,
reducing the number of runtime checks and improving the overall performance.

Most of the import syntax was updated to ES6 in order to support tree-shaking.
CommonJS is still supported.

Examples:

```js
// ESM
import WhatsAppAPI from "whatsapp-api-js";
import { Text, Image, Document } from "whatsapp-api-js/messages";
import Location from "whatsapp-api-js/messages/location";
```

```js
// CommonJS
const WhatsAppAPI = require("whatsapp-api-js").default;
const { Text, Image, Document } = require("whatsapp-api-js/messages");
const Location = require("whatsapp-api-js/messages/location").default;
```

The main contructor now takes named arguments instead of positional arguments.
Also bumped the default API version to v17.0.

```js
import WhatsAppAPI from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({
    token: "123",
    appSecret: "456",
    webhookVerifyToken: "789",
    v: "v16.0",
    parsed: true
});
```

Both post and get wizards were moved within the WhatsAppAPI class and got major signatures updates.

get() no longer takes the verify_token as a parameter, as it's now configured on the main class.

```js
import WhatsAppAPI from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({ token: "123", appSecret: "456", webhookVerifyToken: "789" });

// Assuming get is called on a GET request to your server
function get(e) {
    return Whatsapp.get(JSON.parse(e.params));
}
```

post() now requires both the raw body and the signature header _if_ secure is set to true.

```js
import WhatsAppAPI from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({ token: "123", appSecret: "456" });

// Assuming post is called on a POST request to your server
function post(e) {
    return Whatsapp.post(JSON.parse(e.data), e.data, e.headers["x-hub-signature-256"]);
}
```

If you want to skip the signature verification, you can set secure to false as follows.

```js
import WhatsAppAPI from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({ token: "123", secure: false });

// Assuming post is called on a POST request to your server
function post(e) {
    return Whatsapp.post(JSON.parse(e.data));
}
```

The callbacks for OnMessage and OnStatus are now configured separately on the main class.

```js
import WhatsAppAPI from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({ token: "123", appSecret: "456" });

Whatsapp.on.message = ({ name, from }) => {
    console.log(`Got message from ${name} (${from})`);
};

Whatsapp.on.status = ({ id, status }) => {
    console.log(`Message ${id} status changed to ${status}`);
};

Whatsapp.on.sent = ({ id, to }) => {
    console.log(`Message ${id} was sent to ${to}`);
};

// Assuming post is called on a POST request to your server
function post(e) {
    return Whatsapp.post(JSON.parse(e.data), e.data, e.headers["x-hub-signature-256"]);
}
```

With the implementation of the new callbacks, the logSentMessages function was removed.

The default undici fallback was also removed, and the module now uses the enviroment fetch implementation.
Ponyfilling is still possible via the new argument at the WhatsAppAPI() constructor:

```js
import WhatsAppAPI from "whatsapp-api-js";
import { fetch } from "undici";

const Whatsapp = new WhatsAppAPI({
    token: "YOUR_TOKEN_HERE",
    appSecret: "YOUR_SECRET_HERE",
    ponyfill: {
        fetch
    }
});
```

This change also restores the compatibility with previous Node.js versions, making the module more server agnostic.

There had been some minor changes to the messages classes, although the most noticeable one is the reduction of the
Text class usage across classes, replaced by normal strings.

## 0.8.0

The module changed from using "cross-fetch" to "undici" as the fallback fetch implementation in order
to use FormData for the Media upload support, which is not (easily) available in "cross-fetch".

Although this change doesn't affect existing code, it forces the Node.js version to be at least 16.
If the module is downloaded using a lower version, npm will throw an error.

## 0.7.0

With the release of cart support for Cloud API, some naming changes where made within the interactive's classes.
The Section class, which was a component of the ActionList, was renamed to ListSection, to avoid confusion with
the new ProductSection.

## 0.6.0

Since 0.6.0, the module will no longer return the raw fetch request, now it's internally parsed and returned.
This change was made in order to improve the logSentMessages function, as it can now log the server response too.
To get the raw request as before, you can use the `parsed` property of the main object as follows.

```js
const parsed = false;
const Whatsapp = new WhatsAppAPI("YOUR_TOKEN", undefined, parsed);
// All the API operations, like sendMessage, will now return the raw request.
// Keep in mind, now when using logSentMessage the id and response parameters will be undefined.
```
