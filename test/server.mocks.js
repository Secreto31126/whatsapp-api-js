import { MockAgent } from "undici";

export const agent = new MockAgent();
agent.disableNetConnect();

export const clientFacebook = agent.get("https://graph.facebook.com");
export const clientExample = agent.get("https://example.com");
