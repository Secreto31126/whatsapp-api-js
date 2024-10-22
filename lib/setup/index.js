// src/setup/bun.ts
function Bun(settings) {
  return settings;
}

// src/setup/deno.ts
function Deno(settings) {
  return settings;
}

// src/setup/web.ts
function Web(settings) {
  return settings;
}

// src/setup/node.ts
import { webcrypto } from "node:crypto";
function NodeNext(settings) {
  return settings;
}
function Node18(settings) {
  return {
    ...settings,
    ponyfill: {
      subtle: webcrypto.subtle,
      ...settings.ponyfill
    }
  };
}
function Node15(settings, fetch_ponyfill) {
  return {
    ...settings,
    ponyfill: {
      fetch: fetch_ponyfill,
      subtle: webcrypto.subtle,
      ...settings.ponyfill
    }
  };
}
export {
  Bun,
  Deno,
  Node15,
  Node18,
  NodeNext,
  Web
};
