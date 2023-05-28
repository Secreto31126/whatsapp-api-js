var ClientMessage=class{_build(){return JSON.stringify(this)}};var Text=class extends ClientMessage{constructor(body,preview_url){super();if(body.length>4096)throw new Error("Text body must be less than 4096 characters");this.body=body,preview_url&&(this.preview_url=preview_url)}get _type(){return"text"}};export{Text as default};
//# sourceMappingURL=text.js.map
