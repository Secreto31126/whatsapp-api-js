# Interactive

## Reply Buttons

```ts
import {
    Interactive,
    ActionButtons,
    Button,
    Body
} from "whatsapp-api-js/messages";

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
        new ListSection(
            undefined,
            new Row("reply_1", "Hello", "Hello description"),
            new Row("reply_2", "World", "World description")
        )
    ),
    new Body("Hello World")
);
```

## Single Product

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

## Multi Product

```ts
import {
    Interactive,
    ActionProductList,
    ProductSection,
    Product
} from "whatsapp-api-js/messages";

const interactive_multi_product_message = new Interactive(
    new ActionProductList(
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

## Catalog

```ts
import {
    Interactive,
    ActionCatalog,
    Product,
    Body
} from "whatsapp-api-js/messages";

const interactive_catalog_message = new Interactive(
    new ActionCatalog(new Product("hello")),
    new Body("Hello World")
);
```

## Call To Action

```ts
import { Interactive, ActionCTA, Body } from "whatsapp-api-js/messages";

const interactive_catalog_message = new Interactive(
    new ActionCTA("Open Google", "https://google.com"),
    new Body("You should google it")
);
```

## Navigate Flow

```ts
import { Interactive, ActionFlow, Body } from "whatsapp-api-js/messages";

const interactive_navigate_flow_message = new Interactive(
    new ActionFlow({
        flow_action: "navigate",
        flow_token: "5f9b3b4f-2b7a-4f4f-8f4f-4f4f4f4f4f4f",
        flow_name: "my_welcome_flow", // Can also use flow_id instead
        flow_cta: "Start the Flow!",
        mode: "published",
        flow_action_payload: {
            screen: "FIRST_SCREEN",
            data: { name: "John" }
        }
    }),
    new Body("How was your experience today?")
);
```

## Data Exchange Flow

```ts
import { Interactive, ActionFlow, Body } from "whatsapp-api-js/messages";

const interactive_data_exchange_flow_message = new Interactive(
    new ActionFlow({
        flow_action: "data_exchange",
        flow_token: "5f9b3b4f-2b7a-4f4f-8f4f-4f4f4f4f4f4f",
        flow_name: "my_welcome_flow", // Can also use flow_id instead
        flow_cta: "Start the Flow!",
        mode: "published"
    }),
    new Body("Hello World")
);
```

## Location Request

```ts
import { Interactive, ActionLocation, Body } from "whatsapp-api-js/messages";

const interactive_catalog_message = new Interactive(
    new ActionLocation(),
    new Body("Show me where you live")
);
```

## Call Permission Request

```ts
import { Interactive, ActionCallPermission, Body } from "whatsapp-api-js/messages";

const interactive_call_permission_message = new Interactive(
    new ActionCallPermission(),
    new Body("Can we call you?")
);
```

## Payments and Address Request

Check out [#154](https://github.com/Secreto31126/whatsapp-api-js/issues/154) for more information.

## Documentation

https://whatsappapijs.web.app/classes/messages.Interactive.html
https://whatsappapijs.web.app/classes/messages.ActionButtons.html
https://whatsappapijs.web.app/classes/messages.ActionList.html
https://whatsappapijs.web.app/classes/messages.ActionProduct.html
https://whatsappapijs.web.app/classes/messages.ActionProductList.html
https://whatsappapijs.web.app/classes/messages.ActionCatalog.html
https://whatsappapijs.web.app/classes/messages.ActionCTA.html
https://whatsappapijs.web.app/classes/messages.ActionNavigateFlow.html
https://whatsappapijs.web.app/classes/messages.ActionDataExchangeFlow.html
https://whatsappapijs.web.app/classes/messages.ActionLocation.html
https://whatsappapijs.web.app/classes/messages.ActionCallPermission.html
