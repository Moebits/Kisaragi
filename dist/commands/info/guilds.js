"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class Guilds extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            const guilds = discord.guilds;
            const guildArray = guilds.map((g) => g.name);
            const idArray = guilds.map((g) => g.id);
            const createdArray = guilds.map((g) => g.createdAt);
            const step = 7.0;
            const increment = Math.ceil(guilds.size / step);
            const userEmbedArray = [];
            for (let i = 0; i < increment; i++) {
                const userEmbed = embeds.createEmbed();
                let description = "";
                for (let j = 0; j < step; j++) {
                    const value = (i * step) + j;
                    if (!guildArray[value])
                        break;
                    description += `${discord.getEmoji("star")}_Guild:_ **${guildArray[value]}**\n` +
                        `${discord.getEmoji("star")}_Guild ID:_ ${idArray[value]}\n` +
                        `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`;
                }
                userEmbed
                    .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
                    .setTitle(`**${discord.user.username}'s Guilds** ${discord.getEmoji("vigneDead")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`${discord.getEmoji("star")}_Guild Count:_ **${guildArray.length}**\n` + description);
                userEmbedArray.push(userEmbed);
            }
            embeds.createReactionEmbed(userEmbedArray);
        };
    }
}
exports.default = Guilds;
//# sourceMappingURL=guilds.js.map