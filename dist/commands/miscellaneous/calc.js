"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = __importDefault(require("mathjs"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Calc extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            const input = Functions_1.Functions.combineArgs(args, 1);
            const result = mathjs_1.default.eval(input);
            const calcEmbed = embeds.createEmbed();
            calcEmbed
                .setTitle(`**Math Calculation** ${discord.getEmoji("vigneDead")}`)
                .setDescription(result);
            message.channel.send(calcEmbed);
        };
    }
}
exports.default = Calc;
//# sourceMappingURL=calc.js.map