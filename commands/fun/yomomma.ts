import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class YoMomma extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gets a yo momma joke.",
            help:
            `
            \`yomomma\` - Gets a joke.
            `,
            examples:
            `
            \`=>yomomma\`
            `,
            aliases: ["yomom", "yomama"],
            random: "none",
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}

        const joke = await axios.get(`https://api.yomomma.info/`, {headers})
        const momEmbed = embeds.createEmbed()
        .setAuthor("yo momma", "https://i.imgur.com/SBZsxeM.png")
        .setTitle(`**Yo Momma Joke** ${discord.getEmoji("smugFace")}`)
        .setDescription(
        `${discord.getEmoji("star")}_Joke:_ ${joke.data.joke}\n`
        )
        return message.channel.send(momEmbed)
    }
}
