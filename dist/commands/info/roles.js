"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class Roles extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            const roles = message.guild.roles;
            const roleArray = roles.map((r) => r.name);
            const idArray = roles.map((r) => r.id);
            const createdArray = roles.map((r) => r.createdAt);
            const step = 7.0;
            const increment = Math.ceil(roles.size / step);
            const userEmbedArray = [];
            for (let i = 0; i < increment; i++) {
                const userEmbed = embeds.createEmbed();
                let description = "";
                for (let j = 0; j < step; j++) {
                    const value = (i * step) + j;
                    if (!roleArray[value])
                        break;
                    description += `${discord.getEmoji("star")}_Role:_ **${roleArray[value]}**\n` +
                        `${discord.getEmoji("star")}_Role ID:_ ${idArray[value]}\n` +
                        `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`;
                }
                userEmbed
                    .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
                    .setTitle(`**${message.guild.name}'s Roles** ${discord.getEmoji("vigneDead")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`${discord.getEmoji("star")}_Role Count:_ **${roleArray.length}**\n` + description);
                userEmbedArray.push(userEmbed);
            }
            embeds.createReactionEmbed(userEmbedArray);
        };
    }
}
exports.default = Roles;
//# sourceMappingURL=roles.js.map