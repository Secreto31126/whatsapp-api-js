import NodeHTTPMiddleware from"./node-http.js";import{isInteger}from"../utils.js";class WhatsAppAPI extends NodeHTTPMiddleware{handle_post(req){return super.handle_post(req)}handle_get(req){try{return this.get(req.query)}catch(e){throw isInteger(e)?e:500}}}export{WhatsAppAPI as default};
//# sourceMappingURL=vercel.js.map
