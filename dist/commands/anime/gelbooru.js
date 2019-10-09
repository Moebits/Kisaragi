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
const booru_1 = __importDefault(require("booru"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Gelbooru extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const gelbooru = booru_1.default("gelbooru", process.env.GELBOORU_API_KEY);
            const gelbooruEmbed = embeds.createEmbed();
            const axios = require("axios");
            let tags;
            if (!args[1]) {
                tags = ["rating:safe"];
            }
            else if (args[1].toLowerCase() === "r18") {
                tags = Functions_1.Functions.combineArgs(args, 2).split(",");
                tags.push("-rating:safe");
            }
            else {
                tags = Functions_1.Functions.combineArgs(args, 1).split(",");
                tags.push("rating:safe");
            }
            if (!tags.join(" ")) {
                gelbooruEmbed
                    .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
                    .setTitle(`**Danbooru Search** ${discord.getEmoji("gabLewd")}`)
                    .setDescription("No results were found. Underscores are not required, " +
                    "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                    "on the gelbooru website.\n" + "[Gelbooru Website](https://gelbooru.com//)");
                message.channel.send(gelbooruEmbed);
                return;
            }
            const tagArray = [];
            for (let i = 0; i < tags.length; i++) {
                tagArray.push(tags[i].trim().replace(/ /g, "_"));
            }
            let url;
            if (tags.join("").match(/\d\d+/g)) {
                url = `https://gelbooru.com/index.php?page=post&s=view&id=${tags.join("").match(/\d+/g)}`;
            }
            else {
                const image = yield gelbooru.search(tagArray, { limit: 1, random: true });
                url = gelbooru.postView(image[0].id);
            }
            const id = url.match(/\d+/g).join("");
            const result = yield axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&id=${id}${process.env.GELBOORU_API_KEY}`);
            const img = result.data[0];
            gelbooruEmbed
                .setAuthor("gelbooru", "https://pbs.twimg.com/profile_images/1118350008003301381/3gG6lQMl.png")
                .setURL(url)
                .setTitle(`**Gelbooru Image** ${discord.getEmoji("gabLewd")}`)
                .setDescription(`${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
                `${discord.getEmoji("star")}_Uploader:_ **${img.owner}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(img.created_at)}**\n` +
                `${discord.getEmoji("star")}_Tags:_ ${Functions_1.Functions.checkChar(img.tags, 1900, " ")}\n`)
                .setImage(`https://img2.gelbooru.com/samples/${img.directory}/sample_${img.hash}.jpg`);
            message.channel.send(gelbooruEmbed);
        });
    }
}
exports.default = Gelbooru;
//# sourceMappingURL=gelbooru.js.map