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
Object.defineProperty(exports, "__esModule", { value: true });
const linkCool = new Set();
class Link {
    constructor(discord) {
        this.discord = discord;
        this.linkRun = (path, msg, args) => __awaiter(this, void 0, void 0, function* () {
            if (linkCool.has(msg.guild.id)) {
                const reply = yield msg.reply("This command is under a 30 second cooldown!");
                reply.delete({ timeout: 3000 });
                return;
            }
            linkCool.add(msg.guild.id);
            setTimeout(() => linkCool.delete(msg.guild.id), 30000);
            const loading = yield msg.channel.send(`**Loading** ${this.discord.getEmoji("gabCircle")}`);
            const cmd = new (require(path).default)();
            yield cmd.run(this.discord, msg, args).catch((err) => msg.channel.send(this.discord.cmdError(msg, err)));
            loading.delete({ timeout: 1000 });
        });
        this.postLink = (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg.content.startsWith("https://www.youtube.com/channel/") || msg.content.startsWith("https://www.youtube.com/c/")) {
                const path = require("../commands/website/youtube.js");
                yield this.linkRun(path, msg, ["youtube", "channel", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://www.youtube.com/watch") || msg.content.startsWith("https://youtu.be/")) {
                const path = require("../commands/website/youtube.js");
                yield this.linkRun(path, msg, ["youtube", "video", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://www.youtube.com/playlist")) {
                const path = require("../commands/website/youtube.js");
                yield this.linkRun(path, msg, ["youtube", "playlist", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=")) {
                const path = require("../commands/anime/pixiv.js");
                yield this.linkRun(path, msg, ["pixiv", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://danbooru.donmai.us/posts/")) {
                const path = require("../commands/anime/danbooru.js");
                yield this.linkRun(path, msg, ["danbooru", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://gelbooru.com/index.php?page=post&s=view&id=")) {
                const path = require("../commands/anime/gelbooru.js");
                yield this.linkRun(path, msg, ["gelbooru", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://konachan.net/post/show/")) {
                const path = require("../commands/anime/konachan.js");
                yield this.linkRun(path, msg, ["konachan", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://lolibooru.moe/post/show/")) {
                const path = require("../commands/anime/lolibooru.js");
                yield this.linkRun(path, msg, ["lolibooru", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://yande.re/post/show/")) {
                const path = require("../commands/anime/yandere.js");
                yield this.linkRun(path, msg, ["yandere", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://rule34.xxx/index.php?page=post&s=view&id=")) {
                const path = require("../commands/hentai/rule34.js");
                yield this.linkRun(path, msg, ["rule34", msg.content]);
                return;
            }
            if (msg.content.startsWith("https://nhentai.net/g/")) {
                const path = require("../commands/hentai/nhentai.js");
                yield this.linkRun(path, msg, ["nhentai", msg.content]);
                return;
            }
        });
    }
}
exports.Link = Link;
//# sourceMappingURL=Link.js.map