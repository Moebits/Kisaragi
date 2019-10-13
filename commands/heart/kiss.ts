import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Kiss extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Post a kiss image",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        const image = await neko.sfw.kiss()

        const kissEmbed = embeds.createEmbed()
        kissEmbed
        .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
        .setURL(image.url)
        .setTitle(`**Kiss** ${discord.getEmoji("chinoSmug")}`)
        .setImage(image.url)
        message.channel.send(kissEmbed)
    }
}
