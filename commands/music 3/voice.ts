import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Voice extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Toggles command voice recognition on or off.",
            help:
            `
            _Note: When you speak in a voice channel with the bot, you can trigger commands with your voice._
            \`voice\` - Toggles voice recognition on or off
            `,
            examples:
            `
            \`=>voice\`
            `,
            aliases: ["voicerecognition"],
            guildOnly: true,
            cooldown: 20
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)

        const voice = await sql.fetchColumn("config", "voice")
        if (!voice || voice === "off") {
            let voiceChannel = message.guild?.voice?.channel!
            let connection = message.guild?.voice?.connection!

            if (!connection && message.member?.voice.channel) {
                voiceChannel = message.member.voice.channel
                connection = await message.member.voice.channel.join()
            } else if (!message.member?.voice.channel) {
                return message.reply(`You must join a voice channel first. How do you want the bot to hear you ${discord.getEmoji("kannaFacepalm")}`)
            }
            connection.play(Functions.silence(), {type: "opus"})
            await sql.updateColumn("config", "voice", "on")
            return message.reply(`Voice recognition was turned **on**! It's recommended to use **push to talk**. Try saying **hi** or **hello**! ${discord.getEmoji("aquaUp")}`)
        } else {
            await sql.updateColumn("config", "voice", "off")
            return message.reply(`Voice recognition was turned **off**! ${discord.getEmoji("mexShrug")}`)
        }
    }
}
