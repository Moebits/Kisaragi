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
class Mod extends Command_1.Command {
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
                modPrompt(message);
                return;
            }
            const ascii = yield sql.fetchColumn("blocks", "ascii name toggle");
            const mute = yield sql.fetchColumn("special roles", "mute role");
            const restrict = yield sql.fetchColumn("special roles", "restricted role");
            const warnOne = yield sql.fetchColumn("special roles", "warn one");
            const warnTwo = yield sql.fetchColumn("special roles", "warn two");
            const admin = yield sql.fetchColumn("special roles", "admin role");
            const mod = yield sql.fetchColumn("special roles", "mod role");
            const warnPen = yield sql.fetchColumn("warns", "warn penalty");
            const warnThresh = yield sql.fetchColumn("warns", "warn threshold");
            const modEmbed = embeds.createEmbed();
            modEmbed
                .setTitle(`**Moderator Settings** ${discord.getEmoji("karenAnger")}`)
                .setThumbnail(message.guild.iconURL())
                .setDescription("Edit moderation settings for the server.\n" +
                "\n" +
                "**Restricted Role** = Can be any role with restricted permissions.\n" +
                "**Warn Threshold** = How many warnings will trigger the punishment.\n" +
                "**Warn Penalty** = The punishment after hitting the warn threshold.\n" +
                "**Ascii Names** = Removes all non-ascii characters in usernames.\n" +
                "\n" +
                "__Current Settings__\n" +
                `${star}Admin role: ${admin.join("") ? `<@&${admin.join("")}>` : "None"}\n` +
                `${star}Mod role: ${mod.join("") ? `<@&${mod.join("")}>` : "None"}\n` +
                `${star}Mute role: ${mute.join("") ? `<@&${mute.join("")}>` : "None"}\n` +
                `${star}Restricted role: ${restrict.join("") ? `<@&${restrict.join("")}>` : "None"}\n` +
                `${star}Warn One role: ${warnOne.join("") ? `<@&${warnOne.join("")}>` : "None"}\n` +
                `${star}Warn Two role: ${warnTwo.join("") ? `<@&${warnTwo.join("")}>` : "None"}\n` +
                `${star}Warn Threshold: **${warnThresh.join("")}**\n` +
                `${star}Warn Penalty: **${warnPen.join("") ? `${warnPen.join("")}` : "none"}**\n` +
                `${star}Ascii names are **${ascii.join("")}**\n` +
                "\n" +
                "__Edit Settings__\n" +
                `${star}Type **ascii** to toggle ascii names on/off.\n` +
                `${star}Type **any number** to set the warning threshold.\n` +
                `${star}Type **ban**, **kick**, **mute**, or **none** to set the warn penalty.\n` +
                `${star}**Mention a role or type a role id** to set the admin role.\n` +
                `${star}Do the same **between exclamation points !role!** to set the mod role.\n` +
                `${star}Do the same **between percent signs %role%** to set the mute role.\n` +
                `${star}Do the same **between dollar signs $role$** to set the restricted role.\n` +
                `${star}Do the same **between parentheses (role)** to set the role for warn one.\n` +
                `${star}Do the same **between brackets [role]** to set the role for warn two.\n` +
                `${star}**Type multiple settings** to set them at once.\n` +
                `${star}Type **reset** to reset settings.\n` +
                `${star}Type **cancel** to exit.\n`);
            message.channel.send(modEmbed);
            function modPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    responseEmbed.setTitle(`**Moderator Settings** ${discord.getEmoji("karenAnger")}`);
                    let [setAscii, setMute, setRestrict, setWarnOne, setWarnTwo, setWarnPenalty, setWarnThreshold, setAdmin, setMod] = [];
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("blocks", "ascii name toggle", "off");
                        yield sql.updateColumn("special roles", "mute role", null);
                        yield sql.updateColumn("special roles", "restricted role", null);
                        yield sql.updateColumn("special roles", "warn one", null);
                        yield sql.updateColumn("special roles", "warn one", null);
                        yield sql.updateColumn("warns", "warn penalty", "none");
                        yield sql.updateColumn("warns", "warn threshold", null);
                        responseEmbed
                            .setDescription(`${star}All settings were reset!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    const newMsg = msg.content.replace(/<@&/g, "").replace(/>/g, "");
                    const adminRole = newMsg.replace(/\s+\d\s+/, "").replace(/\s+/g, "").replace(/(?<=\$)(.*?)(?=\$)/g, "").replace(/(?<=\()(.*?)(?=\))/g, "")
                        .replace(/(?<=!)(.*?)(?=!)/g, "").replace(/(?<=#)(.*?)(?=#)/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "").match(/\d+/g);
                    const modRole = newMsg.replace(/\s+/g, "").match(/(?<=!)(.*?)(?=!)/g);
                    const muteRole = newMsg.replace(/\s+/g, "").match(/(?<=#)(.*?)(?=#)/g);
                    const restrictRole = newMsg.replace(/\s+/g, "").match(/(?<=\$)(.*?)(?=\$)/g);
                    const warnOneRole = newMsg.replace(/\s+/g, "").match(/(?<=\()(.*?)(?=\))/g);
                    const warnTwoRole = newMsg.replace(/\s+/g, "").match(/(?<=\[)(.*?)(?=\])/g);
                    const warnPenalty = newMsg.match(/ban/gi) || newMsg.match(/kick/gi) || newMsg.match(/mute/gi) || newMsg.match(/none/gi);
                    const warnThreshold = newMsg.match(/\s\d\s+/);
                    if (msg.content.match(/ascii/gi))
                        setAscii = true;
                    if (adminRole)
                        setAdmin = true;
                    if (modRole)
                        setMod = true;
                    if (muteRole)
                        setMute = true;
                    if (restrictRole)
                        setRestrict = true;
                    if (warnOneRole)
                        setWarnOne = true;
                    if (warnTwoRole)
                        setWarnTwo = true;
                    if (warnPenalty)
                        setWarnPenalty = true;
                    if (warnThreshold)
                        setWarnThreshold = true;
                    let description = "";
                    if (setAscii) {
                        if (ascii.join("") === "off") {
                            yield sql.updateColumn("blocks", "ascii name toggle", "on");
                            description += `${star}Ascii names are **on**!\n`;
                        }
                        else {
                            yield sql.updateColumn("blocks", "ascii name toggle", "off");
                            description += `${star}Ascii names are **off**!\n`;
                        }
                    }
                    if (setAdmin) {
                        yield sql.updateColumn("special roles", "admin role", adminRole.join(""));
                        description += `${star}Admin role set to <@&${adminRole.join("")}>!\n`;
                    }
                    if (setMod) {
                        yield sql.updateColumn("special roles", "mod role", modRole.join(""));
                        description += `${star}Mod role set to <@&${modRole.join("")}>!\n`;
                    }
                    if (setMute) {
                        yield sql.updateColumn("special roles", "mute role", muteRole.join(""));
                        description += `${star}Mute role set to <@&${muteRole.join("")}>!\n`;
                    }
                    if (setRestrict) {
                        yield sql.updateColumn("special roles", "restricted role", restrictRole.join(""));
                        description += `${star}Restricted role set to <@&${restrictRole.join("")}>!\n`;
                    }
                    if (setWarnOne) {
                        yield sql.updateColumn("special roles", "warn one", warnOneRole.join(""));
                        description += `${star}Warn one role set to <@&${warnOneRole.join("")}>!\n`;
                    }
                    if (setWarnTwo) {
                        yield sql.updateColumn("special roles", "warn two", warnTwoRole.join(""));
                        description += `${star}Warn two role set to <@&${warnTwoRole.join("")}>!\n`;
                    }
                    if (setWarnThreshold) {
                        yield sql.updateColumn("warns", "warn threshold", warnThreshold.join(""));
                        description += `${star}Warn threshold set to **${warnThreshold.join("").trim()}**!\n`;
                    }
                    if (setWarnPenalty) {
                        yield sql.updateColumn("warns", "warn penalty", warnPenalty.join(""));
                        description += `${star}Warn penalty set to **${warnPenalty.join("").trim()}**!\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(modPrompt);
        });
    }
}
exports.default = Mod;
//# sourceMappingURL=mod.js.map