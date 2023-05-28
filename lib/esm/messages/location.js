var ClientMessage=class{_build(){return JSON.stringify(this)}};var Location=class extends ClientMessage{constructor(longitude,latitude,name,address){super();this.longitude=longitude,this.latitude=latitude,name&&(this.name=name),address&&(this.address=address)}get _type(){return"location"}};export{Location as default};
//# sourceMappingURL=location.js.map
