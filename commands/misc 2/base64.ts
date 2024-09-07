import {Message} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Base64 as base64} from "js-base64"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class MD5 extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Encodes or decodes a message using the base64 algorithm.",
            help:
            `
            \`base64 text\` - Encodes or decodes the text
            `,
            examples:
            `
            \`=>base64 some message\`
            `,
            aliases: ["b64"],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const text = Functions.combineArgs(args, 1).trim()
        if (!text) return message.reply(`What do you want to encode/decode ${discord.getEmoji("kannaCurious")}`)
        let result = ""

        if (text.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/gm)) {
            result = base64.decode(text)
        } else {
            result = base64.encode(text)
        }

        await message.channel.send(`**Base64 Conversion** ${discord.getEmoji("tohruThink")}`)
        return message.channel.send(result)
    }
}
