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
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Warn extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.checkWarns = (discord, message, embeds, sql, warnLog, userID, warnThreshold, warnPenalty, warnOneRole, warnTwoRole) => __awaiter(this, void 0, void 0, function* () {
            const member = message.guild.members.find((m) => m.id === userID);
            const warnReason = `Exceeded the threshold of ${warnThreshold[0]} warns.`;
            const dmEmbed = embeds.createEmbed();
            const guildEmbed = embeds.createEmbed();
            const dm = yield member.createDM();
            for (let i = 0; i < warnLog.length; i++) {
                if (typeof warnLog[i] === "string")
                    warnLog[i] = JSON.parse(warnLog[i]);
                if (warnLog[i].user === userID) {
                    if (warnLog[i].warns.length >= 1) {
                        if (warnOneRole) {
                            if (!member.roles.has(warnOneRole.id)) {
                                yield member.roles.add(warnOneRole);
                                message.channel.send(`<@${userID}>, you were given the ${warnOneRole} role because you have one warn.`);
                            }
                        }
                    }
                    if (warnLog[i].warns.length >= 2) {
                        if (warnTwoRole) {
                            if (!member.roles.has(warnTwoRole.id)) {
                                yield member.roles.add(warnTwoRole);
                                message.channel.send(`<@${userID}>, you were given the ${warnTwoRole} role because you have two warns.`);
                            }
                        }
                    }
                    if (warnLog[i].warns.length >= parseInt(warnThreshold[0], 10)) {
                        switch (warnPenalty[0].toLowerCase().trim()) {
                            case "ban":
                                dmEmbed
                                    .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                                    .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                                    .setDescription(`${discord.getEmoji("star")}_You were banned from ${message.guild.name} for reason:_ **${warnReason}**`);
                                try {
                                    yield dm.send(dmEmbed);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                                guildEmbed
                                    .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                                    .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                                    .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${userID}> for reason:_ **${warnReason}**`);
                                yield member.ban({ reason: warnReason });
                                message.channel.send(guildEmbed);
                                break;
                            case "kick":
                                dmEmbed
                                    .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                                    .setTitle(`**You Were Kicked** ${discord.getEmoji("kannaFU")}`)
                                    .setDescription(`${discord.getEmoji("star")}_You were kicked from ${message.guild.name} for reason:_ **${warnReason}**`);
                                try {
                                    yield dm.send(dmEmbed);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                                guildEmbed
                                    .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                                    .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
                                    .setDescription(`${discord.getEmoji("star")}_Successfully kicked <@${userID}> for reason:_ **${warnReason}**`);
                                yield member.kick(warnReason);
                                message.channel.send(guildEmbed);
                                break;
                            case "mute":
                                const mute = yield sql.fetchColumn("special roles", "mute role");
                                if (!mute) {
                                    message.reply(`Failed to mute <@${userID}>. You do not have a mute role set!`);
                                    return false;
                                }
                                yield member.roles.add(mute.join(""));
                                dmEmbed
                                    .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                                    .setTitle(`**You Were Muted** ${discord.getEmoji("kannaFU")}`)
                                    .setDescription(`${discord.getEmoji("star")}_You were muted from ${message.guild.name} for reason:_ **${warnReason}**`);
                                try {
                                    yield dm.send(dmEmbed);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                                guildEmbed
                                    .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                                    .setTitle(`**Member Muted** ${discord.getEmoji("kannaFU")}`)
                                    .setDescription(`${discord.getEmoji("star")}_Successfully muted <@${userID}> for reason:_ **${warnReason}**`);
                                yield member.kick(warnReason);
                                message.channel.send(guildEmbed);
                                break;
                            default:
                        }
                    }
                }
            }
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            if (yield perms.checkMod(message))
                return;
            const warnThreshold = yield sql.fetchColumn("warns", "warn threshold");
            const warnPenalty = yield sql.fetchColumn("warns", "warn penalty");
            const warnOne = yield sql.fetchColumn("special roles", "warn one");
            const warnTwo = yield sql.fetchColumn("special roles", "warn two");
            let warnLog = yield sql.fetchColumn("warns", "warn log");
            let setInit = false;
            if (!warnLog.join(""))
                warnLog = [""];
            setInit = true;
            let warnOneRole, warnTwoRole;
            if (warnOne[0])
                warnOneRole = message.guild.roles.find((r) => r.id === warnOne[0]);
            if (warnTwo[0])
                warnTwoRole = message.guild.roles.find((r) => r.id === warnTwo[0]);
            const reasonArray = [];
            const userArray = [];
            for (let i = 1; i < args.length; i++) {
                if (args[i].match(/\d+/g)) {
                    userArray.push(args[i].match(/\d+/g)[0]);
                }
                else {
                    reasonArray.push(args[i]);
                }
            }
            const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!";
            for (let i = 0; i < userArray.length; i++) {
                let found = false;
                for (let j = 0; j < warnLog.length; j++) {
                    warnLog[j] = JSON.parse(warnLog[j]);
                    if (userArray[i] === warnLog[j].user ? warnLog[j].user.toString() : null) {
                        warnLog[j].warns.push(reason);
                        found = true;
                    }
                }
                if (!found) {
                    warnLog.push(`{"user": "${userArray[i]}", "warns": ["${reason}"]}`);
                }
                for (let j = 0; j < warnLog.length; j++) {
                    warnLog[j] = JSON.parse(JSON.stringify(warnLog[j]));
                }
                yield this.checkWarns(discord, message, embeds, sql, warnLog, userArray[i], warnThreshold, warnPenalty, warnOneRole, warnTwoRole);
            }
            if (setInit)
                warnLog = warnLog.filter(Boolean);
            yield sql.updateColumn("warns", "warn log", warnLog);
            let users = "";
            for (let i = 0; i < userArray.length; i++) {
                users += `<@${userArray[i]}> `;
                const warnDMEmbed = embeds.createEmbed();
                warnDMEmbed
                    .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
                    .setTitle(`**You Were Warned** ${discord.getEmoji("kannaFU")}`)
                    .setDescription(`${discord.getEmoji("star")}_You were warned in ${message.guild.name} for reason: **${reason}**_`);
                const member = message.guild.members.find((m) => m.id === userArray[i]);
                const dm = yield member.createDM();
                yield dm.send(warnDMEmbed);
            }
            const warnEmbed = embeds.createEmbed();
            warnEmbed
                .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
                .setTitle(`**Member Warned** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_Successfully warned ${users} for reason: **${reason}**_`);
            message.channel.send(warnEmbed);
        });
    }
}
exports.default = Warn;
//# sourceMappingURL=warn.js.map