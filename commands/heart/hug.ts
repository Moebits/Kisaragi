import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Hug extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Hugs someone.",
            help:
            `
            \`hug @user\` - Hugs the user.
            \`hug\` - Hugs no one...
            `,
            examples:
            `
            \`=>hug @user\`
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

        let flavorText = `${discord.getEmoji("kannaWave")}`
        if (name === "themselves") flavorText = `Sad... ${discord.getEmoji("umaruCry")}`
        if (name === "someone") flavorText = `A bit sad ${discord.getEmoji("akariLurk")}`
        if (name === "me") flavorText = `Thank you ${discord.getEmoji("yes")}`

        const image = await neko.hug()

        const hugEmbed = embeds.createEmbed()
        hugEmbed
        .setURL(image.url)
        .setTitle(`**Hug** ${discord.getEmoji("yes")}`)
        .setDescription(`**${message.author.username}** hugged **${name}**! ${flavorText}`)
        .setImage(image.url)
        message.channel.send({embeds: [hugEmbed]})
    }
}
