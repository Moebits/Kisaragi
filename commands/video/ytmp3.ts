import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {CommandFunctions} from "../../structures/CommandFunctions"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Images} from "../../structures/Images"
import {Kisaragi} from "../../structures/Kisaragi"
import {Video} from "../../structures/Video"

export default class YtMp3 extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Short alias for youtube download mp3.",
            help:
            `
            \`ytmp3 url/query\` - Downloads the video mp3
            `,
            examples:
            `
            \`=>ytmp3 https://youtu.be/mLJQ0HO5Alc\`
            `,
            aliases: ["youtube download"],
            cooldown: 20,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const video = new Video(discord, message)
        const cmd = new CommandFunctions(discord, message)
        const perms = new Permission(discord, message)
        if (!args[1]) return message.reply(`What video do you want to download ${discord.getEmoji("kannaCurious")}`)
        if (args[1].toLowerCase() === "mp3") {
            return cmd.runCommand(message, ["youtube", "download", "mp3", Functions.combineArgs(args, 2)])
        } else {
            return cmd.runCommand(message, ["youtube", "download", "mp3", Functions.combineArgs(args, 1)])
        }
    }
}
