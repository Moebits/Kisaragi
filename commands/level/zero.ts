import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Points} from "../../structures/Points"

export default class Zero extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Resets your points back to zero (no undo).",
            help:
            `
            \`zero\` - Resets your points
            `,
            examples:
            `
            \`=>zero\`
            `,
            aliases: ["resetpoints", "pointreset"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const points = new Points(discord, message)
        try {
            await points.zero(message.author.id)
        } catch {
            return message.reply(`This server has no scores ${discord.getEmoji("kannaFacepalm")}`)
        }

        const zeroEmbed = embeds.createEmbed()
        zeroEmbed
        .setAuthor("zero", "https://image.flaticon.com/icons/png/512/594/594712.png")
        .setTitle(`**Point Reset** ${discord.getEmoji("kaosWTF")}`)
        .setDescription(
            `${discord.getEmoji("star")}Your points were reset back to **0**!`
        )
        return message.channel.send(zeroEmbed)
    }
}
