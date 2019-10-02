import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const urban = require("urban.js")
export default class Urban extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

        const embeds = new Embeds(discord, message)
        const urbanEmbed = embeds.createEmbed()

        if (args[1]) {
            const word = args[1]
            const result = await urban(word)
            const cleanDef = result.definition.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm, "")
            const cleanExample = result.example.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm, "")
            const checkedExample = Functions.checkChar(cleanExample, 1700, ".")
            urbanEmbed
            .setAuthor("Urban Dictionary", "https://firebounty.com/image/635-urban-dictionary")
            .setURL(result.URL)
            .setTitle(`**Urban Dictionary** ${discord.getEmoji("smugFace")}`)
            .setDescription(
            `${discord.getEmoji("star")}**Word**: ${result.word}\n` +
            `${discord.getEmoji("star")}**Author**: ${result.author ? result.author : "None"}\n` +
            `${discord.getEmoji("star")}${discord.getEmoji("up")} ${result.thumbsUp} ${discord.getEmoji("down")} ${result.thumbsDown}\n` +
            `${discord.getEmoji("star")}**Definition**: ${cleanDef ? cleanDef : "None"}\n` +
            `${discord.getEmoji("star")}**Example**: ${checkedExample ? checkedExample : "None"}`
            )
            .setThumbnail(message.author!.displayAvatarURL())
            message.channel.send(urbanEmbed)
            return
        }

        const result = await urban.random()
        const cleanDef = result.definition.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm, "")
        const cleanExample = result.example.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm, "")
        const checkedExample = Functions.checkChar(cleanExample, 1700, ".")
        urbanEmbed
            .setAuthor("Urban Dictionary", "https://firebounty.com/image/635-urban-dictionary")
            .setURL(result.URL)
            .setTitle(`**Urban Dictionary** ${discord.getEmoji("smugFace")}`)
            .setDescription(
            `${discord.getEmoji("star")}**Word**: ${result.word}\n` +
            `${discord.getEmoji("star")}**Author**: ${result.author ? result.author : "None"}\n` +
            `${discord.getEmoji("star")}${discord.getEmoji("up")} ${result.thumbsUp} ${discord.getEmoji("down")} ${result.thumbsDown}\n` +
            `${discord.getEmoji("star")}**Definition**: ${cleanDef ? cleanDef : "None"}\n` +
            `${discord.getEmoji("star")}**Example**: ${checkedExample ? checkedExample : "None"}`
            )
            .setThumbnail(message.author!.displayAvatarURL())
        message.channel.send(urbanEmbed)
    }
}
