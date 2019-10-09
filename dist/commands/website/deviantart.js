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
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
const deviantArt = require("deviantnode");
const deviantArray = [];
class DeviantArt extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.createDeviantEmbed = (discord, embeds, result) => {
            for (let i = 0; i < result.results.length; i++) {
                const deviation = result.results[i];
                if (!deviation.content)
                    return;
                const deviantEmbed = embeds.createEmbed();
                deviantEmbed
                    .setAuthor("deviantart", "https://www.shareicon.net/data/512x512/2016/11/22/855126_circle_512x512.png")
                    .setTitle(`**DeviantArt Search** ${discord.getEmoji("aquaUp")}`)
                    .setURL(deviation.url)
                    .setImage(deviation.content.src)
                    .setThumbnail(deviation.author.usericon)
                    .setDescription(`${discord.getEmoji("star")}_Title:_ **${deviation.title}**\n` +
                    `${discord.getEmoji("star")}_Author:_ **${deviation.author.username}**\n` +
                    `${discord.getEmoji("star")}_Category:_ **${deviation.category}**\n` +
                    `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(new Date((deviation.published_time) * 1000))}**\n` +
                    `${discord.getEmoji("star")}_Comments:_ **${deviation.stats.comments}**\n` +
                    `${discord.getEmoji("star")}_Favorites:_ **${deviation.stats.favorites ? deviation.stats.favorites : 0}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${deviation.excerpt ? Functions_1.Functions.checkChar(deviation.excerpt, 1900, ".") : "None"}\n`);
                deviantArray.push(deviantEmbed);
            }
        };
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const id = process.env.DEVIANTART_discord_ID;
            const secret = process.env.DEVIANTART_discord_SECRET;
            if (args[1] === "daily") {
                const result = (args[2]) ? yield deviantArt.getDailyDeviations(id, secret, { date: args[2] })
                    : yield deviantArt.getDailyDeviations(id, secret);
                this.createDeviantEmbed(discord, embeds, result);
                if (deviantArray.length === 1) {
                    message.channel.send(deviantArray[0]);
                }
                else {
                    embeds.createReactionEmbed(deviantArray);
                }
                return;
            }
            if (args[1] === "hot") {
                const result = (args[2]) ? yield deviantArt.getHotDeviations(id, secret, { category: args[2] })
                    : yield deviantArt.getHotDeviations(id, secret);
                this.createDeviantEmbed(discord, embeds, result);
                if (deviantArray.length === 1) {
                    message.channel.send(deviantArray[0]);
                }
                else {
                    embeds.createReactionEmbed(deviantArray);
                }
                return;
            }
            if (args[1] === "new") {
                const query = Functions_1.Functions.combineArgs(args, 2);
                const result = (query) ? yield deviantArt.getNewestDeviations(id, secret, { q: query })
                    : yield deviantArt.getNewestDeviations(id, secret);
                this.createDeviantEmbed(discord, embeds, result);
                if (deviantArray.length === 1) {
                    message.channel.send(deviantArray[0]);
                }
                else {
                    embeds.createReactionEmbed(deviantArray);
                }
                return;
            }
            if (args[1] === "popular") {
                const query = Functions_1.Functions.combineArgs(args, 2);
                const result = (query) ? yield deviantArt.getPopularDeviations(id, secret, { q: query })
                    : yield deviantArt.getPopularDeviations(id, secret);
                this.createDeviantEmbed(discord, embeds, result);
                if (deviantArray.length === 1) {
                    message.channel.send(deviantArray[0]);
                }
                else {
                    embeds.createReactionEmbed(deviantArray);
                }
                return;
            }
            if (args[1] === "user") {
                const result = yield deviantArt.getUserInfo(id, secret, { username: args[2] });
                const deviantEmbed = embeds.createEmbed();
                deviantEmbed
                    .setAuthor("deviantart", "https://www.shareicon.net/data/512x512/2016/11/22/855126_circle_512x512.png")
                    .setTitle(`**DeviantArt User** ${discord.getEmoji("aquaUp")}`)
                    .setURL(result.profile_url)
                    .setThumbnail(result.user.usericon)
                    .setImage(result.cover_photo ? result.cover_photo : result.user.usericon)
                    .setDescription(`${discord.getEmoji("star")}_User:_ **${result.user.username}**\n` +
                    `${discord.getEmoji("star")}_Specialty:_ **${result.artist_specialty}**\n` +
                    `${discord.getEmoji("star")}_Country:_ **${result.country}**\n` +
                    `${discord.getEmoji("star")}_Website:_ **${result.website ? result.website : "None"}**\n` +
                    `${discord.getEmoji("star")}_Deviations:_ **${result.stats.user_deviations}**\n` +
                    `${discord.getEmoji("star")}_User Favorites:_ **${result.stats.user_favourites}**\n` +
                    `${discord.getEmoji("star")}_User Comments:_ **${result.stats.user_comments}**\n` +
                    `${discord.getEmoji("star")}_Page Views:_ **${result.stats.profile_pageviews}**\n` +
                    `${discord.getEmoji("star")}_Profile Comments:_ **${result.stats.profile_comments}**\n` +
                    `${discord.getEmoji("star")}_Tag Line:_ ${result.tagline ? result.tagline : "None"}\n` +
                    `${discord.getEmoji("star")}_Description:_ ${Functions_1.Functions.checkChar(result.bio, 1800, ".")}\n`);
                message.channel.send(deviantEmbed);
                return;
            }
            if (args[1] === "gallery") {
                const result = yield deviantArt.getGalleryAllDeviations(id, secret, { username: args[2] });
                this.createDeviantEmbed(discord, embeds, result);
                if (deviantArray.length === 1) {
                    message.channel.send(deviantArray[0]);
                }
                else {
                    embeds.createReactionEmbed(deviantArray);
                }
                return;
            }
            const query = Functions_1.Functions.combineArgs(args, 1);
            const result = yield deviantArt.getTagDeviations(id, secret, { tag: query });
            this.createDeviantEmbed(discord, embeds, result);
            if (deviantArray.length === 1) {
                message.channel.send(deviantArray[0]);
            }
            else {
                embeds.createReactionEmbed(deviantArray);
            }
            return;
        });
    }
}
exports.default = DeviantArt;
//# sourceMappingURL=deviantart.js.map