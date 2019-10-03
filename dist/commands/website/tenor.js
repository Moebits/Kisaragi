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
const tenorjs_1 = __importDefault(require("tenorjs"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class TenorCommand extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const tenor = new tenorjs_1.default.client({
                Key: process.env.TENOR_API_KEY,
                Filter: "off",
                Locale: "en_US",
                MediaFilter: "minimal",
                DateFormat: "MM/DD/YYYY"
            });
            const query = Functions_1.Functions.combineArgs(args, 1);
            const tenorEmbed = embeds.createEmbed();
            const result = query ? yield tenor.Search.Random(query, "1")
                : yield tenor.Trending.GIFs("10");
            const random = Math.floor(Math.random() * result.length);
            tenorEmbed
                .setAuthor("tenor", "https://tenor.com/assets/img/tenor-app-icon.png")
                .setTitle(`**Tenor Gif** ${discord.getEmoji("raphi")}`)
                .setURL(result[random].itemurl)
                .setDescription(`${discord.getEmoji("star")}_Title:_ **${result[random].title}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(result[random].created)}**`)
                .setImage(result[random].media[0].gif.url);
            message.channel.send(tenorEmbed);
        });
    }
}
exports.default = TenorCommand;
//# sourceMappingURL=tenor.js.map