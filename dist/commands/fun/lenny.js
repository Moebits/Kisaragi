"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lenny = __importStar(require("lenny"));
const Command_1 = require("../../structures/Command");
class Lenny extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
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