import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pat extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Post a pat image",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        const image = await neko.sfw.pat()

        const patEmbed = embeds.createEmbed()
        patEmbed
        .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
        .setURL(image.url)
        .setTitle(`**Pat** ${discord.getEmoji("chinoSmug")}`)
        .setImage(image.url)
        message.channel.send(patEmbed)
    }
}
