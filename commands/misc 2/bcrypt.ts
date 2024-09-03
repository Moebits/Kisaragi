import bcrypt from "bcrypt"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Bcrypt extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Hashes a message using the bcrypt algorithm.",
            help:
            `
            \`bcrypt text\` - Hashes the text
            `,
            examples:
            `
            \`=>bcrypt password\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const text = Functions.combineArgs(args, 1).trim()
        if (!text) return message.reply(`What do you want to hash ${discord.getEmoji("kannaCurious")}`)

        const hash = await bcrypt.hash(text, 10)
        await message.channel.send(`**Bcrypt Hash** ${discord.getEmoji("kaosWTF")}`)
        return message.channel.send(hash)
    }
}
