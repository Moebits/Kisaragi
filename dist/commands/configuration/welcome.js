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
const Embeds_1 = require("../../structures/Embeds");
const Images_1 = require("../../structures/Images");
const Functions_1 = require("./../../structures/Functions");
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Welcome extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const images = new Images_1.Images(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            if (yield perms.checkAdmin(message))
                return;
            const axios = require("axios");
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                welcomePrompt(message);
                return;
            }
            const welcomeEmbed = embeds.createEmbed();
            const welcomeMsg = yield sql.fetchColumn("welcome leaves", "welcome message");
            const welcomeToggle = yield sql.fetchColumn("welcome leaves", "welcome toggle");
            const welcomeChannel = yield sql.fetchColumn("welcome leaves", "welcome channel");
            const welcomeImage = yield sql.fetchColumn("welcome leaves", "welcome bg image");
            const welcomeText = yield sql.fetchColumn("welcome leaves", "welcome bg text");
            const welcomeColor = yield sql.fetchColumn("welcome leaves", "welcome bg color");
            const attachment = yield images.createCanvas(message.member, welcomeImage[0], welcomeText[0], welcomeColor[0]);
            const json = yield axios.get(`https://is.gd/create.php?format=json&url=${welcomeImage.join("")}`);
            const newImage = json.data.shorturl;
            welcomeEmbed
                .setTitle(`**Welcome Messages** ${discord.getEmoji("karenSugoi")}`)
                .setThumbnail(message.guild.iconURL())
                .attachFiles([attachment])
                .setImage(`attachment://${attachment.name ? attachment.name : "animated.gif"}`)
                .setDescription("View and edit the settings for welcome messages!\n" +
                "\n" +
                "__Text Replacements:__\n" +
                "**user** = member mention\n" +
                "**tag** = member tag\n" +
                "**name** = member name\n" +
                "**guild** = guild name\n" +
                "**count** = guild member count\n" +
                "\n" +
                "__Current Settings:__\n" +
                `${discord.getEmoji("star")}_Welcome Message:_ **${welcomeMsg}**\n` +
                `${discord.getEmoji("star")}_Welcome Channel:_ **${welcomeChannel.join("") ? `<#${welcomeChannel}>` : "None"}**\n` +
                `${discord.getEmoji("star")}_Welcome Toggle:_ **${welcomeToggle}**\n` +
                `${discord.getEmoji("star")}_Background Image:_ **${newImage}**\n` +
                `${discord.getEmoji("star")}_Background Text:_ **${welcomeText}**\n` +
                `${discord.getEmoji("star")}_Background Text Color:_ **${welcomeColor}**\n` +
                "\n" +
                "__Edit Settings:__\n" +
                `${discord.getEmoji("star")}_**Type any message** to set it as the welcome message._\n` +
                `${discord.getEmoji("star")}_Type **enable** or **disable** to enable or disable welcome messages._\n` +
                `${discord.getEmoji("star")}_**Mention a channel** to set it as the welcome channel._\n` +
                `${discord.getEmoji("star")}_Post an **image URL** (jpg, png, gif) to set the background image._\n` +
                `${discord.getEmoji("star")}_Add brackets **[text]** to set the background text._\n` +
                `${discord.getEmoji("star")}_Type **rainbow** or a **hex color** to set the background text color._\n` +
                `${discord.getEmoji("star")}_**You can type multiple options** to set them at once._\n` +
                `${discord.getEmoji("star")}_Type **reset** to reset settings._\n` +
                `${discord.getEmoji("star")}_Type **cancel** to exit._\n`);
            message.channel.send(welcomeEmbed);
            function welcomePrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    let [setMsg, setOn, setOff, setChannel, setImage, setBGText, setBGColor] = [];
                    responseEmbed.setTitle(`**Welcome Messages** ${discord.getEmoji("karenSugoi")}`);
                    const newMsg = msg.content.replace(/<#\d+>/g, "").replace(/\[(.*)\]/g, "").replace(/enable/g, "").replace(/rainbow/g, "")
                        .replace(/disable/g, "").replace(/#[0-9a-f]{3,6}/ig, "").replace(/(https?:\/\/[^\s]+)/g, "");
                    const newImg = msg.content.match(/(https?:\/\/[^\s]+)/g);
                    const newBGText = msg.content.match(/\[(.*)\]/g);
                    const newBGColor = (msg.content.match(/rainbow/g) || msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig));
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("welcome leaves", "welcome message", "Welcome to guild, user!");
                        yield sql.updateColumn("welcome leaves", "welcome channel", null);
                        yield sql.updateColumn("welcome leaves", "welcome toggle", "off");
                        yield sql.updateColumn("welcome leaves", "welcome bg image", "https://66.media.tumblr.com/692aa1fd2a5ad428d92b27ccf65d4a94/tumblr_inline_n0oiz974M41s829k0.gif");
                        yield sql.updateColumn("welcome leaves", "welcome bg text", "Welcome tag! There are now count members.");
                        yield sql.updateColumn("welcome leaves", "welcome bg color", "rainbow");
                        responseEmbed
                            .setDescription(`${discord.getEmoji("star")}Welcome settings were reset!`);
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
                    if (newImg)
                        setImage = true;
                    if (newBGText)
                        setBGText = true;
                    if (setOn && setOff) {
                        responseEmbed
                            .setDescription(`${discord.getEmoji("star")}You cannot disable/enable at the same time.`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (!setChannel && setOn) {
                        responseEmbed
                            .setDescription(`${discord.getEmoji("star")}In order to enable welcome messages, you must specify a welcome channel!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    let description = "";
                    if (setMsg) {
                        yield sql.updateColumn("welcome leaves", "welcome message", newMsg.trim());
                        description += `${discord.getEmoji("star")}Welcome message set to **${newMsg.trim()}**\n`;
                    }
                    if (setChannel) {
                        const channel = msg.guild.channels.find((c) => c === msg.mentions.channels.first());
                        yield sql.updateColumn("welcome leaves", "welcome channel", channel.id);
                        setOn = true;
                        description += `${discord.getEmoji("star")}Welcome channel set to <#${channel.id}>!\n`;
                    }
                    if (setOn) {
                        yield sql.updateColumn("welcome leaves", "welcome toggle", "on");
                        description += `${discord.getEmoji("star")}Welcome messages are **on**!\n`;
                    }
                    if (setOff) {
                        yield sql.updateColumn("welcome leaves", "welcome toggle", "off");
                        description += `${discord.getEmoji("star")}Welcome messages are **off**!\n`;
                    }
                    if (setImage) {
                        yield sql.updateColumn("welcome leaves", "welcome bg image", newImg[0]);
                        description += `${discord.getEmoji("star")}Background image set to **${newImg[0]}**!\n`;
                    }
                    if (setBGText) {
                        yield sql.updateColumn("welcome leaves", "welcome bg text", newBGText[0].replace(/\[/g, "").replace(/\]/g, ""));
                        description += `${discord.getEmoji("star")}Background text set to **${newBGText[0].replace(/\[/g, "").replace(/\]/g, "")}**\n`;
                    }
                    if (setBGColor) {
                        yield sql.updateColumn("welcome leaves", "welcome bg color", newBGColor[0].trim());
                        description += `${discord.getEmoji("star")}Background color set to **${newBGColor[0].trim()}**!\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(welcomePrompt);
        });
    }
}
exports.default = Welcome;
//# sourceMappingURL=welcome.js.map