"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const active = new Set();
class MessageReactionRemove {
    constructor(discord) {
        this.discord = discord;
        this.run = (reaction) => {
            // nothing here lol
            console.log(this.discord);
            console.log(active);
        };
    }
}
exports.default = MessageReactionRemove;
//# sourceMappingURL=messageReactionRemove.js.map