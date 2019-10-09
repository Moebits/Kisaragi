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
const weeb = require("node-weeb");
class Anime extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const query = Functions_1.Functions.combineArgs(args, 1);
            const animeEmbed = embeds.createEmbed();
            if (!query) {
                animeEmbed
                    .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
                    .setTitle(`**Anime** ${discord.getEmoji("gabYes")}`)
                    .setDescription("You must provide an anime to search!");
                message.channel.send(animeEmbed);
                return;
            }
            const result = yield weeb.anime(query);
            const data = JSON.parse(result).data[0];
            animeEmbed
                .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
                .setURL(`https://kitsu.io/anime/${data.attributes.slug}`)
                .setTitle(`${data.attributes.titles.en} ${discord.getEmoji("gabYes")}`)
                .setDescription(`${discord.getEmoji("star")}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
                `${discord.getEmoji("star")}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
                `${discord.getEmoji("star")}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
                `${discord.getEmoji("star")}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
                `${discord.getEmoji("star")}_Episodes:_ **${data.attributes.episodeCount ? data.attributes.episodeCount : "Still Airing"}** _Length:_ **${data.attributes.totalLength}m (${data.attributes.episodeLength}m each)**\n` +
                `${discord.getEmoji("star")}_User Count:_ **${data.attributes.userCount}**\n` +
                `${discord.getEmoji("star")}_Aired:_ **${Functions_1.Functions.formatDate(data.attributes.startDate)} to ${Functions_1.Functions.formatDate(data.attributes.endDate)}**\n` +
                `${discord.getEmoji("star")}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
                `${discord.getEmoji("star")}_Synopsis:_ ${Functions_1.Functions.checkChar(data.attributes.synopsis, 2000, ".")}\n`)
                .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
                .setThumbnail(data.attributes.posterImage.original);
            message.channel.send(animeEmbed);
        });
    }
}
exports.default = Anime;
//# sourceMappingURL=anime.js.map