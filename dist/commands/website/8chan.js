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
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class $8chan extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.cleanComment = (comment) => {
            const clean1 = comment.replace(/<\/?[^>]+(>|$)/g, "");
            const clean2 = clean1.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
            return clean2;
        };
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const board = args[1];
            const result = yield axios_1.default.get(`https://8ch.net/${board}/0.json`);
            const random = Math.floor(Math.random() * result.data.threads.length);
            const thread = result.data.threads[random];
            const chanArray = [];
            for (const i in thread.posts) {
                const chanEmbed = embeds.createEmbed();
                const url = `https://8ch.net/${board}/res/${thread.posts[0].no}.html`;
                const image = thread.posts[i].filename ? `https://media.8ch.net/file_store/${thread.posts[i].tim}${thread.posts[i].ext}` : "https://8ch.net/index.html";
                const imageInfo = thread.posts[i].filename ? `File: ${thread.posts[i].filename}${thread.posts[i].ext} (${Math.floor(thread.posts[i].fsize / 1024)} KB, ${thread.posts[i].w}x${thread.posts[i].h})` : "None";
                chanEmbed
                    .setAuthor("8chan", "https://pbs.twimg.com/profile_images/899238730128539648/J6g3Ws7o_400x400.jpg")
                    .setTitle(`**${thread.posts[0].sub}** ${discord.getEmoji("raphi")}`)
                    .setURL(url)
                    .setImage(image)
                    .setDescription(`${discord.getEmoji("star")}_Post:_ ${url}#${thread.posts[i].no}\n` +
                    `${discord.getEmoji("star")}_Author:_ ${thread.posts[i].name} No. ${thread.posts[i].no}\n` +
                    `${discord.getEmoji("star")}_Image Info:_ ${imageInfo}\n` +
                    `${discord.getEmoji("star")}_Comment:_ ${this.cleanComment(thread.posts[i].com)}\n`);
                chanArray.push(chanEmbed);
            }
            embeds.createReactionEmbed(chanArray);
        });
    }
}
exports.default = $8chan;
//# sourceMappingURL=8chan.js.map