import {GuildMember, Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Guild extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gets information on this server.",
            help:
            `
            \`guild\` - Posts guild info
            `,
            examples:
            `
            \`=>guild\`
            `,
            guildOnly: true,
            aliases: ["server"],
            random: "none",
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const guildImg = message.guild?.bannerURL() ? message.guild.bannerURL({format: "png"}) : (message.guild?.splashURL() ? message.guild.splashURL({format: "png"}) : "")
        const inviteURL = await discord.getInvite(message.guild)

        const guildEmbed = embeds.createEmbed()
        guildEmbed
        .setAuthor("discord.js", "https://discord.js.org/static/logo-square.png")
        .setTitle(`**Guild Info** ${discord.getEmoji("AquaWut")}`)
        .setThumbnail(message.guild?.iconURL({format: "png", dynamic: true}) ?? "")
        .setImage(guildImg ?? "")
        .setDescription(
            `${discord.getEmoji("star")}_Guild:_ **${message.guild?.name}**\n` +
            `${discord.getEmoji("star")}_Guild ID:_ \`${message.guild?.id}\`\n` +
            `${discord.getEmoji("star")}_Owner:_ **${message.guild?.owner?.user.tag}**\n` +
            `${discord.getEmoji("star")}_Shard:_ **${message.guild?.shard.id}**\n` +
            `${discord.getEmoji("star")}_Region:_ **${message.guild?.region}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(message.guild?.createdAt!)}**\n` +
            `${discord.getEmoji("star")}_Boosters:_ **${message.guild?.premiumSubscriptionCount}**\n` +
            `${discord.getEmoji("star")}_Bans:_ **${await message.guild?.fetchBans().then((b)=>b.size)}**\n` +
            `${discord.getEmoji("star")}_Invites:_ **${await message.guild?.fetchInvites().then((i) => i.size)}**\n` +
            `${discord.getEmoji("star")}_Member Count:_ **${message.guild?.memberCount}**\n` +
            `${discord.getEmoji("star")}_Channel Count:_ **${message.guild?.channels.cache.size}**\n` +
            `${discord.getEmoji("star")}_Role Count:_ **${message.guild?.roles.cache.size}**\n` +
            `${discord.getEmoji("star")}_Emoji Count:_ **${message.guild?.emojis.cache.size}**\n` +
            `${discord.getEmoji("star")}_Members:_ ${Functions.checkChar(message.guild?.members.cache.map((m) => `\`${m.user.tag}\``).join(" ")!, 200, " ")}\n` +
            `${discord.getEmoji("star")}_Channels:_ ${Functions.checkChar(message.guild?.channels.cache.map((c) => `<#${c.id}>`).join(" ")!, 200, " ")}\n` +
            `${discord.getEmoji("star")}_Roles:_ ${Functions.checkChar(message.guild?.roles.cache.map((r) => `<@&${r.id}>`).join(" ")!, 200, " ")}\n` +
            `${discord.getEmoji("star")}_Emojis:_ ${Functions.checkChar(message.guild?.emojis.cache.map((e) => {
                if (e.animated) return `<${e.identifier}>`
                return `<:${e.identifier}>`
            }).join(" ")!, 200, " ")}\n` +
            `${discord.getEmoji("star")}_Invite Link:_ ${inviteURL}\n`
        )
        message.channel.send(guildEmbed)
        return
    }
}
