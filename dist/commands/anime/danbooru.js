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
const axios_1 = __importDefault(require("axios"));
const booru_1 = __importDefault(require("booru"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Danbooru extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const danbooru = booru_1.default("danbooru", process.env.DANBOORU_API_KEY);
            const danbooruEmbed = embeds.createEmbed();
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
                danbooruEmbed
                    .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
                    .setTitle(`**Danbooru Search** ${discord.getEmoji("gabLewd")}`)
                    .setDescription("No results were found. Underscores are not required, " +
                    "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                    "on the danbooru website.\n" + "[Danbooru Website](https://danbooru.donmai.us/)");
                message.channel.send(danbooruEmbed);
                return;
            }
            const tagArray = [];
            for (let i = 0; i < tags.length; i++) {
                tagArray.push(tags[i].trim().replace(/ /g, "_"));
            }
            let url;
            if (tags.join("").match(/\d\d+/g)) {
                url = `https://danbooru.donmai.us/posts/${tags.join("").match(/\d+/g)}`;
            }
            else {
                const image = yield danbooru.search(tagArray, { limit: 1, random: true });
                url = danbooru.postView(image[0].id);
            }
            const result = yield axios_1.default.get(`${url}.json`);
            const img = result.data;
            danbooruEmbed
                .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
                .setURL(url)
                .setTitle(`**Danbooru Image** ${discord.getEmoji("gabLewd")}`)
                .setDescription(`${discord.getEmoji("star")}_Character:_ **${img.tag_string_character ? Functions_1.Functions.toProperCase(img.tag_string_character.replace(/ /g, "\n").replace(/_/g, " ")) : "Original"}**\n` +
                `${discord.getEmoji("star")}_Artist:_ **${Functions_1.Functions.toProperCase(img.tag_string_artist.replace(/_/g, " "))}**\n` +
                `${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
                `${discord.getEmoji("star")}_Uploader:_ **${img.uploader_name}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(img.created_at)}**\n` +
                `${discord.getEmoji("star")}_Tags:_ ${Functions_1.Functions.checkChar(img.tag_string_general, 2048, " ")}\n`)
                .setImage(img.file_url);
            message.channel.send(danbooruEmbed);
        });
    }
}
exports.default = Danbooru;
//# sourceMappingURL=danbooru.js.map