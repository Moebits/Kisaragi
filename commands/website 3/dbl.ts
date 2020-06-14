import axios from "axios"
import DBL from "dblapi.js"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class DiscordBotList extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for bots on top.gg (discord bot list).",
            help:
            `
            _Note: You can refine the search by specifying a certain \`property:value\`. Example: username:kisaragi, prefix:=>, owners:ID_
            \`dbl\` - Search for new bots.
            \`dbl query\` - Searches for bots with the query.
            `,
            examples:
            `
            \`=>dbl anime\`
            \`=>dbl prefix:+ shortdesc:anime\`
            `,
            aliases: ["topgg", "discordbotlist"],
            random: "none",
            cooldown: 15
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const headers = {
            authorization: process.env.DBL_TOKEN
        }
        const search = Functions.combineArgs(args, 1)
        const data = await axios.get(`https://top.gg/api/bots?search=${encodeURI(search)}&limit=50&sort=date`, {headers}).then((r) => r.data.results)

        const botArray: MessageEmbed[] = []
        const max = data.length < 25 ? data.length : 25
        for (let i = 0; i < max; i++) {
            const bot = data[i]
            const owner = await discord.users.fetch(bot.owners[0])
            const website = bot.website ? `[**Website**](${bot.website})\n` : ""
            const support = bot.support ? `[**Support**](https://discord.gg/${bot.support})\n` : ""
            const github = bot.github ? `[**Github**](${bot.github})\n` : ""
            const invite = bot.invite ? `[**Invite**](${bot.invite})\n` : ""
            const botEmbed = embeds.createEmbed()
            botEmbed
            .setAuthor("discord bot list", "https://top.gg/images/dblnew.png")
            .setTitle(`**DBL Search** ${discord.getEmoji("RaphiSmile")}`)
            .setURL(`https://top.gg/bot/${bot.id}`)
            .setThumbnail(`https://images.discordapp.net/avatars/${bot.id}/${bot.avatar}.png`)
            .setDescription(
                `${discord.getEmoji("star")}_Bot:_ **${bot.username}#${bot.discriminator}**\n` +
                `${discord.getEmoji("star")}_ID:_ \`${bot.id}\`\n` +
                `${discord.getEmoji("star")}_Owner:_ **${owner.tag}**\n` +
                `${discord.getEmoji("star")}_Owner ID:_ \`${owner.id}\`\n` +
                `${discord.getEmoji("star")}_Library:_ **${bot.lib}**\n` +
                `${discord.getEmoji("star")}_Prefix:_ **${bot.prefix.replace(/\*/, "\*")}**\n` +
                `${discord.getEmoji("star")}_Upvotes:_ **${bot.points}**\n` +
                `${discord.getEmoji("star")}_Monthly Upvotes:_ **${bot.monthlyPoints}**\n` +
                `${discord.getEmoji("star")}_Servers:_ **${bot.server_count ?? 0}**\n` +
                `${discord.getEmoji("star")}_Added:_ \`${Functions.formatDate(bot.date)}\`\n` +
                `${discord.getEmoji("star")}_Tags:_ ${bot.tags[0] ? `**${bot.tags.join(", ")}**` : "None"}\n` +
                `${discord.getEmoji("star")}_Description:_ ${bot.shortdesc.replace(/\*/, "\*")}\n` +
                website + support + github + invite
            )
            botArray.push(botEmbed)
        }

        if (botArray.length === 1) {
            message.channel.send(botArray[0])
        } else {
            embeds.createReactionEmbed(botArray)
        }
    }
}
