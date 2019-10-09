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
const Images_1 = require("./../../structures/Images");
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Leave extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const images = new Images_1.Images(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const star = discord.getEmoji("star");
            if (yield perms.checkAdmin(message))
                return;
            const axios = require("axios");
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                leavePrompt(message);
                return;
            }
            const leaveEmbed = embeds.createEmbed();
            const leaveMsg = yield sql.fetchColumn("welcome leaves", "leave message");
            const leaveToggle = yield sql.fetchColumn("welcome leaves", "leave toggle");
            const leaveChannel = yield sql.fetchColumn("welcome leaves", "leave channel");
            const leaveImage = yield sql.fetchColumn("welcome leaves", "leave bg image");
            const leaveText = yield sql.fetchColumn("welcome leaves", "leave bg text");
            const leaveColor = yield sql.fetchColumn("welcome leaves", "leave bg color");
            const attachment = yield images.createCanvas(message.member, leaveImage[0], leaveText[0], leaveColor[0]);
            const json = yield axios.get(`https://is.gd/create.php?format=json&url=${leaveImage.join("")}`);
            const newImg = json.data.shorturl;
            console.log(attachment);
            leaveEmbed
                .setTitle(`**Leave Messages** ${discord.getEmoji("sagiriBleh")}`)
                .setThumbnail(message.guild.iconURL())
                .attachFiles([attachment])
                .setImage(`attachment://${attachment.name ? attachment.name : "animated.gif"}`)
                .setDescription("View and edit the settings for leave messages!\n" +
                "\n" +
                "__Text Replacements:__\n" +
                "**user** = member mention\n" +
                "**tag** = member tag\n" +
                "**name** = member name\n" +
                "**guild** = guild name\n" +
                "**count** = guild member count\n" +
                "\n" +
                "__Current Settings:__\n" +
                `${star}_Leave Message:_ **${leaveMsg}**\n` +
                `${star}_Leave Channel:_ **${leaveChannel.join("") ? `<#${leaveChannel}>` : "None"}**\n` +
                `${star}_Leave Toggle:_ **${leaveToggle}**\n` +
                `${star}_Background Image:_ **${newImg}**\n` +
                `${star}_Background Text:_ **${leaveText}**\n` +
                `${star}_Background Text Color:_ **${leaveColor}**\n` +
                "\n" +
                "__Edit Settings:__\n" +
                `${star}_**Type any message** to set it as the leave message._\n` +
                `${star}_Type **enable** or **disable** to enable or disable leave messages._\n` +
                `${star}_**Mention a channel** to set it as the leave channel._\n` +
                `${star}_Post an **image URL** (jpg, png, gif) to set the background image._\n` +
                `${star}_Add brackets **[text]** to set the background text._\n` +
                `${star}_Type **rainbow** or a **hex color** to set the background text color._\n` +
                `${star}_**You can type multiple options** to set them at once._\n` +
                `${star}_Type **reset** to reset settings._\n` +
                `${star}_Type **cancel** to exit._\n`);
            message.channel.send(leaveEmbed);
            function leavePrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    let setMsg, setOn, setOff, setChannel, setImage, setBGText, setBGColor;
                    responseEmbed.setTitle(`**Leave Messages** ${discord.getEmoji("sagiriBleh")}`);
                    const newMsg = msg.content.replace(/<#\d+>/g, "").replace(/\[(.*)\]/g, "").replace(/enable/g, "").replace(/rainbow/g, "")
                        .replace(/disable/g, "").replace(/#[0-9a-f]{3,6}/ig, "").replace(/(https?:\/\/[^\s]+)/g, "");
                    const newImage = msg.content.match(/(https?:\/\/[^\s]+)/g);
                    const newBGText = msg.content.match(/\[(.*)\]/g);
                    const newBGColor = (msg.content.match(/rainbow/g) || msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig));
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("welcome leaves", "leave message", "user has left guild!");
                        yield sql.updateColumn("welcome leaves", "leave channel", null);
                        yield sql.updateColumn("welcome leaves", "leave toggle", "off");
                        yield sql.updateColumn("welcome leaves", "leave bg image", "https://data.whicdn.com/images/210153523/original.gif");
                        yield sql.updateColumn("welcome leaves", "leave bg text", "tag left! There are now count members.");
                        yield sql.updateColumn("welcome leaves", "leave bg color", "rainbow");
                        responseEmbed
                            .setDescription(`${star}Leave settings were reset!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (newBGColor)
                        setBGColor = true;
                    if (newMsg.trim())
                        setMsg = true;
                    if (msg.content.toLowerCase().includes("enable"))
                        setOn = true;
                    if (msg.content.toLowerCase() === "disable")
                        setOff = true;
                    if (msg.mentions.channels.array().join(""))
                        setChannel = true;
                    if (newImage)
                        setImage = true;
                    if (newBGText)
                        setBGText = true;
                    if (setOn && setOff) {
                        responseEmbed
                            .setDescription(`${star}You cannot disable/enable at the same time.`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (!setChannel && setOn) {
                        responseEmbed
                            .setDescription(`${star}In order to enable leave messages, you must specify a leave channel!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    let description = "";
                    if (setMsg) {
                        yield sql.updateColumn("welcome leaves", "leave message", newMsg.trim());
                        description += `${star}Leave Message set to **${newMsg.trim()}**\n`;
                    }
                    if (setChannel) {
                        const channel = msg.guild.channels.find((c) => c === msg.mentions.channels.first());
                        yield sql.updateColumn("welcome leaves", "leave channel", channel.id);
                        setOn = true;
                        description += `${star}Leave channel set to <#${channel.id}>!\n`;
                    }
                    if (setOn) {
                        yield sql.updateColumn("welcome leaves", "leave toggle", "on");
                        description += `${star}Leave Messages are **on**!\n`;
                    }
                    if (setOff) {
                        yield sql.updateColumn("welcome leaves", "leave toggle", "off");
                        description += `${star}Leave Messages are **off**!\n`;
                    }
                    if (setImage) {
                        yield sql.updateColumn("welcome leaves", "leave bg image", newImage[0]);
                        description += `${star}Background image set to **${newImage[0]}**!\n`;
                    }
                    if (setBGText) {
                        yield sql.updateColumn("welcome leaves", "leave bg text", newBGText[0].replace(/\[/g, "").replace(/\]/g, ""));
                        description += `${star}Background text set to **${newBGText[0].replace(/\[/g, "").replace(/\]/g, "")}**\n`;
                    }
                    if (setBGColor) {
                        yield sql.updateColumn("welcome leaves", "leave bg color", newBGColor[0]);
                        description += `${star}Background color set to **${newBGColor[0]}**!\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(leavePrompt);
        });
    }
}
exports.default = Leave;
//# sourceMappingURL=leave.js.map