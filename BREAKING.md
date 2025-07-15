# Breaking changes

## 6.0.0

### WhatsAppAPI methods no longer return the raw fetch response

The `parsed` option was removed from the WhatsAppAPI constructor, and
now all methods return the API response directly instead of
`Promise<T | Response>`.

It didn't give the insights it was expected to provide, and it was
cumbersome to work around.

### Updated types to follow API pricing changes

With the release of the new per-message pricing model, some minor
types where changed on the webhooks payloads, more specific in the
pricing and conversation objects.

To the average user, this change should most certainly have no impact.

For more information, check the Cloud API "Updates to Pricing"
changelog:
https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing

### Drop testing for Node.js 18

Node.js 18 reached EoL, so there's no point in testing with it
anymore. The setup method Node18 was marked as deprecated. It's
strongly recommended to stop using any setup method, as they have all
become mere noops.

### Bumped API version

The default API version was bumped to `v23.0`.

## 5.0.0

### post() and get() errors

The webhook methods no longer throw simple numbers as errors, but rather
custom classes extending the new WhatsAppAPIError class. This change was
made to allow for more detailed error handling, as the new classes contain
the error message, recommended status code and lots of docs to help.

```ts
import { WhatsAppAPIError } from "whatsapp-api-js/errors";

const Whatsapp = new WhatsAppAPI({ token, secure: false });

// Assuming post is called on a POST request to your server
async function post(e) {
    try {
        await Whatsapp.post(e.data);
        return 200;
    } catch (e) {
        console.error(e);

        if (e instanceof WhatsAppAPIError) {
            console.log("For more info, check", e.docs);
            return e.httpStatus;
        }

        return 500;
    }
}
```

As you might notice, the example above first checks if the error is an
instance of WhatsAppAPIError, and returns 500 if it isn't. That's because...

### post() error handling

The post() method no longer catches errors thrown by the `message` or
`status` emitters. This means that any error within the handlers will be
propagated to the caller, which can then manage it as needed.

```ts
import { WhatsAppAPIError } from "whatsapp-api-js/errors";

const Whatsapp = new WhatsAppAPI({ token, secure: false });

Whatsapp.on.message = () => {
    throw new Error("This is an error on my code");
};

async function post(e) {
    try {
        await Whatsapp.post(e.data);
    } catch (e) {
        if (e instanceof WhatsAppAPIError) {
            console.log("This is a library error");
        } else {
            console.log("This is my faulty code");
        }
    }

    return 418;
}
```

This change does NOT impact the middlewares, as they still catch
the errors and asserts the return values are the documented ones.

### ActionProduct signature change

The ActionProduct class no longer takes the catalog ID and product as
two separate arguments, but rather as a single CatalogProduct object.

```ts
import {
    Interactive,
    ActionProduct,
    CatalogProduct
} from "whatsapp-api-js/messages";

const interactive_single_product_message = new Interactive(
    new ActionProduct(new CatalogProduct("product_id", "catalog_id"))
);
```

### Drop support for CJS

Nine out of ten releases, there was a compatibility issue between ESM and CJS
exports. Although the library was designed to support both, the complexity
it brought didn't justify the effort, specially now as many other big libraries
are dropping native CJS support too.

If you 100% need CJS in Node.js, you can now use the release candidate feature
to synchonously require ESM modules available since v22. The library is fully
synchonous (contains no top-level await), so it should work just fine.

https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require

In order to keep the library easier to use with CJS, the code will still not
use default exports.

### Bumped API version

The default API version was bumped to `v21.0`.

## 4.0.0

### Emitters and post() signature change

This might be one of the most requested features since the
beginning of the library. It is now possible to return
custom information from the emitters, which can be accessed
from the promise returned by the method `post()`.

