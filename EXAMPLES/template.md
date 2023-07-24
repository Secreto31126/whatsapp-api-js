# Template

## Simple template with no variables

```ts
import { Template, Language } from "whatsapp-api-js/messages";

const template_message = new Template(
    "template_name",
    new Language("en")
);
```

## Simple template with simple variables in header and body

```ts
import {
    Template,
    Language,
    HeaderComponent,
    HeaderParameter,
    BodyComponent,
    BodyParameter,
    Currency,
    DateTime
} from "whatsapp-api-js/messages";

const template_variables_message = new Template(
    "template_name",
    new Language("en"),
    new HeaderComponent(
        new HeaderParameter("Hello"),
        new HeaderParameter(
            new Currency(1.5 * 1000, "USD", "U$1.5"),
        ),
        new HeaderParameter(
            new DateTime("01/01/2023")
        )
    ),
    new BodyComponent(
        new BodyParameter("Hello"),
        new BodyParameter(
            new Currency(1.5 * 1000, "USD", "U$1.5"),
        ),
        new BodyParameter(
            new DateTime("01/01/2023")
        )
    )
);
```

## Simple template with header media

```ts
import {
    Template,
    Language,
    HeaderComponent,
    HeaderParameter,
    Video
} from "whatsapp-api-js/messages";

const template_media_message = new Template(
    "template_name",
    new Language("en"),
    new HeaderComponent(
        new HeaderParameter(
            // Can also be image, document, or location
            new Video("https://www.w3schools.com/html/mov_bbb.mp4")
        )
    ),
);
```

## Complex template with reply buttons

```ts
import {
    Template,
    Language,
    ButtonComponent
} from "whatsapp-api-js/messages";

const template_reply_buttons_message = new Template(
    "template_name",
    new Language("en"),
    new ButtonComponent(
        "quick_reply",
        "reply_1",
        "reply_2"
    )
);
```

## Complex template with call to action url

```ts
import {
    Template,
    Language,
    ButtonComponent
} from "whatsapp-api-js/messages";

const template_call_to_action_message = new Template(
    "template_name",
    new Language("en"),
    new ButtonComponent(
        "url",
        "?user_id=123",
    )
);
```

## OTP prefab template

```ts
import { Template } from "whatsapp-api-js/messages";

const template_otp_message = Template.OTP(
    "template_name",
    new Language("en"),
    "123456"
);
```

## Documentation

https://whatsappapijs.web.app/classes/messages.Template.html
https://whatsappapijs.web.app/classes/messages.HeaderComponent.html
https://whatsappapijs.web.app/classes/messages.BodyComponent.html
https://whatsappapijs.web.app/classes/messages.ButtonComponent.html
