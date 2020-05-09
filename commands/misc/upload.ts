import {GuildChannel, Message, MessageAttachment, TextChannel} from "discord.js"
import fs from "fs"
import path from "path"
import {GPhotos} from "upload-gphotos"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Embeds} from "./../../structures/Embeds"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Upload extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Uploads a channels images to google images or dropbox.",
            help:
            `
            _Note: You can search up to 1000 messages back._
            \`upload\` - Uploads images in the last 300 messages.
            \`upload num\` - Specify how many messages are searched.
            \`upload id num?\` - Starts the search from this message.
            `,
            examples:
            `
            \`=>upload\`
            `,
            aliases: ["gimages", "dropbox"],
            cooldown: 3,
            guildOnly: true,
            unlist: true
        })
    }

    public uploadToAlbum = async (photos: string[], albumName: string, guildChannel: string) => {
        const discord = this.discord
        const embeds = new Embeds(discord, this.message)
        const sql = new SQLQuery(this.message)
        const notify = await sql.fetchColumn("images", "notify toggle")
        const gphotos = new GPhotos()
        await gphotos.signin({username: process.env.GOOGLE_EMAIL!, password: process.env.GOOGLE_PASSWORD!})
        const channel = this.message.guild?.channels.cache.find((c: GuildChannel) => c.id === guildChannel) as TextChannel
        let album = await gphotos.searchAlbum({title: albumName})
        if (!album) album = await gphotos.createAlbum({title: albumName})
        let notMsg: Message | null = null
        if (notify === "on") {
            notMsg = await channel.send(`Uploading images to google photos. Please be patient ${discord.getEmoji("gabCircle")}`)
        }
        for (let i = 0; i < photos.length; i++) {
            const photo = await gphotos.upload({
                stream: fs.createReadStream(photos[i]),
                size: fs.statSync(photos[i]).size,
                filename: path.basename(photos[i])
            })
            await album.append(photo)
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

    public gatherPhotos = async (guildChannel: string, max: number, before: string) => {
        const message = this.message
        const sql = new SQLQuery(message)
        const images = new Images(this.discord, message)
        const notify = await sql.fetchColumn("images", "notify toggle")
        const channel = message.guild?.channels.cache.find((c: GuildChannel) => c.id === guildChannel) as TextChannel
        const dest = path.join(__dirname, `../../../assets/images/dump/${channel.name}/`)
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, {recursive: true})
        let done = false
        let counter = 0
        let iterations = 0
        const photoArray: string[] = []
        let notMsg: Message | null = null
        let lastID: string | null = null
        while (!done) {
            if (iterations >= Math.ceil(max / 100.0)) break
            const messages = await channel.messages.fetch({limit: max < 100 ? max : 100, before}).then((c) => c.filter((m: Message) => m.attachments.size ? true : false)).then((c) => c.map((m) => m))
            lastID = messages[messages.length - 1].id
            for (let i = 0; i < messages.length; i++) {
                if (!messages[i]) {
                    done = true
                    break
                }
                const attachments = messages[i].attachments.map((a: MessageAttachment) => a.url)
                const photos = await images.downloadImages(attachments, dest)
                photoArray.push(...photos)
                counter += photos.length
                iterations++
            }
            if (notify === "on") {
                if (notMsg) {
                    await notMsg.edit(`Downloaded **${counter}** images in this channel. This will take awhile, please be patient. ${this.discord.getEmoji("gabCircle")}`)
                } else {
                    notMsg = await channel.send(`Downloaded **${counter}** images in this channel. This will take awhile, please be patient. ${this.discord.getEmoji("gabCircle")}`)
                }
            }
            await Functions.timeout(500)
        }
        if (notMsg) notMsg.delete({timeout: 3000})
        return {photos: photoArray, last: lastID}
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const sql = new SQLQuery(message)
        const channels = await sql.fetchColumn("images", "image channels")
        const folders = await sql.fetchColumn("images", "dropbox folders")
        const albums = await sql.fetchColumn("images", "google albums")
        if (!channels?.[0]) return message.reply(`You haven't configured the dropbox folder or google images album, see the command **photos** ${discord.getEmoji("kannaFacepalm")}`)
        let max = 300
        let before = message.id
        if (Number(args[1]) <= 1000) {
            max = Number(args[1])
        } else if (/\d+/.test(args[1])) {
            if (Number(args[2]) <= 1000) {
                max = Number(args[2])
            }
            before = args[1]
        }

        // const Dropbox = require('dropbox').Dropbox;
        // const fetch = require('isomorphic-fetch');

        /*let dropbox = new Dropbox({
            fetch: fetch,
            accessToken: process.env.DROPBOX_ACCESS_TOKEN
        });*/

        /*async function uploadToFolder(photos: string[], folderName: string, guildChannel: any) {
            let channel = message.guild.channels.find((c: any) => c.id === guildChannel);
            let folder = await dropbox.filesCreateFolder(`${channel.guild.name}/${folderName}`);
            let notMsg;
            if (notify === "on") {
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
            if (!albums?.[i] && !folders?.[i]) continue
            const {photos, last} = await this.gatherPhotos(channels[i], max, before)
            console.log(photos)
            if (albums?.[i]) await this.uploadToAlbum(photos, albums[i], channels[i])
            // if (folders?.[i]) await uploadToFolder(photos, folders[i], channels[i]);
        }
    }
}
