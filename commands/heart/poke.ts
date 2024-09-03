import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Poke extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Pokes someone.",
            help:
            `
            \`poke @user\` - Pokes the user.
            \`poke\` - Pokes no one...
            `,
            examples:
            `
            \`=>poke @user\`
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
        if (name === "themselves") flavorText = `Ok... ${discord.getEmoji("sataniaDead")}`
        if (name === "someone") flavorText = `Cute? ${discord.getEmoji("vigneDead")}`
        if (name === "me") flavorText = `Uhh... thanks ${discord.getEmoji("raphi")}`

        const image = await neko.poke()

        const pokeEmbed = embeds.createEmbed()
        pokeEmbed
        .setURL(image.url)
        .setTitle(`**Poke** ${discord.getEmoji("chinoSmug")}`)
        .setDescription(`**${message.author.username}** pokes **${name}**! ${flavorText}`)
        .setImage(image.url)
        message.channel.send({embeds: [pokeEmbed]})
    }
}
