import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Smug extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts a smug face.",
            help:
            `
            \`smug @user\` - Be smug to someone.
            \`smug\` - Posts a smug image.
            `,
            examples:
            `
            \`=>smug @user\`
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

        let flavorText = `${discord.getEmoji("smugFace")}`
        if (name === "themselves") flavorText = `Nice... ${discord.getEmoji("aquaUp")}`
        if (name === "someone") flavorText = `Cool ${discord.getEmoji("raphi")}`
        if (name === "me") flavorText = `Hmm alright ${discord.getEmoji("tohruThink")}`

        const image = await neko.smug()

        const smugEmbed = embeds.createEmbed()
        smugEmbed
        .setURL(image.url)
        .setTitle(`**Smug** ${discord.getEmoji("chinoSmug")}`)
        .setDescription(`**${message.author.username}** is being smug to **${name}**! ${flavorText}`)
        .setImage(image.url)
        message.channel.send(smugEmbed)
    }
}
