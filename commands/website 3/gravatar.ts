import axios from "axios"
import {DMChannel, Message, TextChannel} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import md5 from "md5"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class FlickrCommand extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Gets the profile picture of a gravatar email.",
            help:
            `
            _Note: The invocation of this command is removed for privacy reasons._
            \`gravatar email\` - Gets the profile picture of the email
            `,
            examples:
            `
            \`=>gravatar someone@gmail.com\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const email = args[1]
        if (!email) return message.reply(`You must provide an email address ${discord.getEmoji("kannaCurious")}`)
        if (message.channel instanceof TextChannel) await message.channel.bulkDelete(2)
        const hash = md5(email.trim().toLowerCase())
        const gravatarEmbed = embeds.createEmbed()
        .setAuthor({name: "gravatar", iconURL: "https://cdn.wpbeginner.com/wp-content/uploads/2012/08/gravatarlogo.jpg", url: "https://en.gravatar.com/"})
        .setTitle(`**Gravatar Profile Picture** ${discord.getEmoji("kannaSpook")}`)
        .setImage(`https://www.gravatar.com/avatar/${hash}?size=500`)
        await message.reply({content: "Here is your gravatar profile picture", embeds: [gravatarEmbed]})
        return
    }
}
