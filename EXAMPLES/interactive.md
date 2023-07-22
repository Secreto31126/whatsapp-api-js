# Interactive

## Reply Buttons

```ts
import { Interactive, ActionButtons, Button, Body } from "whatsapp-api-js/messages";

const interactive_button_message = new Interactive(
    new ActionButtons(
        new Button("reply_1", "Hello"),
        new Button("reply_2", "World")
    ),
    new Body("Hello World")
);
```

## Options list

```ts
import { Interactive, ActionList, Row, Body } from "whatsapp-api-js/messages";

const interactive_list_message = new Interactive(
    new ActionList(
        "Button text",
        new ListSection(undefined,
            new Row("reply_1", "Hello", "Hello description"),
            new Row("reply_2", "World", "World description")
        )
    ),
    new Body("Hello World")
);
```

## Product

```ts
import { Interactive, ActionCatalog, Product } from "whatsapp-api-js/messages";

const interactive_product_message = new Interactive(
    new ActionCatalog(
        "catalog_id",
        new Product("product_id")
    )
);
```

## Product list

```ts
import { Interactive, ActionCatalog, ProductSection, Product } from "whatsapp-api-js/messages";

const interactive_catalog_message = new Interactive(
    new ActionCatalog(
        "catalog_id",
        new ProductSection(
            "Product section title",
            new Product("product_id"),
            new Product("product_id")
        )
    ),
    new Body("Hello World"),
    new Header("Hello World Header")
);
```

## Payments and Location request

Check out [#154](https://github.com/Secreto31126/whatsapp-api-js/issues/154) for more information.

## Documentation

https://whatsappapijs.web.app/classes/messages.Interactive.html
https://whatsappapijs.web.app/classes/messages.ActionButtons.html
https://whatsappapijs.web.app/classes/messages.ActionList.html
https://whatsappapijs.web.app/classes/messages.ActionCatalog.html
