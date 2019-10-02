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
const twitter_1 = __importDefault(require("twitter"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class TwitterCommand extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const twitter = new twitter_1.default({
                consumer_key: process.env.TWITTER_API_KEY,
                consumer_secret: process.env.TWITTER_API_SECRET,
                access_token_key: process.env.TWITTER_ACCESS_TOKEN,
                access_token_secret: process.env.TWITTER_ACCESS_SECRET
            });
            if (args[1] === "user") {
                const name = Functions_1.Functions.combineArgs(args, 2);
                const users = yield twitter.get("users/lookup", { screen_name: name });
                const user = users[0];
                const twitterEmbed = embeds.createEmbed();
                twitterEmbed
                    .setAuthor("twitter", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53e.png")
                    .setTitle(`**${user.name}** ${discord.getEmoji("aquaUp")}`)
                    .setURL(`https://twitter.com/${user.screen_name}`)
                    .setDescription(`${discord.getEmoji("star")}_Username:_ **${user.screen_name}**\n` +
                    `${discord.getEmoji("star")}_Tweets:_ **${user.statuses_count}**\n` +
                    `${discord.getEmoji("star")}_Followers:_ **${user.followers_count}**\n` +
                    `${discord.getEmoji("star")}_Following:_ **${user.friends_count}**\n` +
                    `${discord.getEmoji("star")}_Favorites:_ **${user.favourites_count}**\n` +
                    `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(user.created_at)}**\n` +
                    `${discord.getEmoji("star")}_Location:_ ${user.location ? user.location : "None"}\n` +
                    `${discord.getEmoji("star")}_Description:_ ${user.description ? user.description : "None"}\n` +
                    `${discord.getEmoji("star")}_Last Tweet:_ ${user.status.text}\n`)
                    .setThumbnail(user.profile_image_url)
                    .setImage(user.profile_banner_url);
                message.channel.send(twitterEmbed);
                return;
            }
            const query = Functions_1.Functions.combineArgs(args, 1);
            const tweets = yield twitter.get("search/tweets", { q: query });
            const twitterArray = [];
            for (const i in tweets.statuses) {
                const twitterEmbed = embeds.createEmbed();
                twitterEmbed
                    .setAuthor("twitter", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53e.png")
                    .setTitle(`**Twitter Search** ${discord.getEmoji("aquaUp")}`)
                    .setURL(`https://twitter.com/${tweets.statuses[i].user.screen_name}/status/${tweets.statuses[i].id_str}`)
                    .setDescription(`${discord.getEmoji("star")}_Author:_ **${tweets.statuses[i].user.screen_name}**\n` +
                    `${discord.getEmoji("star")}_Location:_ ${tweets.statuses[i].user.location ? tweets.statuses[i].user.location : "None"}\n` +
                    `${discord.getEmoji("star")}_Description:_ ${tweets.statuses[i].user.description ? tweets.statuses[i].user.description : "None"}\n` +
                    `${discord.getEmoji("star")}_Favorites:_ **${tweets.statuses[i].favorite_count}**\n` +
                    `${discord.getEmoji("star")}_Retweets:_ **${tweets.statuses[i].retweet_count}**\n` +
                    `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(tweets.statuses[i].created_at)}**\n` +
                    `${discord.getEmoji("star")}_Language:_ **${tweets.statuses[i].lang}**\n` +
                    `${discord.getEmoji("star")}_Tweet:_ ${tweets.statuses[i].text}\n`)
                    .setThumbnail(tweets.statuses[i].user.profile_image_url_https)
                    .setImage(tweets.statuses[i].entities.media ? tweets.statuses[i].entities.media[0].media_url : tweets.statuses[i].user.profile_banner_url);
                twitterArray.push(twitterEmbed);
            }
            embeds.createReactionEmbed(twitterArray);
        });
    }
}
exports.default = TwitterCommand;
//# sourceMappingURL=twitter.js.map