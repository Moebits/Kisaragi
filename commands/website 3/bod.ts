import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import querystring from "querystring"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class BotsOnDiscord extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for bots on bots on discord.",
            help:
            `
            \`bod\` - Gets random bots
            \`bod query\` - Searches for bots with the query.
            `,
            examples:
            `
            \`=>bod anime\`
            `,
            aliases: ["botsondiscord"],
            random: "none",
            cooldown: 15
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
        }

        const query = Functions.combineArgs(args, 1).trim()
        const response = await axios.post(`https://bots.ondiscord.xyz/api/bots/search`, {query, sort: "relevance", limit: 30}, {headers}).then((r) => r.data)

        const botArray: MessageEmbed[] = []
        for (let i = 0; i < response.results.length; i++) {
            const bot = response.results[i]
            const botEmbed = embeds.createEmbed()
            const website = bot.websiteUrl ? `[**Website**](${bot.websiteUrl})\n` : ""
            const support = bot.serverInviteCode ? `[**Support Server**](https://discord.gg/${bot.serverInviteCode})\n` : ""
            const invite = bot.inviteUrl ? `[**Bot Invite**](${bot.inviteUrl})\n` : ""
            botEmbed
            .setAuthor("bots on discord", "https://cdn.discordapp.com/avatars/437086154215391233/984253b49d32657982a3a5980a302d7e.jpg?size=512", "https://bots.ondiscord.xyz/")
            .setTitle(`**BOD Search** ${discord.getEmoji("kannaCurious")}`)
            .setURL(`https://bots.ondiscord.xyz/bots/${bot.clientId}`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${bot.clientId}/${bot.avatarHash}.png`)
            .setDescription(
                `${discord.getEmoji("star")}_Bot:_ **${bot.username}**\n` +
                `${discord.getEmoji("star")}_Bot ID:_ \`${bot.clientId}\`\n` +
                `${discord.getEmoji("star")}_Owner:_ **${bot.owner.username}#${bot.owner.discriminator}**\n` +
                `${discord.getEmoji("star")}_Owner ID:_ \`${bot.owner.id}\`\n` +
                `${discord.getEmoji("star")}_Prefix:_ **${bot.prefix}**\n` +
                `${discord.getEmoji("star")}_Reviews:_ ${discord.getEmoji("thumbsUp")} **${bot.reviews.totalPositive}** ${discord.getEmoji("thumbsDown")} **${bot.reviews.totalNegative}**\n` +
                `${discord.getEmoji("star")}_Invites:_ **${bot.invitesAllTime}**\n` +
                `${discord.getEmoji("star")}_Guilds:_ **${bot.stats.guildCount}**\n` +
                `${discord.getEmoji("star")}_Added:_ **${Functions.formatDate(bot.dates.firstApproved)}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${bot.description}\n` +
                website + support + invite
            )
            botArray.push(botEmbed)
        }

        if (botArray.length === 1) {
            message.channel.send(botArray[0])
        } else {
            embeds.createReactionEmbed(botArray)
        }
        return
    }
}
