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
const mw_dict_1 = require("mw-dict");
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Define extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const star = discord.getEmoji("star");
            const dictionary = new mw_dict_1.CollegiateDictionary(process.env.DICTIONARY_API_KEY);
            const word = Functions_1.Functions.combineArgs(args, 1);
            const defineEmbed = embeds.createEmbed();
            let result;
            try {
                result = yield dictionary.lookup(word.trim());
            }
            catch (error) {
                defineEmbed
                    .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
                    .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
                    .setDescription(`No definitions were found. Here are some word suggestions: \n${error.suggestions.join(", ")}`);
                message.channel.send(defineEmbed);
                return;
            }
            const definArray = [];
            const exampleArray = [];
            for (const i in result[0].definition) {
                if (result[0].definition[i].senses) {
                    const meaningArray = [];
                    if (result[0].definition[i].senses.join("")) {
                        for (const j in result[0].definition[i].senses[0].meanings) {
                            if (result[0].definition[i].senses[0].meanings[j] === ":") {
                                if (result[0].definition[i].senses[0].synonyms) {
                                    meaningArray.push(result[0].definition[i].senses[0].synonyms.join(" "));
                                }
                                else {
                                    meaningArray.push("");
                                }
                            }
                            else {
                                meaningArray.push(result[0].definition[i].senses[0].meanings[j]);
                            }
                        }
                        definArray.push(meaningArray.join("\n"));
                        exampleArray.push(result[0].definition[i].senses[0].illustrations ? result[0].definition[i].senses[0].illustrations[0] : "");
                    }
                    else {
                        definArray.push(result[0].definition[i].meanings.join("\n"));
                    }
                }
                else {
                    if (result[0].definition[i].meanings.join("").trim() === ":") {
                        definArray.push("");
                    }
                    else {
                        definArray.push(result[0].definition[i].meanings.join("\n"));
                    }
                    exampleArray.push(result[0].definition[i].illustrations ? result[0].definition[i].illustrations[0] : "");
                }
            }
            let definitions = "";
            for (const i in definArray) {
                if (definArray[i]) {
                    definitions += `${star}_Definition:_ ${definArray[i]}\n`;
                }
                if (exampleArray[i]) {
                    definitions += `${star}_Example:_ ${exampleArray[i]}\n`;
                }
            }
            defineEmbed
                .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
                .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
                .setURL(`https://www.merriam-webster.com/dictionary/${result[0].word.replace(/ /g, "_")}`)
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(`${star}_Word:_ **${result[0].word}**\n` +
                `${star}_Function:_ **${result[0].functional_label}**\n` +
                `${star}_Popularity:_ **${result[0].popularity}**\n` +
                `${star}_Etymology:_ ${result[0].etymology ? result[0].etymology : "None"}\n` +
                `${Functions_1.Functions.checkChar(definitions, 2000, ".")}\n`);
            message.channel.send(defineEmbed);
        });
    }
}
exports.default = Define;
//# sourceMappingURL=define.js.map