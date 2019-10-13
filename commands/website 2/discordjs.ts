import axios from "axios"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Discordjs extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches the discord.js docs.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        const srcOptions = ["master", "stable", "rpc", "commando", "akairo", "akairo-master"]
        let src = ""
        let query = Functions.combineArgs(args, 2)
        if (srcOptions.includes(args[1])) {
                src = args[1]
        } else {
                src = "master"
                query = Functions.combineArgs(args, 1)
        }
        if (!query) return message.reply("You must provide a query!")
        let result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=${src}&q=${query}`).then((r) => r.data)
        if (result.title === "Search results:") {
            result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=${src}&q=${result.description.match(/(?<=\[)(.*?)(?=\])/)[0].replace(/#/, ".")}`).then((r) => r.data)
        }
        if (!result.fields) return message.reply("Nothing was found.")
        let fields = ""
        for (let i = 0; i < result.fields.length; i++) {
            if (result.fields[i].value.startsWith("[View source]")) {
                fields += `${result.fields[i].value.replace(/View source/, "**View Source**")}\n`
            } else {
                fields += `${star}_${result.fields[i].name}:_ ${result.fields[i].value}\n`
            }
        }
        const discordjsEmbed = embeds.createEmbed()
        discordjsEmbed
        .setTitle(`**${result.author.name}** ${discord.getEmoji("gabStare")}`)
        .setURL(result.url)
        .setThumbnail(message.author!.displayAvatarURL({format: "png", dynamic: true}))
        .setAuthor(`discord.js`, "https://discord.js.org/static/logo-square.png")
        .setDescription(
        `${star}_Description:_ ${result.description.replace(/__/g, "**")}\n` +
        fields
        )
        message.channel.send(discordjsEmbed)
    }
}
