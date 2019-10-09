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
const discord_js_1 = require("discord.js");
const Command_1 = require("../../structures/Command");
const CommandFunctions_1 = require("./../../structures/CommandFunctions");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
const google = require("google-it");
class Google extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const commands = new CommandFunctions_1.CommandFunctions(discord);
            const embeds = new Embeds_1.Embeds(discord, message);
            const query = Functions_1.Functions.combineArgs(args, 1);
            const resultArray = [];
            const result = yield google({ query, limit: 50 });
            for (const i in result) {
                resultArray.push(`${discord.getEmoji("star")}_Title:_ **${result[i].title}**`);
                resultArray.push(`${discord.getEmoji("star")}_Link:_ ${result[i].link}`);
            }
            const googleEmbedArray = [];
            yield commands.runCommand(message, ["screenshot", "return", `https://www.google.com/search?q=${query.trim().replace(/ /g, "+")}`]);
            const attachment = new discord_js_1.MessageAttachment("../assets/images/screenshot.png");
            for (let i = 0; i < resultArray.length; i += 10) {
                const googleEmbed = embeds.createEmbed();
                googleEmbed
                    .setAuthor("google", "https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png")
                    .setTitle(`**Google Search** ${discord.getEmoji("raphi")}`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .attachFiles([attachment])
                    .setImage(`attachment://screenshot.png`)
                    .setDescription(resultArray.slice(i, i + 10).join("\n"));
                googleEmbedArray.push(googleEmbed);
            }
            embeds.createReactionEmbed(googleEmbedArray);
        });
    }
}
exports.default = Google;
//# sourceMappingURL=google.js.map