```ts
type EmitterReturn = { replied: boolean; status: number };

const Whatsapp = new WhatsAppAPI<EmitterReturn>({
    token,
    appSecret
});

Whatsapp.on.message = async ({ reply }) => {
    try {
        await reply(new Text("Hello!"));
        return { replied: true, status: 200 };
    } catch (e) {
        return { replied: false, status: 500 };
    }
};

Whatsapp.on.status = ({ id, status }) => {
    return { replied: false, status: 200 };
};

// Assuming post is called on a POST request to your server
async function post(e) {
    const body = JSON.parse(e.data);

    let status: number, replied = false;
    try {
        { replied, status } = await Whatsapp.post(body, e.data, e.headers["x-hub-signature-256"]);
    } catch (e) {
        status = e;
    }

    console.log(`Replied: ${replied}, Status: ${status}`);
    return status;
}
```

Some things to note:

1.  As you may notice, the method no longer returns 200 by default,
    but rather a promise of the custom type.

2.  Any error thrown within the emitters will be caught by `post()` and
    throw a 500 status code.

3.  OnSent is not affected by this change as it is not invoked
    by the method `post()`.

4.  Middlewares are also not affected by this, as they still
    return a promise of 200 with no option to change it. They, however,
    will return 500 if an error is thrown within the emitter, as
    they internally call `post()`, which will catch the error as
    mentioned in point 2.

### offload_functions option removed

The option `offload_functions` was removed from the constructor.
All emitters are now always executed synchronously. In order to
offload the execution of the handlers, you can use the new `offload`
method, which can be called from the emitters' parameters.

```ts
const Whatsapp = new WhatsAppAPI<number>({ token, appSecret });

Whatsapp.on.message = ({ reply, offload }) => {
    offload(() => {
        reply(new Text(AI.text()));
    });

    return 202;
};
```

### broadcastMessage() signature change

The method no longer returns a promise, and rather than waiting
within the function to send the message, it immediately returns
an array of timeout promises which will execute `sendMessage()`.

### Bumped API version

The default API version was bumped to `v20.0`. Not much else to say.

## 3.0.0

In the last few years, the library has been growing and changing, and
with that, not only new functionalities are added, but also new bugs
are created, which sometimes require breaking changes to be fixed. This
version is one of those cases.

### Removed default exports

Due to interoperability issues between ESM and CJS, all the default
exports were removed to assure a consistent behavior across all
runtimes. The list of affected imports by this change is:

