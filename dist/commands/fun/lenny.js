"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const lenny = require("lenny");
class Lenny extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            if (args[1] === "face") {
                message.channel.send("( ͡° ͜ʖ ͡°)");
            }
            else if (args[1] === "shrug") {
                message.channel.send("¯\\_(ツ)_/¯");
            }
            else if (args[1] === "tableflip") {
                message.channel.send("(╯°□°）╯︵ ┻━┻");
            }
            else if (args[1] === "unflip") {
                message.channel.send("┬─┬ ノ( ゜-゜ノ)");
            }
            else {
                message.channel.send(lenny());
            }
        };
    }
}
exports.default = Lenny;
//# sourceMappingURL=lenny.js.map