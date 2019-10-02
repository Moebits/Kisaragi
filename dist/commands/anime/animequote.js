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
const animeQuotes = __importStar(require("animequotes"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class AnimeQuote extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const animeQuoteEmbed = embeds.createEmbed();
            if (!args[1]) {
                const quote = animeQuotes.randomQuote();
                animeQuoteEmbed
                    .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
                    .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)
                    .setDescription(`${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
                    `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
                    `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`);
                message.channel.send(animeQuoteEmbed);
                return;
            }
            else {
                const quote = animeQuotes.getQuotesByAnime(args[1]);
                if (quote.quote === undefined) {
                    const aniQuote = animeQuotes.getQuotesByCharacter(args[1]);
                    if (aniQuote.quote === undefined) {
                        animeQuoteEmbed
                            .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)
                            .setDescription("Could not find a quote!");
                        message.channel.send(animeQuoteEmbed);
                        return;
                    }
                    animeQuoteEmbed
                        .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
                        .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)
                        .setDescription(`${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
                        `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
                        `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`);
                    message.channel.send(animeQuoteEmbed);
                    return;
                }
                animeQuoteEmbed
                    .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
                    .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)
                    .setDescription(`${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
                    `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
                    `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`);
                message.channel.send(animeQuoteEmbed);
            }
        });
    }
}
exports.default = AnimeQuote;
//# sourceMappingURL=animequote.js.map