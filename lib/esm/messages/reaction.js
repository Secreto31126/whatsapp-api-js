import{ClientMessage}from"../types.js";class Reaction extends ClientMessage{message_id;emoji;get _type(){return"reaction"}constructor(message_id,emoji=""){if(super(),emoji&&!/^\p{Extended_Pictographic}$/u.test(emoji))throw new Error("Reaction emoji must be a single emoji");this.message_id=message_id,this.emoji=emoji}}export{Reaction};
//# sourceMappingURL=reaction.js.map
