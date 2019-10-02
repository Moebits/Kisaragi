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
class Selfroles extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            // If not admin, only shows the role list.
            if (yield perms.checkAdmin(message, true)) {
                let selfroles = yield sql.fetchColumn("special roles", "self roles");
                selfroles = JSON.parse(selfroles[0]);
                const step = 3.0;
                const increment = Math.ceil((selfroles[0] ? selfroles.length : 1) / step);
                const selfArray = [];
                for (let i = 0; i < increment; i++) {
                    let settings = "";
                    for (let j = 0; j < step; j++) {
                        if (selfroles[0]) {
                            const value = (i * step) + j;
                            if (!selfroles.join(""))
                                settings = "None";
                            if (!selfroles[value])
                                break;
                            settings += `${i + 1} **=>** ` + `<@&${selfroles[value]}>`;
                        }
                        else {
                            settings = "None";
                        }
                    }
                    const selfEmbed = embeds.createEmbed();
                    selfEmbed
                        .setTitle(`**Self Role List** ${discord.getEmoji("karenSugoi")}`)
                        .setThumbnail(message.guild.iconURL())
                        .setDescription(settings + "\n");
                    selfArray.push(selfEmbed);
                }
                if (selfArray.length > 1) {
                    embeds.createReactionEmbed(selfArray);
                }
                else {
                    message.channel.send(selfArray[0]);
                }
                return;
            }
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                selfPrompt(message);
                return;
            }
            let selfroles = yield sql.fetchColumn("special roles", "self roles");
            selfroles = JSON.parse(selfroles[0]);
            const step = 3.0;
            const increment = Math.ceil((selfroles[0] ? selfroles.length : 1) / step);
            const selfArray = [];
            for (let i = 0; i < increment; i++) {
                let settings = "";
                for (let j = 0; j < step; j++) {
                    if (selfroles[0]) {
                        const value = (i * step) + j;
                        if (!selfroles.join(""))
                            settings = "None";
                        if (!selfroles[value])
                            break;
                        settings += `${i + 1} **=>** ` + `<@&${selfroles[value]}>`;
                    }
                    else {
                        settings = "None";
                    }
                }
                const selfEmbed = embeds.createEmbed();
                selfEmbed
                    .setTitle(`**Self Role Settings** ${discord.getEmoji("karenSugoi")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`Add and remove self-assignable roles. Users can assign them with the command **selfrole**.\n` +
                    "\n" +
                    `__Current Settings__\n` +
                    settings + "\n" +
                    "\n" +
                    `__Edit Settings__\n` +
                    `${discord.getEmoji("star")}**Mention roles** to add self assignable roles.\n` +
                    `${discord.getEmoji("star")}Type **delete (setting number)** to remove a role.\n` +
                    `${discord.getEmoji("star")}Type **reset** to delete all roles.\n` +
                    `${discord.getEmoji("star")}Type **cancel** to exit.\n`);
                selfArray.push(selfEmbed);
            }
            if (selfArray.length > 1) {
                embeds.createReactionEmbed(selfArray);
            }
            else {
                message.channel.send(selfArray[0]);
            }
            function selfPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    responseEmbed.setTitle(`**Self Role Settings** ${discord.getEmoji("karenSugoi")}`);
                    let selfroles = yield sql.fetchColumn("special roles", "self roles");
                    selfroles = JSON.parse(selfroles[0]);
                    if (!selfroles[0])
                        selfroles = [];
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("special roles", "self roles", null);
                        responseEmbed
                            .setDescription(`${discord.getEmoji("star")}Self role settings were wiped!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase().includes("delete")) {
                        const num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""));
                        if (num) {
                            if (selfroles[0] ? selfroles[num - 1] : false) {
                                selfroles[num - 1] = "";
                                selfroles = selfroles.filter(Boolean);
                                yield sql.updateColumn("special roles", "selfroles", JSON.stringify(selfroles));
                                responseEmbed
                                    .setDescription(`${discord.getEmoji("star")}Setting ${num} was deleted!`);
                                msg.channel.send(responseEmbed);
                                return;
                            }
                            else {
                                responseEmbed
                                    .setDescription(`${discord.getEmoji("star")}Setting not found!`);
                                msg.channel.send(responseEmbed);
                                return;
                            }
                        }
                        else {
                            responseEmbed
                                .setDescription(`${discord.getEmoji("star")}Setting not found!`);
                            msg.channel.send(responseEmbed);
                            return;
                        }
                    }
                    let roles = msg.content.replace(/<@&/g, "").replace(/>/g, "").match(/\s?\d+/g);
                    roles = roles.map((r) => r.trim());
                    let description = "";
                    for (let i = 0; i < roles.length; i++) {
                        selfroles.push(roles[i]);
                        description += `${discord.getEmoji("star")}Added <@&${roles[i]}>!\n`;
                    }
                    if (!description)
                        return;
                    yield sql.updateColumn("special roles", "self roles", JSON.stringify(selfroles));
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(selfPrompt);
        });
    }
}
exports.default = Selfroles;
//# sourceMappingURL=selfroles.js.map