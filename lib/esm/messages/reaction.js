var e=class{_build(){return JSON.stringify(this)}};var r=class extends e{constructor(i,t=""){super();if(t&&!/^\p{Extended_Pictographic}$/u.test(t))throw new Error("Reaction emoji must be a single emoji");this.message_id=i,this.emoji=t}get _type(){return"reaction"}};export{r as default};
//# sourceMappingURL=reaction.js.map
