import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Kiss extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
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
            cooldown: 3,
            subcommandEnabled: true
        })
        const userOption = new SlashCommandOption()
            .setType("mentionable")
            .setName("user")
            .setDescription("User to kiss.")
            
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(userOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const neko = new nekoClient()

        let name = "someone"
        if (args[1]) {
            const userID = args[1].match(/\d+/)?.[0] || ""
            const user = await message.guild.members.fetch(userID)
            if (user) {
                name = user.user.username
                if (user.id === message.author.id) name = "themselves"
                if (user.id === discord.user!.id) name = "me"
            }
        }

        let flavorText = `${discord.getEmoji("kannaSpook")}`
        if (name === "themselves") flavorText = `It's ok... ${discord.getEmoji("umaruCry")}`
        if (name === "someone") flavorText = `Weird ${discord.getEmoji("gabuChrist")}`
        if (name === "me") flavorText = `Thanks ${discord.getEmoji("gabYes")}`

        const image = await neko.kiss()

        const kissEmbed = embeds.createEmbed()
        kissEmbed
        .setURL(image.url)
        .setTitle(`**Kiss** ${discord.getEmoji("kannaFreeze")}`)
        .setDescription(`**${message.author.username}** kissed **${name}**! ${flavorText}`)
        .setImage(image.url)
        return this.reply(kissEmbed)
    }
}
