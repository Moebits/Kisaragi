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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chan = __importStar(require("4chanapi.js"));
const axios_1 = __importDefault(require("axios"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class $4chan extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.chanError = (discord, message, embeds) => {
            const chanEmbed = embeds.createEmbed();
            chanEmbed
                .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
                .setTitle(`**4chan Search** ${discord.getEmoji("vigneDead")}`)
                .setDescription("No results were found. Try searching for a different tag.");
            message.channel.send(chanEmbed);
        };
        this.formatComment = (comment, post) => {
            const clean1 = comment.replace(/&#039;/g, "'").replace(/<br>/g, "\n");
            const clean2 = clean1.replace(/(?<=<a).*?(?=<\/a>)/g, `[>>${post.slice(-9)}](${post})`);
            const clean3 = clean2.replace(/<a/g, "").replace(/<\/a>/g, "");
            const clean4 = clean3.replace(/<s>/g, "||").replace(/<\/s>/g, "||");
            const clean5 = clean4.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
            const clean6 = clean5.replace(/<span class="quote">/g, "").replace(/<\/span>/g, "\n");
            const clean7 = Functions_1.Functions.checkChar(clean6, 1800, ".");
            return clean7;
        };
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            if (args[1] === "images") {
                const board = args[2];
                const query = Functions_1.Functions.combineArgs(args, 3);
                const threads = yield chan.threadsWithTopics(board, query.split(","));
                const random = Math.floor(Math.random() * threads.length);
                if (!threads[random]) {
                    this.chanError(discord, message, embeds);
                    return;
                }
                const results = yield chan.threadMediaLinks(threads[random].url);
                const rawUrl = `https://boards.4channel.org/${board}/thread/${threads[random].url.match(/\d+/g)}`;
                const url = rawUrl.replace(/4,/g, "");
                const imageArray = [];
                for (const i in results) {
                    const chanEmbed = embeds.createEmbed();
                    chanEmbed
                        .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
                        .setTitle(`**4chan Search** ${discord.getEmoji("vigneDead")}`)
                        .setURL(url)
                        .setImage(results[i]);
                    imageArray.push(chanEmbed);
                }
                if (imageArray.length === 1) {
                    message.channel.send(imageArray[0]);
                }
                else {
                    embeds.createReactionEmbed(imageArray);
                }
                return;
            }
            const board = args[1];
            const query = Functions_1.Functions.combineArgs(args, 2);
            const threads = yield chan.threadsWithTopics(board, query.split(","));
            const random = Math.floor(Math.random() * threads.length);
            if (!threads[random]) {
                this.chanError(discord, message, embeds);
                return;
            }
            const json = yield axios_1.default.get(threads[random].url);
            const posts = json.data.posts;
            const rawUrl = `https://boards.4channel.org/${board}/thread/${threads[random].url.match(/\d+/g)}`;
            const url = rawUrl.replace(/4,/g, "");
            const chanArray = [];
            for (const i in posts) {
                const chanEmbed = embeds.createEmbed();
                chanEmbed
                    .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
                    .setTitle(`${posts[0].sub ? posts[0].sub : threads[random].semantic_url} ${discord.getEmoji("vigneDead")}`)
                    .setURL(url)
                    .setImage(posts[i].tim ? `https://i.4cdn.org/${board}/${posts[i].tim}${posts[i].ext}` : url)
                    .setDescription(`${discord.getEmoji("star")}_Post:_ **${url}#p${posts[i].no}**\n` +
                    `${discord.getEmoji("star")}_Unique IPs:_ **${posts[0].unique_ips}**\n` +
                    `${discord.getEmoji("star")}_Author:_ **${posts[i].name} ${posts[i].now} No. ${posts[i].no}**\n` +
                    `${discord.getEmoji("star")}_Image Info:_ ${posts[i].tim ? `File: ${posts[i].filename}${posts[i].ext} (${Math.floor(posts[i].fsize / 1024)} KB, ${posts[i].w}x${posts[i].h})` : "None"}\n` +
                    `${discord.getEmoji("star")}_Comment:_ ${posts[i].com ? this.formatComment(posts[i].com, `${url}#p${posts[i].no}`) : "None"}\n`);
                chanArray.push(chanEmbed);
            }
            if (chanArray.length === 1) {
                message.channel.send(chanArray[0]);
            }
            else {
                embeds.createReactionEmbed(chanArray);
            }
        });
    }
}
exports.default = $4chan;
//# sourceMappingURL=4chan.js.map