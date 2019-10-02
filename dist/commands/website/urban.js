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
const urban_js_1 = __importDefault(require("urban.js"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Urban extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const urbanEmbed = embeds.createEmbed();
            if (args[1]) {
                const word = args[1];
                const result = yield urban_js_1.default(word);
                const cleanDef = result.definition.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm, "");
                const cleanExample = result.example.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm, "");
                const checkedExample = Functions_1.Functions.checkChar(cleanExample, 1700, ".");
                urbanEmbed
                    .setAuthor("Urban Dictionary", "https://firebounty.com/image/635-urban-dictionary")
                    .setURL(result.URL)
                    .setTitle(`**Urban Dictionary** ${discord.getEmoji("smugFace")}`)
                    .setDescription(`${discord.getEmoji("star")}**Word**: ${result.word}\n` +
                    `${discord.getEmoji("star")}**Author**: ${result.author ? result.author : "None"}\n` +
                    `${discord.getEmoji("star")}${discord.getEmoji("up")} ${result.thumbsUp} ${discord.getEmoji("down")} ${result.thumbsDown}\n` +
                    `${discord.getEmoji("star")}**Definition**: ${cleanDef ? cleanDef : "None"}\n` +
                    `${discord.getEmoji("star")}**Example**: ${checkedExample ? checkedExample : "None"}`)
                    .setThumbnail(message.author.displayAvatarURL());
                message.channel.send(urbanEmbed);
                return;
            }
            const result = yield urban_js_1.default.random();
            const cleanDef = result.definition.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm, "");
            const cleanExample = result.example.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm, "");
            const checkedExample = Functions_1.Functions.checkChar(cleanExample, 1700, ".");
            urbanEmbed
                .setAuthor("Urban Dictionary", "https://firebounty.com/image/635-urban-dictionary")
                .setURL(result.URL)
                .setTitle(`**Urban Dictionary** ${discord.getEmoji("smugFace")}`)
                .setDescription(`${discord.getEmoji("star")}**Word**: ${result.word}\n` +
                `${discord.getEmoji("star")}**Author**: ${result.author ? result.author : "None"}\n` +
                `${discord.getEmoji("star")}${discord.getEmoji("up")} ${result.thumbsUp} ${discord.getEmoji("down")} ${result.thumbsDown}\n` +
                `${discord.getEmoji("star")}**Definition**: ${cleanDef ? cleanDef : "None"}\n` +
                `${discord.getEmoji("star")}**Example**: ${checkedExample ? checkedExample : "None"}`)
                .setThumbnail(message.author.displayAvatarURL());
            message.channel.send(urbanEmbed);
        });
    }
}
exports.default = Urban;
//# sourceMappingURL=urban.js.map