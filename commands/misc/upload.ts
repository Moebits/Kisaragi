import {GuildChannel, Message, MessageAttachment, TextChannel} from "discord.js"
import GPhotos from "upload-gphotos"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Upload extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Upload a channels images to google images or dropbox.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        const channels = await sql.fetchColumn("images", "image channels")
        // let folders = await sql.fetchColumn("images", "dropbox folders");
        const albums = await sql.fetchColumn("images", "google albums")
        const notify = await sql.fetchColumn("images", "notify toggle")

        if (!channels[0]) return

        const gphotos = new GPhotos({username: process.env.GOOGLE_EMAIL, password: process.env.GOOGLE_PASSWORD})
        await gphotos.login()
        const download = require("image-downloader")
        // const Dropbox = require('dropbox').Dropbox;
        // const fetch = require('isomorphic-fetch');
        const fs = require("fs")

        /*let dropbox = new Dropbox({
            fetch: fetch,
            accessToken: process.env.DROPBOX_ACCESS_TOKEN
        });*/

        async function downloadImage(onlinePhoto: string, channelName: string) {
            const dir = `../assets/images/channels/${channelName}`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            const {filename} = await download.image({url: onlinePhoto, dest: dir})
            return filename
        }

        async function gatherPhotos(guildChannel: string) {
            const channel = message.guild!.channels.find((c: GuildChannel) => c.id === guildChannel) as TextChannel
            let done = false
            let counter = 0
            const photoArray: string[] = []
            while (!done) {
                setTimeout(async () => {
                    let notMsg
                    if (notify[0] === "on") {
                        notMsg = await channel.send(`Downloaded **${counter}** images in this channel. This will take awhile, please be patient. ${discord.getEmoji("gabCircle")}`)
                    }
                    const messages = await channel.messages.fetch({limit: 100}).then((c) => c.map((m: Message) => m))
                    for (let i = 0; i < messages.length; i++) {
                        if (!messages[i]) {
                            done = true
                            break
                        }
                        if (messages[i].attachments.size) {
                            const attachments = messages[i].attachments.map((a: MessageAttachment) => a)
                            console.log(attachments)
                            for (let j = 0; j < attachments.length; j++) {
                                const photo = await downloadImage(attachments[j].url, channel.name)
                                photoArray.push(photo)
                                counter++
                            }
                        }
                    }
                    if (notMsg) await notMsg.delete()
                }, 30000)
            }
            return photoArray
        }

        async function uploadToAlbum(photos: string[], albumName: string, guildChannel: string) {
            const channel = message.guild!.channels.find((c: GuildChannel) => c.id === guildChannel) as TextChannel
            const album = await gphotos.searchOrCreateAlbum(albumName)
            let notMsg
            if (notify[0] === "on") {
                notMsg = await channel.send(`Uploading images to google photos. Please be patient ${discord.getEmoji("gabCircle")}`)
            }
            for (let i = 0; i < photos.length; i++) {
                const photo = await gphotos.upload(photos[i])
                await album.addPhoto(photo)
            }
            if (notMsg) await notMsg.delete()
            const gPhotosEmbed = embeds.createEmbed()
            gPhotosEmbed
            .setTitle(`**Google Photos Upload** ${discord.getEmoji("gabYes")}`)
            .setDescription(
                `${discord.getEmoji("star")}Uploading finished! You can find the pictures at **https://photos.google.com/share/${album.id}**!`
            )
            await channel.send(gPhotosEmbed)
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
            const photos = await gatherPhotos(channels[0][i])
            if (albums[0][i]) await uploadToAlbum(photos, albums[0][i], channels[0][i])
            // if (folders[0][i]) await uploadToFolder(photos, folders[0][i], channels[0][i]);
        }
    }
}