- `whatsapp-api-js`
- `whatsapp-api-js/messages/location`
- `whatsapp-api-js/messages/reaction`
- `whatsapp-api-js/messages/text`
- `whatsapp-api-js/middleware/*` (yeah, all of them, issue [#306](https://github.com/Secreto31126/whatsapp-api-js/issues/306))
- `whatsapp-api-js/setup/bun`
- `whatsapp-api-js/setup/deno`
- `whatsapp-api-js/setup/web`

ESM example:

```js
import { WhatsAppAPI } from "whatsapp-api-js";
```

CJS example:

```js
const { WhatsAppAPI } = require("whatsapp-api-js");
```

### Once again, classes splitted and renamed

In order to improve the typing in Interactive's constructor, the
`ActionProduct` class was splitted into `ActionProduct` and
`ActionProductList`. If you are using the former to send multi product
messages, updating is as simple as renaming the class to the new one.

### Version pinning warning

Although not a breaking change, it's worth mentioning that the library
will now show a warning if the API version is not pinned. This is to
encourage good practices and avoid unexpected changes in the API
at production.

## 2.0.0

### Classes renamed, splitted and moved

With the release of **"full catalog"** support for Cloud API, the library needed
some files and classes renaming to avoid confusion between the new features and
the original catalog messages.

Among the affected classes and files are:

- `interactive.ts`
    - `ActionCatalog` -> `ActionProduct`: `ActionCatalog` is now used for the
      Catalog messages. The original class was renamed as `ActionProduct`.
    - `Product` and `ProductSection`: These classes were moved from the file
      `messages/interactive.ts` to `messages/globals.ts`, as they are now also
      used in templates.
    - `Section`: The class was moved from the file `messages/interactive.ts` to
      `types.ts`.

- `template.ts`
    - `ButtonComponent` -> `URLComponent`, `PayloadComponent`, `CatalogComponent`,
      `MPMComponent`, `CopyComponent`, `SkipButtonComponent`: As the API now
      supports mixing button types, the `ButtonComponent` was splitted into
      different classes, each one representing a button types. For example, an URL
      component was updated from `new ButtonComponent("url", "example")` to
      `new URLComponent("example")`.
    - `Template`: The constructor now receives multiple button components instead
      of a single one.
    - `ButtonComponent`: The class was replaced with an abstract class.
    - `ButtonParameter`: The class was replaced with a type.

- `types.ts`
    - `ClientBuildableMessageComponent`: The class was replaced with an interface.
    - `PostData`: `PostData.entry[].changes[].value.contacts` may be undefined.

### Node min version bumped

Node 14 and 16 support was dropped as they reached EoL. The engine requirement
is now `>=16`.

## 1.0.0

The module was rewritten in TypeScript, which allows for better type support and
documentation, reducing the number of runtime checks and improving the overall
performance.

Most of the import syntax was updated to ES6 in order to support tree-shaking.
CommonJS is still supported.

Examples:

```js
// ESM
import WhatsAppAPI from "whatsapp-api-js";
import { Document, Image, Text } from "whatsapp-api-js/messages";
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

Both post and get wizards were moved within the WhatsAppAPI class and got major
signatures updates.

get() no longer takes the verify_token as a parameter, as it's now configured on
the main class.

```js
import WhatsAppAPI from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({
    token: "123",
    appSecret: "456",
    webhookVerifyToken: "789"
});

// Assuming get is called on a GET request to your server
function get(e) {
    return Whatsapp.get(JSON.parse(e.params));
}
```

post() now requires both the raw body and the signature header _if_ secure is
set to true.

```js
import WhatsAppAPI from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({ token: "123", appSecret: "456" });

// Assuming post is called on a POST request to your server
function post(e) {
    return Whatsapp.post(
        JSON.parse(e.data),
        e.data,
        e.headers["x-hub-signature-256"]
    );
}
```

If you want to skip the signature verification, you can set secure to false as
follows.

```js
import WhatsAppAPI from "whatsapp-api-js";

const Whatsapp = new WhatsAppAPI({ token: "123", secure: false });

// Assuming post is called on a POST request to your server
function post(e) {
    return Whatsapp.post(JSON.parse(e.data));
}
```

The callbacks for OnMessage and OnStatus are now configured separately on the
main class.

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
    return Whatsapp.post(
        JSON.parse(e.data),
        e.data,
        e.headers["x-hub-signature-256"]
    );
}
```

With the implementation of the new callbacks, the logSentMessages function was
removed.

The default undici fallback was also removed, and the module now uses the
enviroment fetch implementation. Ponyfilling is still possible via the new
argument at the WhatsAppAPI() constructor:

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

This change also restores the compatibility with previous Node.js versions,
making the module more server agnostic.

There had been some minor changes to the messages classes, although the most
noticeable one is the reduction of the Text class usage across classes, replaced
by normal strings.

## 0.8.0

The module changed from using "cross-fetch" to "undici" as the fallback fetch
implementation in order to use FormData for the Media upload support, which is
not (easily) available in "cross-fetch".

Although this change doesn't affect existing code, it forces the Node.js version
to be at least 16. If the module is downloaded using a lower version, npm will
throw an error.

## 0.7.0

With the release of cart support for Cloud API, some naming changes where made
within the interactive's classes. The Section class, which was a component of
the ActionList, was renamed to ListSection, to avoid confusion with the new
ProductSection.

## 0.6.0

Since 0.6.0, the module will no longer return the raw fetch request, now it's
internally parsed and returned. This change was made in order to improve the
logSentMessages function, as it can now log the server response too. To get the
raw request as before, you can use the `parsed` property of the main object as
follows.

```js
const parsed = false;
const Whatsapp = new WhatsAppAPI("YOUR_TOKEN", undefined, parsed);
// All the API operations, like sendMessage, will now return the raw request.
// Keep in mind, now when using logSentMessage the id and response parameters will be undefined.
```
