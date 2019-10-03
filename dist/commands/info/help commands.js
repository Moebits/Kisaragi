"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
class HelpCommands extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            // nothing
        };
    }
}
exports.default = HelpCommands;
//# sourceMappingURL=help commands.js.map