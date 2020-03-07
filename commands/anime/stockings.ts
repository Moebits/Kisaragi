import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Stockings extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts pictures of anime girls wearing stockings.",
            help:
            `
            \`stockings\` - Sends pictures of anime girls in stockings.
            `,
            examples:
            `
            \`=>stockings\`
            `,
            aliases: ["leggings", "tights"],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const imageArray: MessageEmbed[] = []

        if (args[1] === "lewd") {
            const links = await images.parseImgurAlbum("RuDYpXQ", 10)
            for (let i = 0; i < links.length; i++) {
                const imageEmbed = embeds.createEmbed()
                imageEmbed
                .setTitle(`**Stockings Lewd** ${discord.getEmoji("madokaLewd")}`)
                .setURL(links[i])
                .setImage(links[i])
                imageArray.push(imageEmbed)
            }
            return embeds.createReactionEmbed(imageArray)
        }

        const links = await images.parseImgurAlbum("f4s1dt0", 10)
        for (let i = 0; i < links.length; i++) {
            const imageEmbed = embeds.createEmbed()
            imageEmbed
            .setTitle(`**Stockings** ${discord.getEmoji("gabrielLick")}`)
            .setURL(links[i])
            .setImage(links[i])
            imageArray.push(imageEmbed)
        }
        return embeds.createReactionEmbed(imageArray)
    }
}
