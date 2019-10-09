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
class ChannelLink extends Command_1.Command {
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
                linkPrompt(message);
                return;
            }
            const linkText = yield sql.fetchColumn("links", "text");
            const linkVoice = yield sql.fetchColumn("links", "voice");
            const linkToggle = yield sql.fetchColumn("links", "toggle");
            let linkDescription = "";
            if (linkText[0]) {
                for (let i = 0; i < linkText[0].length; i++) {
                    linkDescription += `**${i + 1} => **\n` + `${star}_Text:_ <#${linkText[0][i]}>\n` +
                        `${star}_Voice:_ **<#${linkVoice[0][i]}>**\n` +
                        `${star}_State:_ **${linkToggle[0][i]}**\n`;
                }
            }
            else {
                linkDescription = "None";
            }
            const linkEmbed = embeds.createEmbed();
            linkEmbed
                .setTitle(`**Linked Channels** ${discord.getEmoji("gabSip")}`)
                .setThumbnail(message.guild.iconURL())
                .setDescription("Configure settings for linked channels. You can link a text channel to a voice channel so that only people in the voice channel can access it.\n" +
                "In order for this to work, you should disable the **read messages** permission on the text channel for all member roles.\n" +
                "\n" +
                "**Status** = Either on or off. In order for the status to be on, both the voice and text channel must be set.\n" +
                "\n" +
                "__Current Settings:__\n" +
                linkDescription + "\n" +
                "\n" +
                "__Edit Settings:__\n" +
                `${star}_**Mention a text channel** to set the text channel._\n` +
                `${star}_**Type the name of the voice channel** to set the voice channel._\n` +
                `${star}_Type **toggle (setting number)** to toggle the status._\n` +
                `${star}_Type **edit (setting number)** to edit a setting._\n` +
                `${star}_Type **delete (setting number)** to delete a setting._\n` +
                `${star}_Type **reset** to delete all settings._\n` +
                `${star}_Type **cancel** to exit._\n`);
            message.channel.send(linkEmbed);
            function linkPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    let text = yield sql.fetchColumn("links", "text");
                    let voice = yield sql.fetchColumn("links", "voice");
                    let toggle = yield sql.fetchColumn("links", "toggle");
                    let [setText, setVoice, setInit] = [];
                    if (!text[0])
                        text = [""];
                    setInit = true;
                    if (!voice[0])
                        voice = [""];
                    setInit = true;
                    if (!toggle[0])
                        toggle = [""];
                    setInit = true;
                    const responseEmbed = embeds.createEmbed();
                    responseEmbed.setTitle(`**Linked Channels** ${discord.getEmoji("gabSip")}`);
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("links", "voice", null);
                        yield sql.updateColumn("links", "text", null);
                        yield sql.updateColumn("links", "toggle", "off");
                        responseEmbed
                            .setDescription(`${star}All settings were reset!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase().includes("delete")) {
                        const num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""));
                        if (num) {
                            if (text[0]) {
                                text[num - 1] = "";
                                voice[num - 1] = "";
                                toggle[num - 1] = "";
                                text = text.filter(Boolean);
                                voice = voice.filter(Boolean);
                                toggle = toggle.filter(Boolean);
                                yield sql.updateColumn("links", "text", text);
                                yield sql.updateColumn("links", "voice", voice);
                                yield sql.updateColumn("links", "toggle", toggle);
                                responseEmbed
                                    .setDescription(`${star}Setting ${num} was deleted!`);
                                msg.channel.send(responseEmbed);
                                return;
                            }
                        }
                        else {
                            responseEmbed
                                .setDescription(`${star}Setting not found!`);
                            msg.channel.send(responseEmbed);
                            return;
                        }
                    }
                    const newText = msg.content.match(/<#\d+>/g);
                    const newVoice = msg.content.replace(/<#\d+>/g, "").match(/\D+/gi);
                    if (newText)
                        setText = true;
                    if (newVoice)
                        setVoice = true;
                    let description = "";
                    if (setText) {
                        text.push(newText[0].replace(/<#/g, "").replace(/>/g, ""));
                        if (setInit)
                            text = text.filter(Boolean);
                        yield sql.updateColumn("links", "text", text);
                        description += `${star}Text channel set to **${newText[0]}**!\n`;
                    }
                    if (setVoice) {
                        const channels = msg.guild.channels.filter((c) => {
                            const type = c.type === "voice" ? true : false;
                            return type;
                        });
                        const channel = channels.find((c) => {
                            const name = (c.name.replace(/\s+/g, " ").toLowerCase().includes(newVoice[0].toLowerCase())) ? true : false;
                            return name;
                        });
                        if (channel) {
                            voice.push(channel.id);
                            if (setInit)
                                voice = voice.filter(Boolean);
                            yield sql.updateColumn("links", "voice", voice);
                            description += `${star}Voice channel set to **${channel.name}**!\n`;
                        }
                        else {
                            return msg.channel.send(responseEmbed.setDescription("Voice channel not found!"));
                        }
                    }
                    if (setText && setVoice) {
                        toggle.push("on");
                        if (setInit)
                            toggle = toggle.filter(Boolean);
                        yield sql.updateColumn("links", "toggle", toggle);
                        description += `${star}Status set to **on**!\n`;
                    }
                    else {
                        toggle.push("off");
                        if (setInit)
                            toggle = toggle.filter(Boolean);
                        yield sql.updateColumn("links", "toggle", toggle);
                        description += `${star}Status set to **off**!\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(linkPrompt);
        });
    }
}
exports.default = ChannelLink;
//# sourceMappingURL=link.js.map