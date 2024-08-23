import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Slap extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Slaps someone.",
            help:
            `
            \`slap @user\` - Slaps the user.
            \`slap\` - Slaps no one...
            `,
            examples:
            `
            \`=>slap @user\`
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

        let flavorText = `${discord.getEmoji("chinoSmug")}`
        if (name === "themselves") flavorText = `Nice... ${discord.getEmoji("AquaWut")}`
        if (name === "someone") flavorText = `Well ok ${discord.getEmoji("vigneDead")}`
        if (name === "me") flavorText = `No thanks ${discord.getEmoji("ceaseBullying")}`

        const image = await neko.slap()

        const slapEmbed = embeds.createEmbed()
        slapEmbed
        .setURL(image.url)
        .setTitle(`**Slap** ${discord.getEmoji("kaosWTF")}`)
        .setDescription(`**${message.author.username}** slaps **${name}**! ${flavorText}`)
        .setImage(image.url)
        message.channel.send({embeds: [slapEmbed]})
    }
}
