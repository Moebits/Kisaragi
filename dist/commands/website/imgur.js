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
const imgur_1 = __importDefault(require("imgur"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Imgur extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            yield imgur_1.default.setClientId(process.env.IMGUR_discord_ID);
            yield imgur_1.default.setAPIUrl("https://api.imgur.com/3/");
            const query = Functions_1.Functions.combineArgs(args, 1);
            const json = yield imgur_1.default.search(query);
            const random = Math.floor(Math.random() * json.data.length);
            const image = json.data[random];
            if (!image) {
                const imgurEmbed = embeds.createEmbed();
                imgurEmbed
                    .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg")
                    .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
                    .setDescription("No results were found! Try searching for a tag on the imgur website.\n" +
                    "[Imgur Website](https://imgur.com/)");
                message.channel.send(imgurEmbed);
                return;
            }
            else if (image.images.length === 1) {
                const imgurEmbed = embeds.createEmbed();
                let extension;
                switch (image.images[0].type.slice(-3)) {
                    case "mp4":
                        extension = "gif";
                        break;
                    case "peg":
                        extension = "jpeg";
                        break;
                    default: extension = image.images[0].type.slice(-3);
                }
                const cover = `https://imgur.com/${image.images[0].id}.${extension}`;
                imgurEmbed
                    .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg")
                    .setURL(image.link)
                    .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
                    .setDescription(`${discord.getEmoji("star")}_Title:_ **${image.title}**\n` +
                    `${discord.getEmoji("star")}_Account:_ **${image.account_url}**\n` +
                    `${discord.getEmoji("star")}**${image.ups}** ${discord.getEmoji("up")} **${image.downs}** ${discord.getEmoji("down")}\n` +
                    `${discord.getEmoji("star")}_Views:_ **${image.views}**\n` +
                    `${discord.getEmoji("star")}_Animated:_ **${image.images[0].animated ? "Yes" : "No"}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${image.description ? image.description : "None"}\n`)
                    .setImage(cover);
                message.channel.send(imgurEmbed);
                return;
            }
            else {
                const imageArray = [];
                for (let i = 0; i < image.images.length - 1; i++) {
                    console.log(i);
                    const imgurEmbed = embeds.createEmbed();
                    let extension;
                    switch (image.images[i].type.slice(-3)) {
                        case "mp4":
                            extension = "gif";
                            break;
                        case "peg":
                            extension = "jpeg";
                            break;
                        default: extension = image.images[i].type.slice(-3);
                    }
                    const cover = `https://imgur.com/${image.images[i].id}.${extension}`;
                    imgurEmbed
                        .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg")
                        .setURL(image.link)
                        .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
                        .setDescription(`${discord.getEmoji("star")}_Title:_ **${image.title}**\n` +
                        `${discord.getEmoji("star")}_Account:_ **${image.account_url}**\n` +
                        `${discord.getEmoji("star")}**${image.ups}** ${discord.getEmoji("up")} **${image.downs}** ${discord.getEmoji("down")}\n` +
                        `${discord.getEmoji("star")}_Views:_ **${image.views}**\n` +
                        `${discord.getEmoji("star")}_Animated:_ **${image.images[i].animated ? "Yes" : "No"}**\n` +
                        `${discord.getEmoji("star")}_Description:_ ${image.description ? image.description : "None"}\n`)
                        .setImage(cover);
                    console.log(image);
                    imageArray.push(imgurEmbed);
                }
                embeds.createReactionEmbed(imageArray);
            }
        });
    }
}
exports.default = Imgur;
//# sourceMappingURL=imgur.js.map