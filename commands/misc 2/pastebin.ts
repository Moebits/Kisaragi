import {Message} from "discord.js"
import fs from "fs"
import path from "path"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pastebin extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Uploads a message or text file to pastebin.",
            help:
            `
            \`pastebin [title]? text?\` - Uploads the text, or the last uploaded text file
            \`pastebin public [title]? text?\` - By default, the privacy is unlisted, but this makes it public
            `,
            examples:
            `
            \`=>pastebin [some code]\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        let privacy = 1
        if (args[1].toLowerCase() === "public") {
            privacy = 0
            args.shift()
        }
        const input = Functions.combineArgs(args, 1).trim()
        let title = input.match(/(?<=^\[)(.*?)(?=\])/)?.[0] ?? ""
        let content = input.replace(/(^\[)(.*?)(\])/, "").trim()
        let user = message.author
        if (!content) {
            const {image, author} = await discord.fetchLastAttachment(message, true, /.(txt|ts|js|json|py|html|css|less|scss|tsx|jsx|c|cs|cpp|java|xml)/)
            if (image) {
                const ext = path.extname(image).replace(".", "")
                let dest = path.resolve(__dirname, `../../../assets/misc/dump/pastebin.${ext}`)
                let i = 1
                while (fs.existsSync(dest)) {
                    dest =  path.resolve(__dirname, `../../../assets/misc/dump/pastebin${i}.${ext}`)
                    i++
                }
                await images.download(image, dest)
                if (author) user = author
                content = fs.readFileSync(dest, "utf8")
            }
        }
        if (!content) return message.reply(`What do you want to post on pastebin ${discord.getEmoji("kannaFacepalm")}`)
        if (!title) title = `Paste from ${user.tag}`
        const link = await images.pastebinUpload(title, content, privacy)
        if (!link.startsWith("http")) return message.reply(`Something went wrong ${discord.getEmoji("kannaFacepalm")}`)

        const pastebinEmbed = embeds.createEmbed()
        pastebinEmbed
        .setAuthor("pastebin", "https://upload.wikimedia.org/wikipedia/en/3/35/Pastebin.com_logo.png", "https://pastebin.com/")
        .setTitle(`**Pastebin Upload** ${discord.getEmoji("raphi")}`)
        .setURL(link)
        .setDescription(`${discord.getEmoji("star")}Successfully uploaded to pastebin, find your paste [**here**](${link})`)
        return message.channel.send(pastebinEmbed)
    }
}
