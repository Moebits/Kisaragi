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
class Auto extends Command_1.Command {
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
                autoPrompt(message);
                return;
            }
            const command = yield sql.fetchColumn("auto", "command");
            const channel = yield sql.fetchColumn("auto", "channel");
            const frequency = yield sql.fetchColumn("auto", "frequency");
            const toggle = yield sql.fetchColumn("auto", "toggle");
            const step = 3.0;
            const increment = Math.ceil((command ? command.length : 1) / step);
            const autoArray = [];
            for (let i = 0; i < increment; i++) {
                let settings = "";
                for (let j = 0; j < step; j++) {
                    if (command) {
                        const value = (i * step) + j;
                        if (!command.join(""))
                            settings = "None";
                        if (!command[value])
                            break;
                        settings += `${i + 1} **=>**\n` +
                            `${star}_Command:_ **${command[i] !== "0" ? command[i] : "None"}**\n` +
                            `${star}_Channel:_ **${channel[i] !== "0" ? "<#" + channel[i] + ">" : "None"}**\n` +
                            `${star}_Frequency:_ **${frequency[i] !== "0" ? frequency[i] : "None"}**\n` +
                            `${star}_State:_ **${toggle[i]}**\n`;
                    }
                    else {
                        settings = "None";
                    }
                }
                const autoEmbed = embeds.createEmbed();
                autoEmbed
                    .setTitle(`**Auto Commands** ${discord.getEmoji("think")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription("Configure settings for auto commands. You can set up a maximum of 10 auto commands.\n" +
                    "\n" +
                    "**Frequency** = How often the command will run, in hours.\n" +
                    "**State** = Active (on) or Inactive (off).\n" +
                    "\n" +
                    "__Current Settings:__\n" +
                    `${settings}\n` +
                    "\n" +
                    "__Edit Settings:__\n" +
                    `${star}_Type **any command** to set the command._\n` +
                    `${star}_**Mention any channel** to set the channel._\n` +
                    `${star}_Type **any number** to set the frequency._\n` +
                    `${star}_You can set **multiple options at once**._\n` +
                    `${star}_Type **toggle (setting number)** to toggle the state._\n` +
                    `${star}_Type **edit (setting number)** to edit a setting._\n` +
                    `${star}_Type **delete (setting number)** to delete a setting._\n` +
                    `${star}_Type **reset** to delete all settings._\n` +
                    `${star}_Type **cancel** to exit._\n`);
                autoArray.push(autoEmbed);
            }
            if (autoArray.length > 1) {
                embeds.createReactionEmbed(autoArray);
            }
            else {
                message.channel.send(autoArray);
            }
            function autoPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    responseEmbed.setTitle(`**Auto Commands** ${discord.getEmoji("think")}`);
                    let [setCmd, setChannel, setFreq, setInit] = [];
                    let cmd = yield sql.fetchColumn("auto", "command");
                    let chan = yield sql.fetchColumn("auto", "channel");
                    let freq = yield sql.fetchColumn("auto", "frequency");
                    let tog = yield sql.fetchColumn("auto", "toggle");
                    const tim = yield sql.fetchColumn("auto", "timeout");
                    if (!cmd)
                        cmd = [""];
                    setInit = true;
                    if (!chan)
                        chan = [""];
                    setInit = true;
                    if (!freq)
                        freq = [""];
                    setInit = true;
                    if (!tog)
                        tog = [""];
                    setInit = true;
                    if (msg.content.toLowerCase().startsWith("delete")) {
                        const newMsg = Number(msg.content.replace(/delete/g, "").trim());
                        const num = newMsg - 1;
                        if (newMsg) {
                            cmd[num] = "";
                            chan[num] = "";
                            freq[num] = "";
                            tog[num] = "";
                            tim[num] = "";
                            const arrCmd = cmd.filter(Boolean);
                            const arrChan = chan.filter(Boolean);
                            const arrFreq = freq.filter(Boolean);
                            const arrTog = tog.filter(Boolean);
                            const arrTim = tim.filter(Boolean);
                            yield sql.updateColumn("auto", "command", arrCmd);
                            yield sql.updateColumn("auto", "channel", arrChan);
                            yield sql.updateColumn("auto", "frequency", arrFreq);
                            yield sql.updateColumn("auto", "toggle", arrTog);
                            yield sql.updateColumn("auto", "timeout", arrTim);
                            return msg.channel.send(responseEmbed.setDescription(`Setting **${newMsg}** was deleted!`));
                        }
                        else {
                            return msg.channel.send(responseEmbed.setDescription("Setting not found!"));
                        }
                    }
                    if (msg.content.toLowerCase().startsWith("toggle")) {
                        const newMsg = Number(msg.content.replace(/toggle/g, "").trim());
                        const num = newMsg - 1;
                        const testCmd = yield sql.fetchColumn("auto", "command");
                        const testChan = yield sql.fetchColumn("auto", "channel");
                        const testFreq = yield sql.fetchColumn("auto", "frequency");
                        if (newMsg && testCmd && testChan && testFreq) {
                            if (tog[num] === "inactive") {
                                yield sql.updateColumn("auto", "toggle", "active");
                                return msg.channel.send(responseEmbed.setDescription(`State of setting **${newMsg}** is now **active**!`));
                            }
                            else {
                                yield sql.updateColumn("auto", "toggle", "inactive");
                                return msg.channel.send(responseEmbed.setDescription(`State of setting **${newMsg}** is now **inactive**!`));
                            }
                        }
                        else {
                            return msg.channel.send(responseEmbed.setDescription("You cannot use the toggle command on an unfinished setting!"));
                        }
                    }
                    if (msg.content.toLowerCase().startsWith("edit")) {
                        const newMsg = msg.content.replace(/edit/g, "").trim().split(" ");
                        const tempMsg = newMsg.slice(1).join(" ");
                        const num = Number(newMsg) - 1;
                        if (tempMsg) {
                            const tempCmd = tempMsg.match(/\D+/gi) ? tempMsg.match(/\D+/gi).join("").replace(/<#/g, "").replace(/>/g, "").trim() : null;
                            const tempChan = tempMsg.match(/<#\d+>/g) ? tempMsg.match(/<#\d+>/g).join("").replace(/<#/g, "").replace(/>/g, "") : null;
                            const tempReChan = new RegExp(tempChan, "g");
                            const tempFreq = tempMsg.replace(/\D+/gi, "").replace(tempReChan, "").replace(/\s+/g, "");
                            let editDesc = "";
                            if (tempCmd) {
                                cmd[num] = tempCmd;
                                yield sql.updateColumn("auto", "command", cmd);
                                editDesc += `${star}Command set to **${tempCmd}**!\n`;
                            }
                            if (tempChan) {
                                chan[num] = tempChan;
                                yield sql.updateColumn("auto", "channel", chan);
                                editDesc += `${star}Channel set to **${tempChan}**!\n`;
                            }
                            if (tempFreq) {
                                freq[num] = tempFreq;
                                yield sql.updateColumn("auto", "frequency", freq);
                                editDesc += `${star}Command set to **${tempFreq}**!\n`;
                            }
                            tim[num] = "";
                            yield sql.updateColumn("auto", "timeout", tim);
                            const testCmd = yield sql.fetchColumn("auto", "command");
                            const testChan = yield sql.fetchColumn("auto", "channel");
                            const testFreq = yield sql.fetchColumn("auto", "frequency");
                            if (testCmd[num] && testChan[num] && testFreq[num]) {
                                tog[num] = "active";
                                yield sql.updateColumn("auto", "toggle", tog);
                                editDesc += `${star}This setting is **active**!\n`;
                            }
                            else {
                                tog[num] = "inactive";
                                yield sql.updateColumn("auto", "toggle", tog);
                                editDesc += `${star}This setting is **inactive**!\n`;
                            }
                            return msg.channel.send(responseEmbed.setDescription(editDesc));
                        }
                        else {
                            return msg.channel.send(responseEmbed.setDescription("No edits specified!"));
                        }
                    }
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("auto", "command", null);
                        yield sql.updateColumn("auto", "channel", null);
                        yield sql.updateColumn("auto", "frequency", null);
                        yield sql.updateColumn("auto", "toggle", null);
                        yield sql.updateColumn("auto", "timeout", null);
                        responseEmbed
                            .setDescription(`${star}Auto settings were wiped!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    const newCmd = msg.content.match(/\D+/gi).join("").replace(/<#/g, "").replace(/>/g, "").trim();
                    const newChan = msg.content.match(/<#\d+>/g).join("").replace(/<#/g, "").replace(/>/g, "");
                    const reChan = new RegExp(newChan, "g");
                    const newFreq = msg.content.replace(/\D+/gi, "").replace(reChan, "").replace(/\s+/g, "");
                    if (newCmd)
                        setCmd = true;
                    if (newChan)
                        setChannel = true;
                    if (newFreq)
                        setFreq = true;
                    let description = "";
                    if (setCmd) {
                        if (cmd.length === 10) {
                            return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"));
                        }
                        else {
                            cmd.push(newCmd);
                            const arrCmd = cmd.filter(Boolean);
                            yield sql.updateColumn("auto", "command", arrCmd);
                            description += `${star}Command set to **${newCmd}**!\n`;
                        }
                    }
                    if (setChannel) {
                        if (cmd.length === 10) {
                            return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"));
                        }
                        else {
                            chan.push(newChan);
                            const arrChan = chan.filter(Boolean);
                            yield sql.updateColumn("auto", "channel", arrChan);
                            description += `${star}Channel set to <#${newChan}>!\n`;
                        }
                    }
                    if (setFreq) {
                        if (cmd.length === 10) {
                            return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"));
                        }
                        else {
                            freq.push(newFreq);
                            const arrFreq = freq.filter(Boolean);
                            yield sql.updateColumn("auto", "frequency", arrFreq);
                            description += `${star}Frequency set to **${newFreq}**!\n`;
                        }
                    }
                    if (!setCmd) {
                        if (setInit)
                            cmd = cmd.filter(Boolean);
                        cmd.push("");
                        yield sql.updateColumn("auto", "command", cmd);
                    }
                    if (!setChannel) {
                        if (setInit)
                            chan = chan.filter(Boolean);
                        chan.push("");
                        yield sql.updateColumn("auto", "command", chan);
                    }
                    if (!setFreq) {
                        if (setInit)
                            freq = freq.filter(Boolean);
                        freq.push("");
                        yield sql.updateColumn("auto", "command", freq);
                    }
                    if (setCmd && setChannel && setFreq) {
                        tog = tog.filter(Boolean);
                        tog.push("active");
                        yield sql.updateColumn("auto", "toggle", tog);
                        description += `${star}This setting is **active**!\n`;
                    }
                    else {
                        tog = tog.filter(Boolean);
                        tog.push("inactive");
                        yield sql.updateColumn("auto", "toggle", tog);
                        description += `${star}This setting is **inactive**!\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(autoPrompt);
        });
    }
}
exports.default = Auto;
//# sourceMappingURL=auto.js.map