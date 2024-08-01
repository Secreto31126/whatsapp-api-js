# whatsapp-api-js v4

[![npm](https://img.shields.io/npm/v/whatsapp-api-js?color=4ccc1c)](https://www.npmjs.com/package/whatsapp-api-js)
[![Contributors](https://img.shields.io/github/all-contributors/Secreto31126/whatsapp-api-js)](#contributors)

A TypeScript server agnostic Whatsapp's Official API framework.

## List of contents

-   [whatsapp-api-js v4](#whatsapp-api-js-v4)
    -   [List of contents](#list-of-contents)
    -   [Set up](#set-up)
    -   [Examples and Tutorials](#examples-and-tutorials)
    -   [Types](#types)
    -   [Changelog](#changelog)
    -   [Documentation](#documentation)
    -   [Contributors](#contributors)
    -   [Contributions](#contributions)
    -   [Breaking changes](#breaking-changes)
    -   [Beta releases](#beta-releases)

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
import { WhatsAppAPI } from "whatsapp-api-js";
import { Text, Image, Document } from "whatsapp-api-js/messages";
import * as Contacts from "whatsapp-api-js/messages/contacts";

// Kind reminder to not hardcode your token and secret
const TOKEN = "YOUR_TOKEN";
const APP_SECRET = "YOUR_SECRET";

const Whatsapp = new WhatsAppAPI({ token: TOKEN, appSecret: APP_SECRET });

// Assuming post is called on a POST request to your server
async function post(e) {
    // The handlers work with any framework, as long as you pass the correct data
    // You can also use one of the middlewares provided in the package, keep reading
    return await Whatsapp.post(
        JSON.parse(e.data),
        e.data,
        e.headers["x-hub-signature-256"]
    );
}

Whatsapp.on.message = async ({ phoneID, from, message, name, reply }) => {
    console.log(
        `User ${name} (${from}) sent to bot ${phoneID} ${JSON.stringify(
            message
        )}`
    );

    let promise;

    if (message.type === "text") {
        promise = reply(
            new Text(`*${name}* said:\n\n${message.text.body}`),
            true
        );
    }

    if (message.type === "image") {
        promise = reply(
            new Image(message.image.id, true, `Nice photo, ${name}`)
        );
    }

    if (message.type === "document") {
        promise = reply(
            new Document(message.document.id, true, undefined, "Our document")
        );
    }

    if (message.type === "contacts") {
        promise = reply(
            new Contacts.Contacts(
                [
                    new Contacts.Name(name, "First name", "Last name"),
                    new Contacts.Phone(phone),
                    new Contacts.Birthday("2022", "04", "25")
                ],
                [
                    new Contacts.Name("John", "First name", "Last name"),
                    new Contacts.Organization("Company", "Department", "Title"),
                    new Contacts.Url("https://www.google.com", "WORK")
                ]
            )
        );
    }

    console.log(
        (await promise) ??
            "There are more types of messages, such as locations, templates, interactive, reactions and all the other media types."
    );

    Whatsapp.markAsRead(phoneID, message.id);

    return 200;
};

Whatsapp.on.sent = ({ phoneID, to, message }) => {
    console.log(`Bot ${phoneID} sent to user ${to} ${message}`);
};
```

To receive the post requests on message, you must setup the webhook at your Facebook app.

Back in the dashboard, click on WhatsApp > Settings, and setup the webhook URL.
While setting it up, you will be asked for a Verify Token. This can be any string you want.

The package also has a GET wizard for the webhook authentication:

```js
import { WhatsAppAPI } from "whatsapp-api-js";

const TOKEN = "YOUR_TOKEN";
const APP_SECRET = "YOUR_SECRET";
const VERIFY_TOKEN = "YOUR_VERIFY_TOKEN";

const Whatsapp = new WhatsAppAPI({
    token: TOKEN,
    appSecret: APP_SECRET,
    webhookVerifyToken: VERIFY_TOKEN
});

// Assuming get is called on a GET request to your server
// You can also use one of the middlewares provided in the package, keep reading
function get(e) {
    return Whatsapp.get(e.query);
}
```

Once you are done, click the administrate button, and subscribe to the messages event.

And that's it! Now you have a functioning Whatsapp Bot connected to your server.
For more information on the setup process for specific runtimes and frameworks, check out the
[Environments.md file](https://github.com/Secreto31126/whatsapp-api-js/blob/main/ENVIRONMENTS.md).

## Examples and Tutorials

There are a few examples that cover how to create each type of message,
and how to use the basic methods of the library.

Check them out in the [examples folder](https://github.com/Secreto31126/whatsapp-api-js/blob/main/EXAMPLES/).

## Types

The library is fully typed. Most types are available by importing `/types` or `/emitters` :

```ts
import { GetParams, PostData } from "whatsapp-api-js/types";
import { OnMessage, OnSent, OnStatus } from "whatsapp-api-js/emitters";
```

## Changelog

To know what changed between updates, check out the [releases on Github](https://github.com/Secreto31126/whatsapp-api-js/releases).

## Documentation

The latest release documentation is available in [whatsappapijs.web.app](https://whatsappapijs.web.app/),
and previous versions are available in [secreto31126.github.io/whatsapp-api-js](https://secreto31126.github.io/whatsapp-api-js/).

## Contributors

[Emoji key ✨](https://allcontributors.org/docs/en/emoji-key)

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DiegoCarrillogt"><img src="https://avatars.githubusercontent.com/u/29462621?v=4?s=100" width="100px;" alt="Diego Carrillo"/><br /><sub><b>Diego Carrillo</b></sub></a><br /><a href="#financial-DiegoCarrillogt" title="Financial">💵</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/HysMX"><img src="https://avatars.githubusercontent.com/u/50180189?v=4?s=100" width="100px;" alt="Omar"/><br /><sub><b>Omar</b></sub></a><br /><a href="https://github.com/Secreto31126/whatsapp-api-js/issues?q=author%3AHysMX" title="Bug reports">🐛</a> <a href="#financial-HysMX" title="Financial">💵</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/RahulLanjewar93"><img src="https://avatars.githubusercontent.com/u/63550998?v=4?s=100" width="100px;" alt="Rahul Lanjewar"/><br /><sub><b>Rahul Lanjewar</b></sub></a><br /><a href="https://github.com/Secreto31126/whatsapp-api-js/commits?author=RahulLanjewar93" title="Code">💻</a> <a href="https://github.com/Secreto31126/whatsapp-api-js/commits?author=RahulLanjewar93" title="Documentation">📖</a> <a href="#ideas-RahulLanjewar93" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributions

If you have some free time and really want to improve the library or fix dumb bugs, feel free to read
[CONTRIBUTING.md file](https://github.com/Secreto31126/whatsapp-api-js/blob/main/CONTRIBUTING.md).

## Breaking changes

You can get a full list of breaking changes in the [BREAKING.md file](https://github.com/Secreto31126/whatsapp-api-js/blob/main/BREAKING.md).

## Beta releases

Install the latest beta release with `npm install whatsapp-api-js@beta`.
As any beta, it is 110% likely to break. I also use this tag to test npm releases.
Use it at your own risk.
