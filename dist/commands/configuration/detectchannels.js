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
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class DetectChannels extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            const star = discord.getEmoji("star");
            if (yield perms.checkAdmin(message))
                return;
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                detectPrompt(message);
                return;
            }
            const ignored = yield sql.fetchColumn("detection", "ignored");
            const step = 5.0;
            const increment = Math.ceil((ignored[0] ? ignored[0].length : 1) / step);
            const detectArray = [];
            for (let i = 0; i < increment; i++) {
                let description = "";
                for (let j = 0; j < step; j++) {
                    if (ignored[0]) {
                        const value = (i * step) + j;
                        if (!ignored[0][value])
                            break;
                        description += `**${value + 1} =>**\n` +
                            `${star}Channel: ${ignored[0] ? (ignored[0][value] ? `<#${ignored[0][value]}>` : "None") : "None"}\n`;
                    }
                    else {
                        description = "None";
                    }
                }
                const detectEmbed = embeds.createEmbed();
                detectEmbed
                    .setTitle(`**Ignored Detection Channels** ${discord.getEmoji("kisaragibawls")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription("Channels in this list will be exempt from anime detection.\n" +
                    "\n" +
                    "__Current Settings__\n" +
                    description + "\n" +
                    "\n" +
                    "__Edit Settings__\n" +
                    `${star}**Mention channels** to add channels.\n` +
                    `${star}Type **reset** to delete all settings.\n` +
                    `${star}Type **cancel** to exit.\n`);
                detectArray.push(detectEmbed);
            }
            if (detectArray.length > 1) {
                embeds.createReactionEmbed(detectArray);
            }
            else {
                message.channel.send(detectArray[0]);
            }
            function detectPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    let dIgnored = yield sql.fetchColumn("detection", "ignored");
                    const responseEmbed = embeds.createEmbed();
                    responseEmbed.setTitle(`**Ignored Detection Channels** ${discord.getEmoji("kisaragibawls")}`);
                    let setInit = false;
                    if (!dIgnored[0])
                        dIgnored = [""];
                    setInit = true;
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("detection", "ignored", null);
                        responseEmbed
                            .setDescription(`${star}All settings were **reset**!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    const newChan = msg.content.match(/(?<=<#)(.*?)(?=>)/g);
                    if (!newChan.join(""))
                        return msg.reply("You did not mention any channels!");
                    let description = "";
                    for (let i = 0; i < newChan.length; i++) {
                        dIgnored.push(newChan[i]);
                        if (setInit)
                            dIgnored = dIgnored.filter(Boolean);
                        yield sql.updateColumn("detection", "ignored", dIgnored);
                        description += `${star}Added <#${newChan[i]}>!\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(detectPrompt);
        });
    }
}
exports.default = DetectChannels;
//# sourceMappingURL=detectchannels.js.map