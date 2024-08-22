import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class User extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gets information on a user or on yourself.",
            help:
            `
            \`user @user?\` - Gets info on a user
            `,
            examples:
            `
            \`=>user\`
            `,
            guildOnly: true,
            aliases: ["member", "whois"],
            random: "none",
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let user = message.member
        if (message.mentions?.members!.size > 0) {
            user = message.mentions.members!.first()!
        }

        const userEmbed = embeds.createEmbed()
        userEmbed
        .setAuthor({name: "discord.js", iconURL: "https://discord.js.org/static/logo-square.png"})
        .setTitle(`**User Info** ${discord.getEmoji("CirNo")}`)
        .setThumbnail(user?.user.displayAvatarURL({extension: "png"}) ?? "")
        .setDescription(
            `${discord.getEmoji("star")}_User:_ **${user?.user.tag}**\n` +
            `${discord.getEmoji("star")}_User ID:_ ${user?.id}\n` +
            `${discord.getEmoji("star")}_Joined Guild At:_ **${Functions.formatDate(user?.joinedAt!)}**\n` +
            `${discord.getEmoji("star")}_Created Account At:_ **${Functions.formatDate(user?.user.createdAt!)}**\n` +
            `${discord.getEmoji("star")}_Roles:_ ${Functions.checkChar(user?.roles.cache.map((r) => `<@&${r.id}>`).join(" ")!, 1000, " ")}`
        )
        message.channel.send({embeds: [userEmbed]})
        return
    }
}
