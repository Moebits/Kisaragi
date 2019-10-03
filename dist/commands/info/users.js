"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("../../structures/Embeds");
class Users extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            const members = message.guild.members;
            const userArray = members.map((m) => `${m.user.username}#${m.user.discriminator}`);
            const idArray = members.map((m) => m.user.id);
            const joinArray = members.map((m) => m.joinedAt);
            const step = 7.0;
            const increment = Math.ceil(members.size / step);
            const userEmbedArray = [];
            for (let i = 0; i < increment; i++) {
                const userEmbed = embeds.createEmbed();
                let description = "";
                for (let j = 0; j < step; j++) {
                    const value = (i * step) + j;
                    if (!userArray[value])
                        break;
                    description += `${discord.getEmoji("star")}_User:_ **${userArray[value]}**\n` +
                        `${discord.getEmoji("star")}_User ID:_ ${idArray[value]}\n` +
                        `${discord.getEmoji("star")}_Join Date:_ ${joinArray[value]}\n`;
                }
                userEmbed
                    .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
                    .setTitle(`**${message.guild.name}'s Members** ${discord.getEmoji("vigneDead")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`${discord.getEmoji("star")}_Member Count:_ **${message.guild.memberCount}**\n` + description);
                userEmbedArray.push(userEmbed);
            }
            embeds.createReactionEmbed(userEmbedArray);
        };
    }
}
exports.default = Users;
//# sourceMappingURL=users.js.map