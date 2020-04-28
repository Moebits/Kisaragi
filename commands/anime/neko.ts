import {Message} from "discord.js"
import nekoClient, {NekoRequestResults} from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Neko extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts an image of a neko girl.",
            help:
            `
            \`neko\` - Posts a random neko image.
            \`neko gif\` - Posts a random neko gif.
            \`neko lewd\` - Posts a random nsfw neko image.
            \`neko lewd gif\` - Posts a random nsfw neko gif.
            \`=>neko lewd gif\`
            \`=>neko lewd\`
            `,
            examples:
            `
            \`=>neko\`
            `,
            aliases: ["catgirl"],
            random: "none",
            cooldown: 10,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const neko = new nekoClient()
        if (discord.checkMuted(message)) if (!perms.checkBotDev()) return

        let image: NekoRequestResults
        let title: string
        if (args[1] === "gif") {
            image = await neko.sfw.nekoGif()
            title = "Neko Gif"
        } else if (args[1] === "lewd") {
            if (!perms.checkNSFW()) return
            if (args[2] === "gif") {
                image = await neko.nsfw.nekoGif()
                title = "Lewd Neko Gif"
            } else {
                image = await neko.nsfw.neko()
                title = "Lewd Neko"
            }
        } else {
            image = await neko.sfw.neko()
            title = "Neko"
        }

        const nekoEmbed = embeds.createEmbed()
        nekoEmbed
        .setTitle(`**${title}** ${discord.getEmoji("madokaLewd")}`)
        .setImage(image.url)
        message.channel.send(nekoEmbed)
    }
}
