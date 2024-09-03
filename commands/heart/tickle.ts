import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Tickle extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Tickles someone.",
            help:
            `
            \`tickle @user\` - Tickles the user.
            \`tickle\` - Tickles no one...
            `,
            examples:
            `
            \`=>tickle @user\`
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
        const neko = new nekoClient()

        let user = message.author
        let name = "someone"
        if (message.mentions.users.size) {
            user = message.mentions.users.first()!
            name = message.mentions.users.first()!.username
            if (user.id === message.author.id) name = "themselves"
            if (user.id === discord.user!.id) name = "me"
        }

        let flavorText = `${discord.getEmoji("cute")}`
        if (name === "themselves") flavorText = `Cool... ${discord.getEmoji("tohruThink")}`
        if (name === "someone") flavorText = `That's cute ${discord.getEmoji("vigneDead")}`
        if (name === "me") flavorText = `I'm not a fan ${discord.getEmoji("karenAnger")}`

        const image = await neko.tickle()

        const tickleEmbed = embeds.createEmbed()
        tickleEmbed
        .setURL(image.url)
        .setTitle(`**Tickle** ${discord.getEmoji("kannaSip")}`)
        .setDescription(`**${message.author.username}** tickles **${name}**! ${flavorText}`)
        .setImage(image.url)
        message.channel.send({embeds: [tickleEmbed]})
    }
}
