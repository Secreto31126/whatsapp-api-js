# Template

## Simple template with no variables

```ts
const template_message = new Template(
    "template_name",
    new Language("en")
);
```

## Simple template with simple variables in header and body

```ts
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
const template_media_message = new Template(
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
const template_media_message = new Template(
    "template_name",
    new Language("en"),
    new ButtonComponent(
        "url",
        "?user_id=123",
        "?user_id=123&&product_id=456"
    )
);
```

## Documentation

https://whatsappapijs.web.app/classes/messages.Template.html
https://whatsappapijs.web.app/classes/messages.HeaderComponent.html
https://whatsappapijs.web.app/classes/messages.BodyComponent.html
https://whatsappapijs.web.app/classes/messages.ButtonComponent.html