/* eslint-disable */

const { MockAgent } = require("undici");

const agent = new MockAgent({
    keepAliveTimeout: 10,
    keepAliveMaxTimeout: 10
});
agent.disableNetConnect();

const clientFacebook = agent.get("https://graph.facebook.com");
const clientExample = agent.get("https://example.com");

module.exports = { agent, clientFacebook, clientExample };
