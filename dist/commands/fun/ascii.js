"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Ascii extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const ascii = require("ascii-art");
            const asciiEmbed = embeds.createEmbed();
            const text = Functions_1.Functions.combineArgs(args, 1);
            if (!text)
                return;
            ascii.font(text, "Doom", (asciiText) => {
                asciiEmbed
                    .setTitle(`**Ascii Art** ${discord.getEmoji("kannaSip")}`)
                    .setDescription("```" + Functions_1.Functions.checkChar(asciiText, 2000, "|") + "```");
                message.channel.send(asciiEmbed);
            });
        });
    }
}
exports.default = Ascii;
//# sourceMappingURL=ascii.js.map