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
const nasa = require("nasa-sdk");
class Nasa extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            nasa.setNasaApiKey(process.env.NASA_API_KEY);
            const nasaEmbed = embeds.createEmbed();
            const data = yield nasa.APOD.fetch();
            const checkedMessage = Functions_1.Functions.checkChar(data.explanation, 1900, ".");
            nasaEmbed
                .setAuthor("nasa", "https://cdn.mos.cms.futurecdn.net/baYs9AuHxx9QXeYBiMvSLU.jpg")
                .setTitle(`**Nasa Picture** ${discord.getEmoji("cute")}`);
            if (data.media_type === "video") {
                nasaEmbed
                    .setURL(data.url)
                    .setDescription(`${discord.getEmoji("star")}_Title:_ **${data.title}**\n` +
                    `${discord.getEmoji("star")}_Date:_ **${Functions_1.Functions.formatDate(data.date)}**\n` +
                    `${discord.getEmoji("star")}_Explanation:_ **${checkedMessage}**\n`)
                    .setImage(data.url)
                    .setThumbnail(message.author.displayAvatarURL());
            }
            message.channel.send(nasaEmbed);
        });
    }
}
exports.default = Nasa;
//# sourceMappingURL=nasa.js.map