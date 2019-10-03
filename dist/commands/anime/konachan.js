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
class Konachan extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const konachan = booru_1.default("konachan.com", process.env.KONACHAN_API_KEY);
            const konachanEmbed = embeds.createEmbed();
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
                konachanEmbed
                    .setAuthor("konachan", "https://lh3.googleusercontent.com/U_veaCEvWC-ebOBbwhUhTJtNdDKyAhKsJXmDFeZ2xV2jaoIPNbRhzK7nGlKpQtusbHE")
                    .setTitle(`**Konachan Search** ${discord.getEmoji("gabLewd")}`)
                    .setDescription("No results were found. Underscores are not required, " +
                    "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                    "on the konachan website.\n" + "[Konachan Website](https://konachan.com//)");
                message.channel.send(konachanEmbed);
                return;
            }
            const tagArray = [];
            for (const i in tags) {
                tagArray.push(tags[i].trim().replace(/ /g, "_"));
            }
            let url;
            if (tags.join("").match(/\d+/g)) {
                url = `https://konachan.net/post/show/${tags.join("").match(/\d+/g)}/`;
            }
            else {
                const image = yield konachan.search(tagArray, { limit: 1, random: true });
                url = konachan.postView(image[0].id);
            }
            const id = url.match(/\d\d+/g).join("");
            const result = yield axios_1.default.get(`https://konachan.com/post.json?tags=id:${id}`);
            const img = result.data[0];
            konachanEmbed
                .setAuthor("konachan", "https://lh3.googleusercontent.com/U_veaCEvWC-ebOBbwhUhTJtNdDKyAhKsJXmDFeZ2xV2jaoIPNbRhzK7nGlKpQtusbHE")
                .setURL(url)
                .setTitle(`**Konachan Image** ${discord.getEmoji("gabLewd")}`)
                .setDescription(`${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
                `${discord.getEmoji("star")}_Uploader:_ **${img.author}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(new Date(img.created_at * 1000))}**\n` +
                `${discord.getEmoji("star")}_Tags:_ ${Functions_1.Functions.checkChar(img.tags, 1900, " ")}\n`)
                .setImage(img.sample_url);
            message.channel.send(konachanEmbed);
        });
    }
}
exports.default = Konachan;
//# sourceMappingURL=konachan.js.map