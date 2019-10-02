"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageDelete {
    constructor(discord) {
        this.discord = discord;
        this.run = (message) => {
            // log deleted
            console.log(this.discord);
        };
    }
}
exports.default = MessageDelete;
//# sourceMappingURL=messageDelete.js.map