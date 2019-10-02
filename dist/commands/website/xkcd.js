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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xkcd_1 = __importDefault(require("xkcd"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Xkcd extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const xkcdEmbed = embeds.createEmbed();
            const monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            if (args[1]) {
                yield xkcd_1.default(Number(args[1]), (comic) => {
                    const cleanText = comic.transcript.replace(/\[\[/g, "**").replace(/\]\]/g, "**").replace(/{{/g, "_").replace(/}}/g, "_");
                    const checkedText = Functions_1.Functions.checkChar(cleanText, 2000, ",");
                    xkcdEmbed
                        .setAuthor("xkcd", "https://images-na.ssl-images-amazon.com/images/I/51qKVpRPnDL._SY355_.png")
                        .setURL(`https://xkcd.com/${comic.num}/`)
                        .setTitle(`**xkcd Comic** ${discord.getEmoji("kannaSpook")}`)
                        .setDescription(`${discord.getEmoji("star")}_Title:_ **${comic.title}**\n` +
                        `${discord.getEmoji("star")}_ID:_ **${comic.num}**\n` +
                        `${discord.getEmoji("star")}_Date:_ **${monthNames[comic.month]} ${comic.day}, ${comic.year}**\n` +
                        `${discord.getEmoji("star")}_Transcript_: ${checkedText ? checkedText : "None"}\n`)
                        .setThumbnail(message.author.displayAvatarURL())
                        .setImage(comic.img);
                    message.channel.send(xkcdEmbed);
                });
            }
            else {
                yield xkcd_1.default((comic) => {
                    const cleanText = comic.transcript.replace(/\[\[/g, "**").replace(/\]\]/g, "**").replace(/{{/g, "_").replace(/}}/g, "_");
                    const checkedText = Functions_1.Functions.checkChar(cleanText, 2000, ",");
                    xkcdEmbed
                        .setAuthor("xkcd", "https://images-na.ssl-images-amazon.com/images/I/51qKVpRPnDL._SY355_.png")
                        .setURL(`https://xkcd.com/${comic.num}/`)
                        .setTitle(`**xkcd Comic** ${discord.getEmoji("kannaSpook")}`)
                        .setDescription(`${discord.getEmoji("star")}_Title:_ **${comic.title}**\n` +
                        `${discord.getEmoji("star")}_ID:_ **${comic.num}**\n` +
                        `${discord.getEmoji("star")}_Date:_ **${monthNames[comic.month]} ${comic.day}, ${comic.year}**\n` +
                        `${discord.getEmoji("star")}_Transcript_: ${checkedText ? checkedText : "None"}\n`)
                        .setThumbnail(message.author.displayAvatarURL())
                        .setImage(comic.img);
                    message.channel.send(xkcdEmbed);
                });
            }
        });
    }
}
exports.default = Xkcd;
//# sourceMappingURL=xkcd.js.map