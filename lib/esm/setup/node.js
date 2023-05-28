import{webcrypto}from"node:crypto";function NodeNext(settings){return settings}function Node18(settings){return{...settings,ponyfill:{subtle:webcrypto.subtle,...settings.ponyfill}}}function Node15(settings,fetch){return{...settings,ponyfill:{fetch,subtle:webcrypto.subtle,...settings.ponyfill}}}export{Node15,Node18,NodeNext};
//# sourceMappingURL=node.js.map
