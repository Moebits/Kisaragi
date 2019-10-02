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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_gphotos_1 = __importDefault(require("upload-gphotos"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Upload extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const channels = yield sql.fetchColumn("images", "image channels");
            // let folders = await sql.fetchColumn("images", "dropbox folders");
            const albums = yield sql.fetchColumn("images", "google albums");
            const notify = yield sql.fetchColumn("images", "notify toggle");
            if (!channels[0])
                return;
            const gphotos = new upload_gphotos_1.default({ username: process.env.GOOGLE_EMAIL, password: process.env.GOOGLE_PASSWORD });
            yield gphotos.login();
            const download = require("image-downloader");
            // const Dropbox = require('dropbox').Dropbox;
            // const fetch = require('isomorphic-fetch');
            const fs = require("fs");
            /*let dropbox = new Dropbox({
                fetch: fetch,
                accessToken: process.env.DROPBOX_ACCESS_TOKEN
            });*/
            function downloadImage(onlinePhoto, channelName) {
                return __awaiter(this, void 0, void 0, function* () {
                    const dir = `../assets/images/channels/${channelName}`;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    const { filename } = yield download.image({ url: onlinePhoto, dest: dir });
                    return filename;
                });
            }
            function gatherPhotos(guildChannel) {
                return __awaiter(this, void 0, void 0, function* () {
                    const channel = message.guild.channels.find((c) => c.id === guildChannel);
                    let done = false;
                    let counter = 0;
                    const photoArray = [];
                    while (!done) {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            let notMsg;
                            if (notify[0] === "on") {
                                notMsg = yield channel.send(`Downloaded **${counter}** images in this channel. This will take awhile, please be patient. ${discord.getEmoji("gabCircle")}`);
                            }
                            const messages = yield channel.messages.fetch({ limit: 100 }).then((c) => c.map((m) => m));
                            for (let i = 0; i < messages.length; i++) {
                                if (!messages[i]) {
                                    done = true;
                                    break;
                                }
                                if (messages[i].attachments.size) {
                                    const attachments = messages[i].attachments.map((a) => a);
                                    console.log(attachments);
                                    for (let j = 0; j < attachments.length; j++) {
                                        const photo = yield downloadImage(attachments[j].url, channel.name);
                                        photoArray.push(photo);
                                        counter++;
                                    }
                                }
                            }
                            if (notMsg)
                                yield notMsg.delete();
                        }), 30000);
                    }
                    return photoArray;
                });
            }
            function uploadToAlbum(photos, albumName, guildChannel) {
                return __awaiter(this, void 0, void 0, function* () {
                    const channel = message.guild.channels.find((c) => c.id === guildChannel);
                    const album = yield gphotos.searchOrCreateAlbum(albumName);
                    let notMsg;
                    if (notify[0] === "on") {
                        notMsg = yield channel.send(`Uploading images to google photos. Please be patient ${discord.getEmoji("gabCircle")}`);
                    }
                    for (let i = 0; i < photos.length; i++) {
                        const photo = yield gphotos.upload(photos[i]);
                        yield album.addPhoto(photo);
                    }
                    if (notMsg)
                        yield notMsg.delete();
                    const gPhotosEmbed = embeds.createEmbed();
                    gPhotosEmbed
                        .setTitle(`**Google Photos Upload** ${discord.getEmoji("gabYes")}`)
                        .setDescription(`${discord.getEmoji("star")}Uploading finished! You can find the pictures at **https://photos.google.com/share/${album.id}**!`);
                    yield channel.send(gPhotosEmbed);
                });
            }
            /*async function uploadToFolder(photos: string[], folderName: string, guildChannel: any) {
                let channel = message.guild.channels.find((c: any) => c.id === guildChannel);
                let folder = await dropbox.filesCreateFolder(`${channel.guild.name}/${folderName}`);
                let notMsg;
                if (notify[0] === "on") {
                    notMsg = await channel.send(`Uploading images to dropbox. Please be patient ${discord.getEmoji("gabCircle")}`);
                }
                for (let i = 0; i < photos.length; i++) {
                    await dropbox.filesUpload({
                        contents: photos[i],
                        path: folder.path
                    });
                }
                if (notMsg) await notMsg.delete();
                let link = await dropbox.sharingCreateSharedLink(folder.path);
                let dropboxEmbed = discord.createEmbed();
                dropboxEmbed
                .setTitle(`**Dropbox Upload** ${discord.getEmoji("gabYes")}`)
                .setDescription(
                    `${discord.getEmoji("star")}Uploading finished! You can find the pictures at **${link.url}**!`
                )
                await channel.send(dropboxEmbed);
            }*/
            for (let i = 0; i < channels.length; i++) {
                const photos = yield gatherPhotos(channels[0][i]);
                if (albums[0][i])
                    yield uploadToAlbum(photos, albums[0][i], channels[0][i]);
                // if (folders[0][i]) await uploadToFolder(photos, folders[0][i], channels[0][i]);
            }
        });
    }
}
exports.default = Upload;
//# sourceMappingURL=upload.js.map