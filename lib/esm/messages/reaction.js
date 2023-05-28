var ClientMessage=class{_build(){return JSON.stringify(this)}};var Reaction=class extends ClientMessage{constructor(message_id,emoji=""){super();if(emoji&&!/^\p{Extended_Pictographic}$/u.test(emoji))throw new Error("Reaction emoji must be a single emoji");this.message_id=message_id,this.emoji=emoji}get _type(){return"reaction"}};export{Reaction as default};
//# sourceMappingURL=reaction.js.map
