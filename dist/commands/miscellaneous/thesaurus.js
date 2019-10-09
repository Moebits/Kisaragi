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
const { CollegiateThesaurus } = require("mw-dict");
class Thesaurus extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const thesaurus = new CollegiateThesaurus(process.env.THESAURUS_API_KEY);
            const word = Functions_1.Functions.combineArgs(args, 1);
            const thesaurusEmbed = embeds.createEmbed();
            let result;
            try {
                result = yield thesaurus.lookup(word.trim());
            }
            catch (error) {
                thesaurusEmbed
                    .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
                    .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
                    .setDescription(`No synonyms were found. Here are some word suggestions: \n${error.suggestions.join(", ")}`);
                message.channel.send(thesaurusEmbed);
                return;
            }
            const meaningArray = [];
            const exampleArray = [];
            const synonymArray = [];
            const antonymArray = [];
            for (const i in result[0].definition) {
                meaningArray.push(result[0].definition[i].meanings[0]);
                if (result[0].definition[i].illustrations) {
                    exampleArray.push(result[0].definition[i].illustrations[0]);
                }
                else {
                    exampleArray.push("");
                }
                synonymArray.push(result[0].definition[i].synonyms.join(", "));
                if (result[0].definition[i].antonyms) {
                    exampleArray.push(result[0].definition[i].antonyms.join(", "));
                }
                else {
                    antonymArray.push("");
                }
            }
            let synonyms = "";
            for (let i = 0; i < meaningArray.length; i++) {
                synonyms += `${discord.getEmoji("star")}_Meaning:_ ${meaningArray[i]}\n`;
                if (exampleArray[i]) {
                    synonyms += `${discord.getEmoji("star")}_Example:_ ${exampleArray[i]}\n`;
                }
                synonyms += `${discord.getEmoji("star")}_Synonyms:_ ${synonymArray[i]}\n`;
                if (antonymArray[i]) {
                    synonyms += `${discord.getEmoji("star")}_Antonyms:_ ${antonymArray[i]}\n`;
                }
            }
            thesaurusEmbed
                .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
                .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
                .setURL(`https://www.merriam-webster.com/thesaurus/${result[0].word.replace(/ /g, "_")}`)
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(`${discord.getEmoji("star")}_Word:_ **${result[0].word}**\n` +
                `${discord.getEmoji("star")}_Function:_ **${result[0].functional_label}**\n` +
                `${discord.getEmoji("star")}_Popularity:_ **${result[0].popularity}**\n` +
                `${Functions_1.Functions.checkChar(synonyms, 2000, ",")}\n`);
            message.channel.send(thesaurusEmbed);
        });
    }
}
exports.default = Thesaurus;
//# sourceMappingURL=thesaurus.js.map