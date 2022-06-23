// Unit tests with mocha
import { equal, throws } from 'assert';
import pkg from '../index.js';

const { WhatsAppAPI, Types } = pkg;
const { Text } = Types;

describe("WhatsAppAPI", () => {
    describe("Token", () => {
        it("should fail if no access token is provided", () => {
            throws(() => {
                const Whatsapp = new WhatsAppAPI();
            });
        });

        it("", () => {});
    });

    describe("Version", () => {
        it("should work with v14.0 as default", () => {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");
            equal(Whatsapp.v, "v14.0");
        });
    });
    
    describe("Message", () => {
        it("should be able to send a message", () => {
            const Whatsapp = new WhatsAppAPI("YOUR_ACCESS_TOKEN");
            
        });
    });
});
