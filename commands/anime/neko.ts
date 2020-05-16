import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import nekoClient, {NekoRequestResults} from "nekos.life"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Neko extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts images of catgirls.",
            help:
            `
            \`neko\` - Posts neko images.
            \`neko lewd\` - Posts nsfw neko images.
            \`neko gif\` - Posts a random neko gif.
            \`neko gif lewd\` - Posts a random nsfw neko gif.
            `,
            examples:
            `
            \`=>neko\`
            \`=>neko lewd\`
            `,
            aliases: ["nekos", "catgirl", "catgirls"],
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

        if (args[1]?.toLowerCase() === "gif") {
            const neko = new nekoClient()
            let image = await neko.sfw.nekoGif()
            let title = "Neko Gif"
            if (args[2] === "lewd") {
                if (!perms.checkNSFW()) return
                image = await neko.nsfw.nekoGif()
                title = "Lewd Neko Gif"
            }
            const nekoEmbed = embeds.createEmbed()
            nekoEmbed
            .setTitle(`**${title}** ${discord.getEmoji("madokaLewd")}`)
            .setImage(image.url)
            return message.channel.send(nekoEmbed)
        }

        const headers = {
            "user-agent": "Kisaragi Bot by Tenpi",
            "authorization": process.env.NEKOS_MOE_TOKEN
        }

        let nsfw = false
        if (args[1]?.toLowerCase() === "lewd") {
            if (!perms.checkNSFW()) return
            nsfw = true
        }

        const data = await axios.get(`https://nekos.moe/api/v1/random/image?count=100&nsfw=${nsfw}`, {headers}).then((r) => r.data.images)

        const nekoEmbeds: MessageEmbed[] = []
        for (let i = 0; i < data.length; i++) {
            const image = data[i]
            const nekoEmbed = embeds.createEmbed()
            nekoEmbed
            .setAuthor("nekos.moe", "https://nekos.moe/static/favicon/favicon-32x32.png", "https://nekos.moe/")
            .setTitle(`Neko Image ${discord.getEmoji("tohruSmug")}`)
            .setURL(`https://nekos.moe/post/${image.id}`)
            .setImage(`https://nekos.moe/image/${image.id}`)
            .setDescription(
                `${discord.getEmoji("star")}_Artist:_ **${image.artist}**\n` +
                `${discord.getEmoji("star")}_Likes:_ **${image.likes}**\n` +
                `${discord.getEmoji("star")}_Favorites:_ **${image.favorites}**\n` +
                `${discord.getEmoji("star")}_Uploaded:_ \`${Functions.formatDate(image.createdAt)}\`\n` +
                `${discord.getEmoji("star")}_Tags:_ ${Functions.checkChar(image.tags.join(" "), 1500, " ")}\n`
            )
            nekoEmbeds.push(nekoEmbed)
        }
        if (nekoEmbeds.length === 1) {
            message.channel.send(nekoEmbeds[0])
        } else {
            embeds.createReactionEmbed(nekoEmbeds, true, true)
        }
    }
}
