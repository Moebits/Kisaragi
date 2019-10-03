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
Object.defineProperty(exports, "__esModule", { value: true });
const translate = __importStar(require("@vitalets/google-translate-api"));
const discord_js_1 = require("discord.js");
const pixivApi = __importStar(require("pixiv-api-client"));
const pixivImg = __importStar(require("pixiv-img"));
const Embeds_1 = require("./Embeds");
const Functions_1 = require("./Functions");
const Link_1 = require("./Link");
const pixiv = new pixivApi();
class PixivApi {
    constructor(discord, message) {
        this.discord = discord;
        this.message = message;
        this.embeds = new Embeds_1.Embeds(this.discord, this.message);
        this.links = new Link_1.Link(this.discord);
        // Pixiv Login
        this.pixivLogin = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield pixiv.refreshAccessToken(process.env.PIXIV_REFRESH_TOKEN);
            }
            catch (err) {
                yield pixiv.login(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD, true);
                const refresh = yield pixiv.refreshAccessToken();
                console.log("Refresh token expired. New one:");
                console.log(refresh.refresh_token);
            }
            const token = yield pixiv.refreshAccessToken();
            return token.refresh_token;
        });
        // Create Pixiv Embed
        this.createPixivEmbed = (refreshToken, image) => __awaiter(this, void 0, void 0, function* () {
            yield pixiv.refreshAccessToken(refreshToken);
            const pixivEmbed = this.embeds.createEmbed();
            if (!image)
                this.pixivErrorEmbed;
            const comments = yield pixiv.illustComments(image.id);
            const commentArray = [];
            for (let i = 0; i <= 5; i++) {
                if (!comments.comments[i])
                    break;
                commentArray.push(comments.comments[i].comment);
            }
            const url = yield pixivImg(image.image_urls.medium);
            const authorUrl = yield pixivImg(image.user.profile_image_urls.medium);
            const imageAttachment = new discord_js_1.MessageAttachment(url);
            const authorAttachment = new discord_js_1.MessageAttachment(authorUrl);
            const cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "");
            pixivEmbed
                .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
                .setTitle(`**Pixiv Image** ${this.discord.getEmoji("chinoSmug")}`)
                .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
                .setDescription(`${this.discord.getEmoji("star")}_Title:_ **${image.title}**\n` +
                `${this.discord.getEmoji("star")}_Artist:_ **${image.user.name}**\n` +
                `${this.discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(image.create_date)}**\n` +
                `${this.discord.getEmoji("star")}_Views:_ **${image.total_view}**\n` +
                `${this.discord.getEmoji("star")}_Bookmarks:_ **${image.total_bookmarks}**\n` +
                `${this.discord.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` +
                `${this.discord.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n`)
                .attachFiles([authorAttachment, imageAttachment])
                .setThumbnail(`attachment://${authorAttachment.name}`)
                .setImage(`attachment://${imageAttachment.name}`);
            return pixivEmbed;
        });
        // Pixiv Error Embed
        this.pixivErrorEmbed = () => {
            const pixivEmbed = this.embeds.createEmbed();
            pixivEmbed
                .setTitle(`**Pixiv Image** ${this.discord.getEmoji("chinoSmug")}`)
                .setDescription("No results were found. Try searching for the japanese tag on the Pixiv website, " +
                "as some tags can't be translated to english!" + "\n[Pixiv Website](https://www.pixiv.net/)");
            return this.message.channel.send(pixivEmbed);
        };
        // Process Pixiv Tag
        this.pixivTag = (tag) => __awaiter(this, void 0, void 0, function* () {
            const newTag = yield translate(tag, { to: "ja" });
            return newTag.text;
        });
        // Pixiv Image
        this.getPixivImage = (refresh, tag, r18, en, ugoira, noEmbed) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = refresh;
            yield pixiv.refreshAccessToken(refreshToken);
            let newTag = en ? tag : yield this.pixivTag(tag);
            newTag = newTag.trim();
            yield pixiv.login(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD);
            const json = r18 ? (ugoira ? yield pixiv.searchIllust(`うごイラ R-18 ${newTag}`) : yield pixiv.searchIllust(`R-18 ${newTag}`)) :
                (ugoira ? yield pixiv.searchIllust(`うごイラ ${newTag} -R-18`) : yield pixiv.searchIllust(`${newTag} -R-18`));
            [].sort.call(json.illusts, ((a, b) => (a.total_bookmarks - b.total_bookmarks) * -1));
            const index = Math.floor(Math.random() * (10));
            const image = json.illusts[index];
            if (noEmbed)
                return image;
            const pixivEmbed = yield this.createPixivEmbed(refreshToken, image);
            return this.message.channel.send(pixivEmbed);
        });
        // Pixiv Image ID
        this.getPixivImageID = (refresh, tags) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = refresh;
            yield pixiv.refreshAccessToken(refreshToken);
            const image = yield pixiv.illustDetail(tags.toString());
            for (const i in image.illust.tags) {
                if (image.illust.tags[i].name === "うごイラ") {
                    const path = require("../commands/anime/ugoira.js");
                    yield this.links.linkRun(path, this.message, ["ugoira", tags.toString()]);
                    return;
                }
            }
            if (!image)
                this.pixivErrorEmbed;
            const pixivEmbed = yield this.createPixivEmbed(refreshToken, image.illust);
            return this.message.channel.send(pixivEmbed);
        });
        // Pixiv Random Image
        this.getRandomPixivImage = (refresh) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = refresh;
            yield pixiv.refreshAccessToken(refreshToken);
            let image;
            let random = 0;
            while (!image) {
                random = Math.floor(Math.random() * 100000000);
                image = yield pixiv.illustDetail(random.toString());
            }
            const pixivEmbed = yield this.createPixivEmbed(refreshToken, image.illust);
            return this.message.channel.send(pixivEmbed);
        });
        // Pixiv Popular Image
        this.getPopularPixivImage = (refresh) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = refresh;
            yield pixiv.refreshAccessToken(refreshToken);
            const json = yield pixiv.illustRanking();
            [].sort.call(json.illusts, ((a, b) => (a.total_bookmarks - b.total_bookmarks) * -1));
            const index = Math.floor(Math.random() * (10));
            const image = json.illusts[index];
            const pixivEmbed = yield this.createPixivEmbed(refreshToken, image);
            return this.message.channel.send(pixivEmbed);
        });
        // Pixiv Popular R18 Image
        this.getPopularPixivR18Image = (refresh) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = refresh;
            yield pixiv.refreshAccessToken(refreshToken);
            const json = yield pixiv.illustRanking({ mode: "day_male_r18" });
            [].sort.call(json.illusts, ((a, b) => (a.total_bookmarks - b.total_bookmarks) * -1));
            const index = Math.floor(Math.random() * (10));
            const image = json.illusts[index];
            const pixivEmbed = yield this.createPixivEmbed(refreshToken, image);
            return this.message.channel.send(pixivEmbed);
        });
    }
}
exports.PixivApi = PixivApi;
//# sourceMappingURL=PixivApi.js.map