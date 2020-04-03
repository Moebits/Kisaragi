import {Message} from "discord.js"
import md5 from "md5"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class MD5 extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Hashes a message using the md5 algorithm.",
            help:
            `
            \`md5 text\` - Hashes the text
            `,
            examples:
            `
            \`=>md5 secret password\`
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

        const hash = md5(text)
        await message.channel.send(`**MD5 Hash** ${discord.getEmoji("kannaCurious")}`)
        return message.channel.send(hash)
    }
}
