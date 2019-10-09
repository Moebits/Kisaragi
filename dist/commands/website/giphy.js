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
const giphy_api_1 = __importDefault(require("giphy-api"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class GiphyCommand extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const giphy = giphy_api_1.default(process.env.GIPHY_API_KEY);
            const query = Functions_1.Functions.combineArgs(args, 1);
            const giphyEmbed = embeds.createEmbed();
            let gif;
            if (query) {
                const result = yield giphy.random(query);
                gif = result.data;
            }
            else {
                const result = yield giphy.trending();
                const random = Math.floor(Math.random() * result.data.length);
                gif = result.data[random];
            }
            giphyEmbed
                .setAuthor("giphy", "https://media0.giphy.com/media/YJBNjrvG5Ctmo/giphy.gif")
                .setTitle(`**Giphy Gif** ${discord.getEmoji("raphi")}`)
                .setURL(gif.url)
                .setDescription(`${discord.getEmoji("star")}_Title:_ **${gif.title}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(new Date(gif.import_datetime))}**\n` +
                `${discord.getEmoji("star")}_Source Post:_ ${gif.source_post_url ? gif.source_post_url : "None"}\n`)
                .setImage(gif.images.original.url);
            message.channel.send(giphyEmbed);
        });
    }
}
exports.default = GiphyCommand;
//# sourceMappingURL=giphy.js.map