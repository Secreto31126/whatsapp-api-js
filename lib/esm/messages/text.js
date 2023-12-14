import{ClientMessage}from"../types.js";class Text extends ClientMessage{body;preview_url;get _type(){return"text"}constructor(body,preview_url){if(super(),body.length>4096)throw new Error("Text body must be less than 4096 characters");this.body=body,preview_url&&(this.preview_url=preview_url)}}export{Text,Text as default};
//# sourceMappingURL=text.js.map
