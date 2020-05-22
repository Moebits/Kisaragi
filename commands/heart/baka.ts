import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Baka extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Calls someone a baka.",
            help:
            `
            \`baka @user\` - Call someone a baka.
            \`baka\` - Call no one a baka...
            `,
            examples:
            `
            \`=>baka @user\`
            `,
            aliases: [],
            cooldown: 5
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
        if (name === "themselves") flavorText = `Alright ${discord.getEmoji("mexShrug")}`
        if (name === "someone") flavorText = `Who knows ${discord.getEmoji("kannaCurious")}`
        if (name === "me") flavorText = `How rude ${discord.getEmoji("kannaFU")}`

        const image = await neko.sfw.baka()

        const bakaEmbed = embeds.createEmbed()
        bakaEmbed
        .setURL(image.url)
        .setTitle(`**Baka** ${discord.getEmoji("chinoSmug")}`)
        .setDescription(`**${message.author.username}** called **${name}** a baka! ${flavorText}`)
        .setImage(image.url)
        message.channel.send(bakaEmbed)
    }
}
