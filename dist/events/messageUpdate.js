"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageUpdate {
    constructor(discord) {
        this.discord = discord;
        this.run = (message) => {
            // log updated
            console.log(this.discord);
        };
    }
}
exports.default = MessageUpdate;
//# sourceMappingURL=messageUpdate.js.map