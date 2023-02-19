/* eslint-disable */

const { MockAgent } = require("undici");

const agent = new MockAgent();
agent.disableNetConnect();

const clientFacebook = agent.get("https://graph.facebook.com");
const clientExample = agent.get("https://example.com");

module.exports = { agent, clientFacebook, clientExample };
