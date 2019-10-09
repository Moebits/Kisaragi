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
const snoowrap_1 = __importDefault(require("snoowrap"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
const redditArray = [];
class Reddit extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.getSubmissions = (discord, reddit, embeds, postIDS) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < 10; i++) {
                if (!postIDS[i])
                    break;
                // @ts-ignore
                const post = yield reddit.getSubmission(postIDS[i]).fetch();
                const commentArray = [];
                for (let j = 0; j < 3; j++) {
                    if (!post.comments[j])
                        break;
                    commentArray.push(`**${post.comments[j].author ? post.comments[j].author.name : "Deleted"}**: ${Functions_1.Functions.checkChar(post.comments[j].body, 150, " ").replace(/(\r\n|\n|\r)/gm, " ")}`);
                }
                const redditEmbed = embeds.createEmbed();
                redditEmbed
                    .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
                    .setTitle(`**${post.title}** ${discord.getEmoji("aquaUp")}`)
                    .setURL(`https://www.reddit.com/${post.permalink}`)
                    .setDescription(`${discord.getEmoji("star")}_Subreddit:_ **${post.subreddit.display_name}**\n` +
                    `${discord.getEmoji("star")}_Subscribers:_ **${post.subreddit_subscribers}**\n` +
                    `${discord.getEmoji("star")}_Author:_ **${post.author ? post.author.name : "Deleted"}**\n` +
                    `${discord.getEmoji("star")}${discord.getEmoji("up")} **${Math.ceil(post.ups / post.upvote_ratio)}** ${discord.getEmoji("down")} **${Math.ceil(post.ups / post.upvote_ratio) - post.ups}**\n` +
                    `${discord.getEmoji("star")}_Selftext:_ ${post.selftext ? Functions_1.Functions.checkChar(post.selftext, 800, ".").replace(/(\r\n|\n|\r)/gm, " ") : "None"}\n` +
                    `${discord.getEmoji("star")}_Comments:_ ${commentArray.join("") ? commentArray.join("\n") : "None"}\n`)
                    .setImage(post.url)
                    .setThumbnail(post.thumbnail.startsWith("https") ? post.thumbnail : post.url);
                redditArray.push(redditEmbed);
            }
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const reddit = new snoowrap_1.default({
                userAgent: "kisaragi bot v1.0 by /u/tenpimusic",
                clientId: process.env.REDDIT_APP_ID,
                clientSecret: process.env.REDDIT_APP_SECRET,
                username: process.env.REDDIT_USERNAME,
                password: process.env.REDDIT_PASSWORD
            });
            if (args[1] === "user") {
                const query = Functions_1.Functions.combineArgs(args, 2);
                // @ts-ignore
                const user = yield reddit.getUser(query.trim()).fetch();
                const redditEmbed = embeds.createEmbed();
                redditEmbed
                    .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
                    .setTitle(`**${user.name}** ${discord.getEmoji("aquaUp")}`)
                    .setURL(`https://www.reddit.com${user.subreddit.display_name.url}`)
                    .setImage(user.subreddit.display_name.banner_img)
                    .setThumbnail(user.subreddit.display_name.icon_img)
                    .setDescription(`${discord.getEmoji("star")}_Link Karma:_ **${user.link_karma}**\n` +
                    `${discord.getEmoji("star")}_Comment Karma:_ **${user.comment_karma}**\n` +
                    `${discord.getEmoji("star")}_Friends:_ **${user.num_friends}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${user.subreddit.display_name.public_description}\n`);
                message.channel.send(redditEmbed);
                return;
            }
            let posts = {};
            let subreddit = "";
            if (!args[1]) {
                // @ts-ignore
                posts = [yield reddit.getRandomSubmission()];
            }
            else {
                subreddit = args[1];
            }
            if (subreddit) {
                if (args[2]) {
                    const query = Functions_1.Functions.combineArgs(args, 2);
                    if (args[2].toLowerCase() === "hot") {
                        posts = yield reddit.getSubreddit(subreddit).getHot();
                    }
                    else if (args[2].toLowerCase() === "new") {
                        posts = yield reddit.getSubreddit(subreddit).getNew();
                    }
                    else if (args[2].toLowerCase() === "top") {
                        posts = yield reddit.getSubreddit(subreddit).getTop({ time: "all" });
                    }
                    else if (args[2].toLowerCase() === "rising") {
                        posts = yield reddit.getSubreddit(subreddit).getRising();
                    }
                    else if (args[2].toLowerCase() === "controversial") {
                        posts = yield reddit.getSubreddit(subreddit).getControversial();
                    }
                    else {
                        posts = yield reddit.getSubreddit(subreddit).search({ query, time: "all", sort: "relevance" });
                    }
                }
                else {
                    // @ts-ignore
                    posts = yield reddit.getSubreddit(subreddit).getRandomSubmission();
                }
            }
            const postIDS = [];
            for (let i = 0; i < posts.length; i++) {
                if (posts[i]) {
                    postIDS.push(posts[i].id);
                }
            }
            if (!postIDS.join("")) {
                const redditEmbed = embeds.createEmbed();
                redditEmbed
                    .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
                    .setTitle(`**Reddit Search** ${discord.getEmoji("aquaUp")}`)
                    .setDescription("No results were found. Try searching on the reddit website: " +
                    "[Reddit Website](https://www.reddit.com)");
                message.channel.send(redditEmbed);
                return;
            }
            yield this.getSubmissions(discord, reddit, embeds, postIDS);
            if (redditArray.length === 1) {
                message.channel.send(redditArray[0]);
            }
            else {
                embeds.createReactionEmbed(redditArray);
            }
        });
    }
}
exports.default = Reddit;
//# sourceMappingURL=reddit.js.map