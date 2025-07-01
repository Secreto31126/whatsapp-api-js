# Contributing:

This project accepts PR! Just keep in mind the following rules:

1. If you are planning to write a new feature or bug fix,
   consider opening an issue to get a confirmation
    - Minor changes like typos fixes in documentation can be
      created without previous discussion

2. If deemed necesary, add unit tests that cover the feature or prevents the bug fix

3. Before committing, remember to run prettier and eslint to fix
   syntax and format issues (will setup husky in the future)

4. Follow the server agnostic "philosophy" of the library, avoid using runtime specific features unless strictly required

## Setup

```sh
git clone https://github.com/secreto31126/whatsapp-api-js.git
```

```sh
cd whatsapp-api-js
```

```sh
npm ci
```

```sh
npm run test:build
```
