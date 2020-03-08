import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

import * as nasa from "nasa-sdk"

export default class Nasa extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts a random picture of space.",
            help:
            `
            \`nasa\` - Posts a random picture
            \`nasa today\` - Posts the astronomy picture of the day
            \`nasa date?\` - Posts the astronomy picture of a day, YYYY-MM-DD format
            `,
            examples:
            `
            \`=>nasa\`
            \`=>nasa 2020-03-07\`
            `,
            aliases: ["space", "apod"],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)
        nasa.setNasaApiKey(process.env.NASA_API_KEY)
        const nasaEmbed = embeds.createEmbed()
        let data: any
        if (args[1] === "today") {
            data = await nasa.APOD.fetch()
        } else if (args[1]) {
            data = await nasa.APOD.fetch({date: args[1]}).catch(() => {
                return message.reply("The date must be in **YYYY-MM-DD** format!")
            })
        } else {
            const randomDate = Functions.randomDate(new Date(2015, 0, 1), new Date())
            const year = randomDate.getFullYear()
            const month = randomDate.getMonth() < 10 ? `0${randomDate.getMonth()}` : randomDate.getMonth()
            const day = randomDate.getDate() < 10 ? `0${randomDate.getDate()}` : randomDate.getDate()
            const date = `${year}-${month}-${day}`
            data = await nasa.APOD.fetch({date}).catch(() => {
                return cmd.runCommand(message, ["nasa"])
            })
        }
        if (!data) return
        const checkedMessage = Functions.checkChar(data.explanation, 1900, ".")
        nasaEmbed
        .setAuthor("nasa", "http://clipart-library.com/images/8cG66eARi.jpg")
        .setTitle(`**Nasa Picture** ${discord.getEmoji("cute")}`)
        .setURL(data.url)
        .setDescription(
        `${discord.getEmoji("star")}_Title:_ **${data.title}**\n` +
        `${discord.getEmoji("star")}_Date:_ **${Functions.formatDate(data.date)}**\n` +
        `${discord.getEmoji("star")}_Explanation:_ ${checkedMessage}\n`
        )
        .setImage(data.url)
        .setThumbnail(message.author!.displayAvatarURL())

        message.channel.send(nasaEmbed)
    }
}
