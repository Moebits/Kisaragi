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
const better_youtube_api_1 = require("better-youtube-api");
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
let ytEmbeds = [];
class Youtube extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.ytChannelEmbed = (discord, embeds, youtube, channelLink) => __awaiter(this, void 0, void 0, function* () {
            const channel = yield youtube.getChannelByUrl(channelLink);
            const channelBanner = yield axios_1.default.get(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channel.id}&key=${process.env.GOOGLE_API_KEY}`);
            const keywords = channelBanner.data.items[0].brandingSettings.channel.keywords;
            const channelBannerUrl = channelBanner.data.items[0].brandingSettings.image.bannerImageUrl;
            const youtubeEmbed = embeds.createEmbed();
            youtubeEmbed
                .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
                .setTitle(`**${channel.name}** ${discord.getEmoji("kannaWave")}`)
                .setURL(channel.url)
                .setDescription(`${discord.getEmoji("star")}_Custom URL:_ **${channel.data.snippet.customUrl ? `https://youtube.com/c/${channel.data.snippet.customUrl}` : "None"}**\n` +
                `${discord.getEmoji("star")}_Keywords:_ ${keywords ? keywords : "None"}\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(channel.dateCreated)}**\n` +
                `${discord.getEmoji("star")}_Country:_ ${channel.country}\n` +
                `${discord.getEmoji("star")}_Subscribers:_ **${channel.subCount}** _Views:_ **${channel.views}**\n` +
                `${discord.getEmoji("star")}_Videos:_ **${channel.data.statistics.videoCount}**\n` +
                `${discord.getEmoji("star")}_About:_ ${Functions_1.Functions.checkChar(channel.about, 1800, ".")}\n`)
                .setThumbnail(channel.profilePictures.high.url)
                .setImage(channelBannerUrl);
            ytEmbeds.push(youtubeEmbed);
        });
        this.ytPlaylistEmbed = (discord, embeds, youtube, playLink) => __awaiter(this, void 0, void 0, function* () {
            const playlist = yield youtube.getPlaylistByUrl(playLink);
            const ytChannel = yield youtube.getChannel(playlist.creatorId);
            const videos = yield playlist.fetchVideos(5);
            const videoArray = [];
            for (let i = 0; i <= 5; i++) {
                if (!videos[i])
                    break;
                videoArray.push(`**${videos[i].title}**\n`);
            }
            const youtubeEmbed = embeds.createEmbed();
            youtubeEmbed
                .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
                .setTitle(`**${playlist.title}** ${discord.getEmoji("kannaWave")}`)
                .setURL(`https://www.youtube.com/playlist?list=${playlist.id}`)
                .setDescription(`${discord.getEmoji("star")}_Channel:_ **${ytChannel.name}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(playlist.dateCreated)}**\n` +
                `${discord.getEmoji("star")}_Tags:_ ${playlist.tags ? playlist.tags : "None"}\n` +
                `${discord.getEmoji("star")}_Video Count:_ **${playlist.length}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${playlist.data.snippet.description ? playlist.data.snippet.description : "None"}\n` +
                `${discord.getEmoji("star")}_Videos:_ ${videoArray.join(" ") ? videoArray.join(" ") : "None"}\n`)
                .setThumbnail(ytChannel.profilePictures.high ? ytChannel.profilePictures.high.url : ytChannel.profilePictures.medium.url)
                .setImage(playlist.thumbnails.maxres ? playlist.thumbnails.maxres.url : playlist.thumbnails.high.url);
            ytEmbeds.push(youtubeEmbed);
        });
        this.ytVideoEmbed = (discord, embeds, youtube, videoLink) => __awaiter(this, void 0, void 0, function* () {
            const video = yield youtube.getVideoByUrl(videoLink);
            const comments = yield video.fetchComments(5);
            const commentArray = [];
            for (let i = 0; i <= 5; i++) {
                if (!comments[i])
                    break;
                commentArray.push(`**${comments[i].author.username}:** ${comments[i].text.displayed}\n`);
            }
            const ytChannel = yield youtube.getChannel(video.channelId);
            const youtubeEmbed = embeds.createEmbed();
            youtubeEmbed
                .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
                .setTitle(`**${video.title}** ${discord.getEmoji("kannaWave")}`)
                .setURL(video.shortUrl)
                .setDescription(`${discord.getEmoji("star")}_Channel:_ **${ytChannel.name}**\n` +
                `${discord.getEmoji("star")}_Views:_ **${video.views}**\n` +
                `${discord.getEmoji("star")} ${discord.getEmoji("up")} **${video.likes}** ${discord.getEmoji("down")} **${video.dislikes}**\n` +
                `${discord.getEmoji("star")}_Date Published:_ **${Functions_1.Functions.formatDate(video.datePublished)}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${video.description ? Functions_1.Functions.checkChar(video.description, 1500, ".") : "None"}\n` +
                `${discord.getEmoji("star")}_Comments:_ ${commentArray.join(" ") ? Functions_1.Functions.checkChar(commentArray.join(" "), 200, " ") : "None"}\n`)
                .setThumbnail(ytChannel.profilePictures.high.url)
                .setImage(video.thumbnails.maxres ? video.thumbnails.maxres.url : video.thumbnails.high.url);
            ytEmbeds.push(youtubeEmbed);
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const youtube = new better_youtube_api_1.YouTube(process.env.GOOGLE_API_KEY);
            const msg = yield message.channel.send(`**Searching youtube** ${discord.getEmoji("gabCircle")}`);
            if (args[1].toLowerCase() === "channel") {
                ytEmbeds = [];
                let channelLink = Functions_1.Functions.combineArgs(args, 2);
                if (!channelLink.startsWith("https")) {
                    const channelResult = yield youtube.searchChannels(channelLink);
                    const length = channelResult.length < 10 ? channelResult.length : 10;
                    for (let i = 0; i < length; i++) {
                        if (!channelResult[i])
                            break;
                        channelLink = channelResult[i].url;
                        yield this.ytChannelEmbed(discord, embeds, youtube, channelLink);
                    }
                    embeds.createReactionEmbed(ytEmbeds);
                    msg.delete({ timeout: 1000 });
                    return;
                }
                yield this.ytChannelEmbed(discord, embeds, youtube, channelLink);
                message.channel.send(ytEmbeds[0]);
                msg.delete({ timeout: 1000 });
                return;
            }
            if (args[1].toLowerCase() === "playlist") {
                ytEmbeds = [];
                let playLink = Functions_1.Functions.combineArgs(args, 2);
                if (!playLink.startsWith("https")) {
                    const playlistResult = yield youtube.searchPlaylists(playLink);
                    const length = playlistResult.length < 10 ? playlistResult.length : 10;
                    for (let i = 0; i < length; i++) {
                        if (!playlistResult[i])
                            break;
                        playLink = `https://www.youtube.com/playlist?list=${playlistResult[i].id}`;
                        yield this.ytPlaylistEmbed(discord, embeds, youtube, playLink);
                    }
                    embeds.createReactionEmbed(ytEmbeds);
                    msg.delete({ timeout: 1000 });
                    return;
                }
                yield this.ytPlaylistEmbed(discord, embeds, youtube, playLink);
                message.channel.send(ytEmbeds[0]);
                msg.delete({ timeout: 1000 });
                return;
            }
            if (args[1].toLowerCase() === "video") {
                ytEmbeds = [];
                let videoLink = Functions_1.Functions.combineArgs(args, 2);
                if (!videoLink.startsWith("https")) {
                    const videoResult = yield youtube.searchVideos(videoLink);
                    for (let i = 0; i < videoResult.length; i++) {
                        if (!videoResult[i])
                            break;
                        videoLink = videoResult[i].url;
                        yield this.ytVideoEmbed(discord, embeds, youtube, videoLink);
                    }
                    embeds.createReactionEmbed(ytEmbeds);
                    msg.delete({ timeout: 1000 });
                    return;
                }
                yield this.ytVideoEmbed(discord, embeds, youtube, videoLink);
                message.channel.send(ytEmbeds[0]);
                msg.delete({ timeout: 1000 });
                return;
            }
        });
    }
}
exports.default = Youtube;
//# sourceMappingURL=youtube.js.map