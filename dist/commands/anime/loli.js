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
const Loli = require("lolis.life");
class LoliCommand extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const loli = new Loli();
            const loliEmbed = embeds.createEmbed();
            const result = (args[1] === "hentai") ? yield loli.getNSFWLoli() : yield loli.getSFWLoli();
            loliEmbed
                .setTitle(`**Loli** ${discord.getEmoji("madokaLewd")}`)
                .setImage(result.url);
            message.channel.send(loliEmbed);
        });
    }
}
exports.default = LoliCommand;
//# sourceMappingURL=loli.js.map