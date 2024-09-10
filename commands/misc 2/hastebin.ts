import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import fs from "fs"
import path from "path"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Hastebin extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Uploads a message or text file to hastebin.",
            help:
            `
            \`hastebin text?\` - Uploads the text, or the last uploaded text file
            `,
            examples:
            `
            \`=>hastebin insert code\`
            `,
            aliases: [],
            cooldown: 3,
            subcommandEnabled: true
        })
        const textOption = new SlashCommandOption()
            .setType("string")
            .setName("text")
            .setDescription("The text to upload, or use last posted text file.")
            
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(textOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        let content = Functions.combineArgs(args, 1).trim()
        if (!content) {
            const textFile = await discord.fetchLastAttachment(message, false, /.(txt|ts|js|json|py|html|css|less|scss|tsx|jsx|c|cs|cpp|java|xml)/)
            if (textFile) {
                const ext = path.extname(textFile).replace(".", "")
                let dest = path.resolve(__dirname, `../../assets/misc/dump/hastebin.${ext}`)
                let i = 1
                while (fs.existsSync(dest)) {
                    dest =  path.resolve(__dirname, `../../assets/misc/dump/hastebin${i}.${ext}`)
                    i++
                }
                await images.download(textFile, dest)
                content = fs.readFileSync(dest, "utf8")
            }
        }
        if (!content) return message.reply(`What do you want to post on hastebin ${discord.getEmoji("kannaFacepalm")}`)
        const link = await images.hastebinUpload(content).catch(() => {
            return message.reply(`Something went wrong ${discord.getEmoji("kannaFacepalm")}`)
        }) as string
        const hastebinEmbed = embeds.createEmbed()
        hastebinEmbed
        .setAuthor({name: "hastebin", iconURL: "https://d2.alternativeto.net/dist/icons/hastebin_91073.png?width=200&height=200&mode=crop&upscale=false", url: "https://hastebin.com/"})
        .setTitle(`**Hastebin Upload** ${discord.getEmoji("mexShrug")}`)
        .setURL(link)
        .setDescription(`${discord.getEmoji("star")}Successfully uploaded to hastebin, the link is [**here**](${link})`)
        return message.channel.send({embeds: [hastebinEmbed]})
    }
}
