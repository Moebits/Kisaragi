"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const syllable_1 = __importDefault(require("syllable"));
const Embeds_1 = require("./Embeds");
class Haiku {
    constructor(discord) {
        this.discord = discord;
        // Haiku
        this.haiku = (message) => {
            const embeds = new Embeds_1.Embeds(this.discord, message);
            const wordArray = message.content.replace(/\s+/g, " ").split(" ");
            let lineCount1 = 0;
            let lineCount2 = 0;
            let lineCount3 = 0;
            const line1 = [];
            const line2 = [];
            const line3 = [];
            for (let i = 0; i < wordArray.length; i++) {
                if (lineCount1 !== 5) {
                    lineCount1 += syllable_1.default(wordArray[i]);
                    line1.push(wordArray[i]);
                    continue;
                }
                if (lineCount1 === 5 && lineCount2 !== 7) {
                    lineCount2 += syllable_1.default(wordArray[i]);
                    line2.push(wordArray[i]);
                    continue;
                }
                if (lineCount2 === 7) {
                    lineCount3 += syllable_1.default(wordArray[i]);
                    line3.push(wordArray[i]);
                }
            }
            if (lineCount3 === 5) {
                const haikuEmbed = embeds.createEmbed();
                haikuEmbed
                    .setTitle(`**Haiku** ${this.discord.getEmoji("vigneXD")}`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setDescription(`${line1.join(" ")}\n` +
                    `${line2.join(" ")}\n` +
                    `${line3.join(" ")}\n` +
                    "\n" +
                    `**- ${message.author.username}**\n`);
                message.channel.send(haikuEmbed);
            }
        };
    }
}
exports.Haiku = Haiku;
//# sourceMappingURL=Haiku.js.map