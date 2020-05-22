import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Kiss extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Kisses someone.",
            help:
            `
            \`kiss @user\` - Kisses the user.
            \`kiss\` - Kisses no one...
            `,
            examples:
            `
            \`=>kiss @user\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const neko = new nekoClient()

        let user = message.author
        let name = "someone"
        if (message.mentions.users.size) {
            user = message.mentions.users.first()!
            name = message.mentions.users.first()!.username
            if (user.id === message.author.id) name = "themselves"
            if (user.id === discord.user!.id) name = "me"
        }

        let flavorText = `${discord.getEmoji("kannaSpook")}`
        if (name === "themselves") flavorText = `It's ok... ${discord.getEmoji("umaruCry")}`
        if (name === "someone") flavorText = `Weird ${discord.getEmoji("gabuChrist")}`
        if (name === "me") flavorText = `Thanks ${discord.getEmoji("gabYes")}`

        const image = await neko.sfw.kiss()

        const kissEmbed = embeds.createEmbed()
        kissEmbed
        .setURL(image.url)
        .setTitle(`**Kiss** ${discord.getEmoji("kannaFreeze")}`)
        .setDescription(`**${message.author.username}** kissed **${name}**! ${flavorText}`)
        .setImage(image.url)
        message.channel.send(kissEmbed)
    }
}
