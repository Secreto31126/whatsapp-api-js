var p=class{_build(){return JSON.stringify(this)}};var o=class{constructor(t,e,r,s){if(r.length>s)throw new Error(`${t} can't have more than ${s} ${e}`)}};var l=class extends p{constructor(e,r,s,i){super();if(e._type!=="product"&&!r)throw new Error("Interactive must have a body component");if(e._type==="product"&&s)throw new Error("Interactive must not have a header component if action is a single product");if(e._type==="product_list"&&s?.type!=="text")throw new Error("Interactive must have a text header component if action is a product list");if(s&&e._type!=="button"&&s?.type!=="text")throw new Error("Interactive header must be of type text");this.type=e._type,this.action=e,r&&(this.body=r),s&&(this.header=s),i&&(this.footer=i)}get _type(){return"interactive"}},u=class{constructor(t){if(t.length>1024)throw new Error("Body text must be less than 1024 characters");this.text=t}},y=class{constructor(t){if(t.length>60)throw new Error("Footer text must be 60 characters or less");this.text=t}},m=class{constructor(t){if(typeof t=="string"){if(t.length>60)throw new Error("Header text must be 60 characters or less");this.type="text"}else if(this.type=t._type,"caption"in t)throw new Error(`Header ${this.type} must not have a caption`);this[this.type]=t}},h=class extends o{constructor(...e){super("Reply buttons","button",e,3);let r=e.map(i=>i[i.type].id);if(r.length!==new Set(r).size)throw new Error("Reply buttons must have unique ids");let s=e.map(i=>i[i.type].title);if(s.length!==new Set(s).size)throw new Error("Reply buttons must have unique titles");this.buttons=e}get _type(){return"button"}},v=class{constructor(t,e){if(t.length>256)throw new Error("Button id must be 256 characters or less");if(/^ | $/.test(t))throw new Error("Button id cannot have leading or trailing spaces");if(!e.length)throw new Error("Button title cannot be an empty string");if(e.length>20)throw new Error("Button title must be 20 characters or less");this.type="reply",this.reply={title:e,id:t}}},_=class extends o{constructor(e,...r){super("Action","sections",r,10);if(!e.length)throw new Error("Button content cannot be an empty string");if(e.length>20)throw new Error("Button content must be 20 characters or less");if(r.length>1&&!r.every(s=>"title"in s))throw new Error("All sections must have a title if more than 1 section is provided");this.button=e,this.sections=r}get _type(){return"list"}},g=class extends o{constructor(e,r,s,i,a,d=24){super(e,r,s,i);if(a&&a.length>d)throw new Error(`${e} title must be ${d} characters or less`);a&&(this.title=a)}},x=class extends g{constructor(e,...r){super("ListSection","rows",r,10,e);this.rows=r}},S=class{constructor(t,e,r){if(t.length>200)throw new Error("Row id must be 200 characters or less");if(e.length>24)throw new Error("Row title must be 24 characters or less");if(r&&r.length>72)throw new Error("Row description must be 72 characters or less");this.id=t,this.title=e,r&&(this.description=r)}};function b(n){return n[0]instanceof c}var f=class{get _type(){return this.product_retailer_id?"product":"product_list"}constructor(t,...e){let r=b(e);if(r&&e.length>1){if(e.length>10)throw new Error("Catalog must have between 1 and 10 product sections");for(let s of e)if(!("title"in s))throw new Error("All sections must have a title if more than 1 section is provided")}this.catalog_id=t,r?this.sections=e:this.product_retailer_id=e[0].product_retailer_id}},c=class extends g{constructor(e,...r){super("ProductSection","products",r,30,e);this.product_items=r}},w=class{constructor(t){this.product_retailer_id=t}};export{h as ActionButtons,f as ActionCatalog,_ as ActionList,u as Body,v as Button,y as Footer,m as Header,l as Interactive,x as ListSection,w as Product,c as ProductSection,S as Row,g as Section};
//# sourceMappingURL=interactive.js.map