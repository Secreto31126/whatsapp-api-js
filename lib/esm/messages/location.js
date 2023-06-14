var ClientMessage=class{_build(){return JSON.stringify(this)}};var Location=class extends ClientMessage{longitude;latitude;name;address;get _type(){return"location"}constructor(longitude,latitude,name,address){super(),this.longitude=longitude,this.latitude=latitude,name&&(this.name=name),address&&(this.address=address)}};export{Location as default};
//# sourceMappingURL=location.js.map
