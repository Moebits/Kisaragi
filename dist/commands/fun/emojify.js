"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Functions_1 = require("./../../structures/Functions");
const Letters_1 = require("./../../structures/Letters");
class Emojify extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const letters = new Letters_1.Letters(discord);
            const text = Functions_1.Functions.combineArgs(args, 1);
            const emojiFied = letters.letters(text);
            message.channel.send(`>${emojiFied}`);
        };
    }
}
exports.default = Emojify;
//# sourceMappingURL=emojify.js.map