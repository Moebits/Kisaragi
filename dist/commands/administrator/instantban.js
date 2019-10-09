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
class InstantBan extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const star = discord.getEmoji("star");
            if (yield perms.checkAdmin(message))
                return;
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                instantBanPrompt(message);
                return;
            }
            const pfpBan = yield sql.fetchColumn("blocks", "pfp ban toggle");
            const leaveBan = yield sql.fetchColumn("blocks", "leaver ban toggle");
            const defChannel = yield sql.fetchColumn("blocks", "default channel");
            const instantBanEmbed = embeds.createEmbed();
            instantBanEmbed
                .setTitle(`**Instant Bans** ${discord.getEmoji("mexShrug")}`)
                .setThumbnail(message.guild.iconURL())
                .setDescription("Configure settings for instant bans.\n" +
                "\n" +
                "**Profile Picture Ban** = Bans all members that have a default profile picture upon joining.\n" +
                "**Leave Ban** = Bans all members that join and then leave in under 5 minutes.\n" +
                "**Default Channel** = The default channel where messages will be posted.\n" +
                "\n" +
                "__Current Settings:__\n" +
                `${star}_Profile Picture Ban:_ **${pfpBan.join("")}**\n` +
                `${star}_Leave Ban:_ **${leaveBan.join("")}**\n` +
                `${star}_Default Channel:_ **${defChannel.join("") ? `<#${defChannel.join("")}>` : "None"}**\n` +
                "\n" +
                "__Edit Settings:__\n" +
                `${star}_Type **pfp** to toggle profile picture bans._\n` +
                `${star}_Type **leave** to toggle leave bans._\n` +
                `${star}_**Mention a channel** to set the default channel._\n` +
                `${star}_**You can type multiple options** to enable all at once._\n` +
                `${star}_Type **reset** to disable all settings._\n` +
                `${star}_Type **cancel** to exit._\n`);
            message.channel.send(instantBanEmbed);
            function instantBanPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    let setPfp, setLeave, setChannel;
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("blocks", "pfp ban toggle", "off");
                        yield sql.updateColumn("blocks", "leaver ban toggle", "off");
                        responseEmbed
                            .setDescription(`${star}All settings were disabled!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.match(/pfp/g))
                        setPfp = true;
                    if (msg.content.match(/leave/g))
                        setLeave = true;
                    if (msg.mentions.channels.array().join(""))
                        setChannel = true;
                    if (setChannel) {
                        const channel = msg.guild.channels.find((c) => c === msg.mentions.channels.first());
                        yield sql.updateColumn("blocks", "default channel", channel.id);
                        responseEmbed
                            .setDescription(`${star}Default channel set to <#${channel.id}>!\n`);
                        if (setPfp || setLeave) {
                            msg.channel.send(responseEmbed);
                        }
                        else {
                            msg.channel.send(responseEmbed);
                            return;
                        }
                    }
                    if (setPfp && setLeave) {
                        yield sql.updateColumn("blocks", "pfp ban toggle", "on");
                        yield sql.updateColumn("blocks", "leaver ban toggle", "on");
                        responseEmbed
                            .setDescription(`${star}Profile picture and leave bans are now **on**!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (setPfp) {
                        if (pfpBan.join("") === "off") {
                            yield sql.updateColumn("blocks", "pfp ban toggle", "on");
                            responseEmbed
                                .setDescription(`${star}Profile picture bans are now **on**!`);
                            msg.channel.send(responseEmbed);
                            return;
                        }
                        else {
                            yield sql.updateColumn("blocks", "pfp ban toggle", "off");
                            responseEmbed
                                .setDescription(`${star}Profile picture bans are now **off**!`);
                            msg.channel.send(responseEmbed);
                            return;
                        }
                    }
                    if (setLeave) {
                        if (pfpBan.join("") === "off") {
                            yield sql.updateColumn("blocks", "leaver ban toggle", "on");
                            responseEmbed
                                .setDescription(`${star}Leave bans are now **on**!`);
                            msg.channel.send(responseEmbed);
                            return;
                        }
                        else {
                            yield sql.updateColumn("blocks", "leaver ban toggle", "off");
                            responseEmbed
                                .setDescription(`${star}Leave bans are now **off**!`);
                            msg.channel.send(responseEmbed);
                            return;
                        }
                    }
                });
            }
            embeds.createPrompt(instantBanPrompt);
        });
    }
}
exports.default = InstantBan;
//# sourceMappingURL=instantban.js.map