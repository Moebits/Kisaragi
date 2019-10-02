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
const Functions_1 = require("./../../structures/Functions");
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Photos extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            if (yield perms.checkAdmin(message))
                return;
            const star = discord.getEmoji("star");
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                photoPrompt(message);
                return;
            }
            let channels = yield sql.fetchColumn("images", "image channels");
            let folders = yield sql.fetchColumn("images", "dropbox folders");
            let albums = yield sql.fetchColumn("images", "google albums");
            const notify = yield sql.fetchColumn("images", "notify toggle");
            const step = 3.0;
            const increment = Math.ceil((channels[0] ? channels[0].length : 1) / step);
            const photosArray = [];
            for (let i = 0; i < increment; i++) {
                let description = "";
                for (let j = 0; j < step; j++) {
                    if (channels[0] || folders[0] || albums[0]) {
                        const value = (i * step) + j;
                        if (!channels[0][value])
                            break;
                        description += `**${value + 1} =>**\n` +
                            `${star}Channel: ${channels[0] ? (channels[0][value] ? `<#${channels[0][value]}>` : "None") : "None"}\n` +
                            `${star}Dropbox Folder: **${folders[0] ? (folders[0][value] ? folders[0][value] : "None") : "None"}**\n` +
                            `${star}Google Album: **${albums[0] ? (albums[0][value] ? albums[0][value] : "None") : "None"}**\n`;
                    }
                    else {
                        description = "";
                    }
                }
                const photoEmbed = embeds.createEmbed();
                photoEmbed
                    .setTitle(`**Photo Downloader/Uploader** ${discord.getEmoji("gabYes")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setImage("https://i.imgur.com/AtAIFOb.png")
                    .setDescription("Automatically download and upload photos from a channel to dropbox/google photos!\n" +
                    "\n" +
                    "**Upload Notify** = Whether you will be notified whenever a photo is uploaded.\n" +
                    "\n" +
                    "__Current Settings__\n" +
                    `${star}Upload notify is set to **${notify.join("")}**!\n` +
                    description +
                    "\n" +
                    "__Edit Settings__\n" +
                    `${star}**Mention a channel** to set the channel.\n` +
                    `${star}**Type a name** to set the google album name.\n` +
                    `${star}**Use brackets [name]** to set the dropbox folder name.\n` +
                    `${star}Type **edit (setting number)** to edit a setting.\n` +
                    `${star}Type **delete (setting number)** to delete a setting.\n` +
                    `${star}Type **reset** to delete all settings.\n` +
                    `${star}Type **cancel** to exit.\n`);
                photosArray.push(photoEmbed);
            }
            if (photosArray.length > 1) {
                embeds.createReactionEmbed(photosArray);
            }
            else {
                message.channel.send(photosArray[0]);
            }
            function photoPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    responseEmbed.setTitle(`**Photo Downloader/Uploader** ${discord.getEmoji("gabYes")}`);
                    let setChannel, setFolder, setAlbum, setNotify, setInit;
                    if (!channels[0])
                        channels = [""];
                    setInit = true;
                    if (!folders[0])
                        folders = [""];
                    setInit = true;
                    if (!albums[0])
                        albums = [""];
                    setInit = true;
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("images", "image channels", null);
                        yield sql.updateColumn("images", "dropbox folders", null);
                        yield sql.updateColumn("images", "google albums", null);
                        yield sql.updateColumn("images", "notify toggle", "on");
                        responseEmbed
                            .setDescription(`${star}All settings were **reset**!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase().startsWith("delete")) {
                        const newMsg = Number(msg.content.replace(/delete/g, "").trim());
                        const num = newMsg - 1;
                        if (newMsg) {
                            channels[num] = "";
                            albums[num] = "";
                            folders[num] = "";
                            channels = channels.filter(Boolean);
                            albums = albums.filter(Boolean);
                            folders = folders.filter(Boolean);
                            yield sql.updateColumn("images", "image channels", channels);
                            yield sql.updateColumn("images", "google albums", albums);
                            yield sql.updateColumn("images", "dropbox folders", folders);
                            return msg.channel.send(responseEmbed.setDescription(`Setting **${newMsg}** was deleted!`));
                        }
                        else {
                            return msg.channel.send(responseEmbed.setDescription("Setting not found!"));
                        }
                    }
                    if (msg.content.toLowerCase().startsWith("edit")) {
                        const newMsg = msg.content.replace(/edit/g, "").trim().split(" ");
                        const tempMsg = newMsg.slice(1).join(" ");
                        const num = Number(newMsg[0]) - 1;
                        if (tempMsg) {
                            const tempChan = tempMsg.match(/\d+/g);
                            const tempFolder = tempMsg.replace(/\d+/g, "").replace(/<#/g, "").replace(/>/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "")
                                .replace(/\[/g, "").replace(/\]/g, "").replace(/notify/g, "").replace(/\s+/g, " ").trim();
                            const tempAlbum = tempMsg.match(/(?<=\[)(.*?)(?=\])/g);
                            let editDesc = "";
                            if (tempChan) {
                                channels[num] = tempChan;
                                yield sql.updateColumn("images", "image channels", channels);
                                editDesc += `${star}Channel set to **${tempChan}**!\n`;
                            }
                            if (tempFolder) {
                                folders[num] = tempFolder;
                                yield sql.updateColumn("images", "dropbox folders", folders);
                                editDesc += `${star}Dropbox folder set to **${tempFolder}**!\n`;
                            }
                            if (tempAlbum) {
                                albums[num] = tempAlbum;
                                yield sql.updateColumn("images", "google albums", albums);
                                editDesc += `${star}Google album set to **${tempAlbum}**!\n`;
                            }
                            return msg.channel.send(responseEmbed.setDescription(editDesc));
                        }
                        else {
                            return msg.channel.send(responseEmbed.setDescription("No edits specified!"));
                        }
                    }
                    const newChan = msg.content.match(/\d+/g);
                    const newFolder = msg.content.replace(/\d+/g, "").replace(/<#/g, "").replace(/>/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "")
                        .replace(/\[/g, "").replace(/\]/g, "").replace(/notify/g, "").replace(/\s+/g, " ").trim();
                    const newAlbum = msg.content.match(/(?<=\[)(.*?)(?=\])/g);
                    if (msg.content.match(/notify/gi))
                        setNotify = true;
                    if (newChan)
                        setChannel = true;
                    if (newFolder)
                        setFolder = true;
                    if (newAlbum)
                        setAlbum = true;
                    let description = "";
                    if (setChannel) {
                        channels.push(newChan);
                        if (setInit)
                            channels = channels.filter(Boolean);
                        yield sql.updateColumn("images", "image channels", channels);
                        description += `${star}Channel set to <#${newChan}>!\n`;
                    }
                    if (setFolder) {
                        folders.push(newFolder);
                        if (setInit)
                            folders = folders.filter(Boolean);
                        yield sql.updateColumn("images", "dropbox folders", folders);
                        description += `${star}Dropbox folder set to **${newFolder}**!\n`;
                    }
                    if (setAlbum) {
                        albums.push(newAlbum);
                        if (setInit)
                            albums = albums.filter(Boolean);
                        yield sql.updateColumn("images", "google albums", albums);
                        description += `${star}Google album set to **${newAlbum}**!\n`;
                    }
                    if (setNotify) {
                        if (notify.join("") === "on") {
                            yield sql.updateColumn("images", "notify toggle", "off");
                            description += `${star}Upload notify is **off**!\n`;
                        }
                        else {
                            yield sql.updateColumn("images", "notify toggle", "on");
                            description += `${star}Upload notify is **on**!\n`;
                        }
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(photoPrompt);
        });
    }
}
exports.default = Photos;
//# sourceMappingURL=photos.js.map