# Template

## Simple template with no variables

```ts
import { Template } from "whatsapp-api-js/messages";

const template_message = new Template(
    "template_name",
    "en"
);
```

## Simple template with simple variables in header and body

```ts
import {
    Template,
    HeaderComponent,
    HeaderParameter,
    BodyComponent,
    BodyParameter,
    Currency,
    DateTime
} from "whatsapp-api-js/messages";

const template_variables_message = new Template(
    "template_name",
    "en",
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
    HeaderComponent,
    HeaderParameter,
    Video
} from "whatsapp-api-js/messages";

const template_media_message = new Template(
    "template_name",
    "en",
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
import { Template, PayloadComponent } from "whatsapp-api-js/messages";

const template_reply_buttons_message = new Template(
    "template_name",
    "en",
    new PayloadComponent(
        "reply_1",
        "reply_2"
    )
);
```

## Complex template with call to action url

```ts
import { Template, URLComponent } from "whatsapp-api-js/messages";

const template_call_to_action_message = new Template(
    "template_name",
    "en",
    new URLComponent(
        "?user_id=123"
    )
);
```

## Complex template with catalog

```ts
import { Template, CatalogComponent, Product } from "whatsapp-api-js/messages";

const template_catalog_message = new Template(
    "template_name",
    "en",
    new CatalogComponent(
        new Product("thumbnail")
    )
);
```

## Complex template with Multi-Product Message

```ts
import {
    Template,
    MPMComponent,
    Product,
    ProductSection
} from "whatsapp-api-js/messages";

const template_call_to_action_message = new Template(
    "template_name",
    "en",
    new MPMComponent(
        new Product("thumbnail"),
        new ProductSection(
            "Section Title",
            new Product("product_1"),
            new Product("product_2")
        ),
        new ProductSection(
            "Another Section",
            new Product("product_3"),
            new Product("product_4")
        )
    )
);
```

## OTP prefab template

```ts
import { Template } from "whatsapp-api-js/messages";

const template_otp_message = Template.OTP(
    "template_name",
    "en",
    "123456"
);
```

## Documentation

https://whatsappapijs.web.app/classes/messages.Template.html
https://whatsappapijs.web.app/classes/messages.HeaderComponent.html
https://whatsappapijs.web.app/classes/messages.BodyComponent.html
https://whatsappapijs.web.app/classes/messages.URLComponent.html
https://whatsappapijs.web.app/classes/messages.PayloadComponent.html
https://whatsappapijs.web.app/classes/messages.CatalogComponent.html
https://whatsappapijs.web.app/classes/messages.MPMComponent.html
