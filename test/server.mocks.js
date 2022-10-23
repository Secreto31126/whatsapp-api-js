const { MockAgent } = require("undici");

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get("https://graph.facebook.com");

module.exports = { agent, client };
