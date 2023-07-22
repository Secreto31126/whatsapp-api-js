# Contacts

## Simple contact

```ts
import { Contacts, Name, Address, Phone } from "whatsapp-api-js/messages";

const contact_message = new Contacts([
    new Name("John Doe", "John", "Doe", undefined, "Mr.", "Jr."),
    new Address("United States", "US", "FL", "Miami", "221B Baker Street", "33101", "Mystery"),
    new Phone("+123456789", "Mystery", "123456789")
]);
```

## Multiple contacts

```ts
import { Contacts, Name, Address, Phone } from "whatsapp-api-js/messages";

const multi_contacts_message = new Contacts(
    [
        new Name("John Doe", "John", "Doe", undefined, "Mr.", "Jr."),
        new Address("United States", "US", "FL", "Miami", "221A Baker Street", "33101", "Mystery"),
        new Phone("+123456789", "Mystery", "123456789")
    ],
    [
        new Name("John Another Doe", "John", "Doe", "Another"),
        new Address("United Kindom", "UK", "BS", "London", "221B Baker Street", "33101", "Mystery"),
        new Phone("+123456789", "Mystery", "123456789")
    ]
);
```

## Complex contact

There's a lot more options for each contact field,
some which can be repeated, some which are optional.
Check out the documentation for more information.

## Documentation

https://whatsappapijs.web.app/classes/messages.Contacts.html
https://whatsappapijs.web.app/classes/types.ContactMultipleComponent.html
https://whatsappapijs.web.app/classes/types.ContactUniqueComponent.html
