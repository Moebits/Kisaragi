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
const hibp_1 = require("hibp");
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Pwned extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            if (!args[1]) {
                const result = yield hibp_1.breaches();
                const pwnedArray = [];
                for (let i = 0; i < result.length; i++) {
                    const pwnedEmbed = embeds.createEmbed();
                    pwnedEmbed
                        .setAuthor("have i been pwned", "https://pbs.twimg.com/profile_images/414900961371377664/eulz0TdB_400x400.png")
                        .setTitle(`**Pwned Databases** ${discord.getEmoji("sagiriBleh")}`)
                        .setURL("https://haveibeenpwned.com/PwnedWebsites")
                        .setThumbnail(result[i].LogoPath)
                        .setDescription(`${discord.getEmoji("star")}_Website:_ **${result[i].Name}**\n` +
                        `${discord.getEmoji("star")}_Breach Date:_ **${Functions_1.Functions.formatDate(new Date(result[i].BreachDate))}**\n` +
                        `${discord.getEmoji("star")}_Pwned Records:_ **${result[i].PwnCount}**\n` +
                        `${discord.getEmoji("star")}_Pwned Data:_ **${result[i].DataClasses.join(", ")}**\n` +
                        `${discord.getEmoji("star")}_Description:_ ${result[i].Description.replace(/<\/?[^>]+(>|$)/g, "")}\n`);
                    pwnedArray.push(pwnedEmbed);
                }
                embeds.createReactionEmbed(pwnedArray);
                return;
            }
            const query = Functions_1.Functions.combineArgs(args, 1);
            const result = yield hibp_1.breach(query);
            const pwnedEmbed = embeds.createEmbed();
            pwnedEmbed
                .setAuthor("have i been pwned", "https://pbs.twimg.com/profile_images/414900961371377664/eulz0TdB_400x400.png")
                .setTitle(`**Pwned Databases** ${discord.getEmoji("sagiriBleh")}`)
                .setURL("https://haveibeenpwned.com/PwnedWebsites")
                .setThumbnail(result.LogoPath)
                .setDescription(`${discord.getEmoji("star")}_Website:_ **${result.Name}**\n` +
                `${discord.getEmoji("star")}_Breach Date:_ **${Functions_1.Functions.formatDate(new Date(result.BreachDate))}**\n` +
                `${discord.getEmoji("star")}_Pwned Records:_ **${result.PwnCount}**\n` +
                `${discord.getEmoji("star")}_Pwned Data:_ **${result.DataClasses.join(", ")}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${result.Description.replace(/<\/?[^>]+(>|$)/g, "")}\n`);
            message.channel.send(pwnedEmbed);
        });
    }
}
exports.default = Pwned;
//# sourceMappingURL=pwned.js.map