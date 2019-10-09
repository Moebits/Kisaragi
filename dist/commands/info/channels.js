"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class Channels extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            const channels = message.guild.channels;
            const channelArray = channels.map((t) => t.name);
            const idArray = channels.map((t) => t.id);
            const createdArray = channels.map((t) => t.createdAt);
            const step = 7.0;
            const increment = Math.ceil(channels.size / step);
            const userEmbedArray = [];
            for (let i = 0; i < increment; i++) {
                const userEmbed = embeds.createEmbed();
                let description = "";
                for (let j = 0; j < step; j++) {
                    const value = (i * step) + j;
                    if (!channelArray[value])
                        break;
                    description += `${discord.getEmoji("star")}_Channel:_ **${channelArray[value]}**\n` +
                        `${discord.getEmoji("star")}_Channel ID:_ ${idArray[value]}\n` +
                        `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`;
                }
                userEmbed
                    .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
                    .setTitle(`**${message.guild.name}'s Channels** ${discord.getEmoji("vigneDead")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`${discord.getEmoji("star")}_Channel Count:_ **${channelArray.length}**\n` + description);
                userEmbedArray.push(userEmbed);
            }
            embeds.createReactionEmbed(userEmbedArray);
        };
    }
}
exports.default = Channels;
//# sourceMappingURL=channels.js.map