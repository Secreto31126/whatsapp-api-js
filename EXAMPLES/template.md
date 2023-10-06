# Template

## Simple template with no variables

```ts
import { Template } from "whatsapp-api-js/messages";

const template_message = new Template("template_name", "en");
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
        new HeaderParameter(new Currency(1.5 * 1000, "USD", "U$1.5")),
        new HeaderParameter(new DateTime("01/01/2023"))
    ),
    new BodyComponent(
        new BodyParameter("Hello"),
        new BodyParameter(new Currency(1.5 * 1000, "USD", "U$1.5")),
        new BodyParameter(new DateTime("01/01/2023"))
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
    )
);
```

## Complex template with reply buttons

```ts
import { Template, PayloadComponent } from "whatsapp-api-js/messages";

const template_reply_buttons_message = new Template(
    "template_name",
    "en",
    new PayloadComponent("reply_1"),
    new PayloadComponent("reply_2")
);
```

## Complex template with call to action urls

```ts
import { Template, URLComponent } from "whatsapp-api-js/messages";

const template_call_to_action_message = new Template(
    "template_name",
    "en",
    new URLComponent("?user_id=123"),
    new URLComponent("?user_id=456")
);
```

## Complex template with copy coupon button

```ts
import { Template, CopyComponent } from "whatsapp-api-js/messages";

const template_copy_coupon_message = new Template(
    "template_name",
    "en",
    new CopyComponent("PROMO10")
);
```

## Complex template with combination of buttons

```ts
import {
    Template,
    CopyComponent,
    URLComponent,
    PayloadComponent
} from "whatsapp-api-js/messages";

const template_mixed_buttons_message = new Template(
    "template_name",
    "en",
    new CopyComponent("PROMO10"),
    new URLComponent("?code=PROMO10"),
    new PayloadComponent("send_catalog")
);
```

## Complex template with catalog

```ts
import { Template, CatalogComponent, Product } from "whatsapp-api-js/messages";

const template_catalog_message = new Template(
    "template_name",
    "en",
    new CatalogComponent(new Product("thumbnail"))
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

const template_multi_product_message = new Template(
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

## Complex template with Carousel

```ts
import {
    Template,
    BodyComponent,
    CarouselComponent,
    CarouselCard,
    Image,
    URLComponent
} from "whatsapp-api-js/messages";

const template_carousel_message = new Template(
    "template_name",
    "en",
    new BodyComponent(new BodyParameter("PROMO10")),
    new CarouselComponent(
        new CarouselCard(
            new Image(image),
            new URLComponent("?code=PROMO10&product=1")
        ),
        new CarouselCard(
            new Image(image),
            new URLComponent("?code=PROMO10&product=2")
        )
    )
);
```

## Complex template with Limited-Time Offer

```ts
import {
    Template,
    LTOComponent,
    URLComponent,
    CopyComponent
} from "whatsapp-api-js/messages";

const template_limited_time_offer_message = new Template(
    "template_name",
    "en",
    new LTOComponent(1696622508595),
    new CopyComponent("PROMO10"),
    new URLComponent("?code=PROMO10&product=1")
);
```

## OTP prefab template

```ts
import { Template } from "whatsapp-api-js/messages";

const template_otp_message = Template.OTP("template_name", "en", "123456");
```

## Documentation

https://whatsappapijs.web.app/classes/messages.Template.html
https://whatsappapijs.web.app/classes/messages.HeaderComponent.html
https://whatsappapijs.web.app/classes/messages.BodyComponent.html
https://whatsappapijs.web.app/classes/messages.URLComponent.html
https://whatsappapijs.web.app/classes/messages.PayloadComponent.html
https://whatsappapijs.web.app/classes/messages.CopyComponent.html
https://whatsappapijs.web.app/classes/messages.CatalogComponent.html
https://whatsappapijs.web.app/classes/messages.MPMComponent.html
https://whatsappapijs.web.app/classes/messages.CarouselComponent.html
https://whatsappapijs.web.app/classes/messages.LTOComponent.html
