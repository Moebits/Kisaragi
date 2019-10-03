"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class Emojis extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            const emojis = message.guild.emojis;
            const emojiArray = emojis.map((e) => discord.emojis.find((emoji) => e.id === emoji.id));
            const nameArray = emojis.map((e) => e.name);
            const idArray = emojis.map((e) => e.id);
            const createdArray = emojis.map((e) => e.createdAt);
            const step = 5.0;
            const increment = Math.ceil(emojis.size / step);
            const userEmbedArray = [];
            for (let i = 0; i < increment; i++) {
                const userEmbed = embeds.createEmbed();
                let description = "";
                for (let j = 0; j < step; j++) {
                    const value = (i * step) + j;
                    if (!emojiArray[value])
                        break;
                    description += `${discord.getEmoji("star")}_Emoji:_ **${emojiArray[value]}**\n` +
                        `${discord.getEmoji("star")}_Emoji Name:_ ${nameArray[value]}\n` +
                        `${discord.getEmoji("star")}_Emoji ID:_ ${idArray[value]}\n` +
                        `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`;
                }
                userEmbed
                    .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
                    .setTitle(`**${message.guild.name}'s Emojis** ${discord.getEmoji("vigneDead")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`${discord.getEmoji("star")}_Emoji Count:_ **${emojiArray.length}**\n` + description);
                userEmbedArray.push(userEmbed);
            }
            embeds.createReactionEmbed(userEmbedArray);
        };
    }
}
exports.default = Emojis;
//# sourceMappingURL=emojis.js.map