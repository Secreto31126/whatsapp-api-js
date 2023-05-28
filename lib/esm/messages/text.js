var e=class{_build(){return JSON.stringify(this)}};var t=class extends e{constructor(r,s){super();if(r.length>4096)throw new Error("Text body must be less than 4096 characters");this.body=r,s&&(this.preview_url=s)}get _type(){return"text"}};export{t as default};
//# sourceMappingURL=text.js.map
