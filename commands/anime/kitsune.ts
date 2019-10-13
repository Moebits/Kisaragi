import {Message} from "discord.js"
import nekoClient, {NekoRequestResults} from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Kitsune extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Post a picture of a kitsune girl.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        let image: NekoRequestResults
        let title: string
        if (args[1] === "lewd") {
            if (!perms.checkNSFW()) return
            if (args[2] === "ero") {
                image = await neko.nsfw.eroKitsune()
                title = "Lewd Ero Kitsune"
            } else {
                image = await neko.nsfw.kitsune()
                title = "Lewd Kitsune"
            }
        } else {
            image = await neko.sfw.foxGirl()
            title = "Kitsune"
        }

        const nekoEmbed = embeds.createEmbed()
        nekoEmbed
        .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
        .setURL(image.url)
        .setTitle(`**${title}** ${discord.getEmoji("madokaLewd")}`)
        .setImage(image.url)
        message.channel.send(nekoEmbed)
    }
}
