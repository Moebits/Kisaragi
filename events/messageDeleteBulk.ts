import {Collection, Message, TextChannel} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"
export default class MessageDeleteBulk {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (messages: Collection<string, Message>) => {
        const discord = this.discord
        let message = messages.find((m) => {
            if (m.partial) return false
            if (m.author.bot) {
                return false
            } else {
                return true
            }
        })
        if (!message) return
        if (message.partial) message = await message.fetch()
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (message.author.bot) return
        if (message.author.id === discord.user!.id) return

        const logDeleted = async (messages: Message[]) => {
            const messageLog = await sql.fetchColumn("logs", "message log")
            const prefix = await SQLQuery.fetchPrefix(messages[0])
            let message = messages.find((m) => {
                if (m.author.bot) {
                    return false
                } else {
                    if (m.content.includes(prefix)) {
                        return false
                    } else {
                        return true
                    }
                }
            })
            if (!message) message = messages[0]
            if (messageLog) {
                const count = messages[0].author.id === discord.user!.id ? messages.length - 2 : messages.length
                const msgChannel = message.guild?.channels.cache.get(messageLog)! as TextChannel
                const logEmbed =  embeds.createEmbed()
                const content = message.content ? `**First Message**\n ${message.content}` : ""
                const image = message.attachments?.first()?.url ? message.attachments.first()!.proxyURL : ""
                const attachments = message.attachments.size > 1 ? "\n" + message.attachments.map((a) => `[**Link**](${a.proxyURL})`).join("\n") : ""
                const imageText = image ? `\n_Image might be already deleted. Link_ [**here**](${image})` : ""
                logEmbed
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({format: "png", dynamic: true}))
                .setTitle(`**Messages Bulk Deleted** ${discord.getEmoji("tohruSmug")}`)
                .setImage(image)
                .setDescription(
                    `${discord.getEmoji("star")}_Count:_ **${count}**\n` +
                    content + imageText + attachments
                )
                .setFooter(`#${(message.channel as TextChannel).name} • ${Functions.formatDate(message.createdAt)}`)
                await msgChannel.send(logEmbed).catch(() => null)
            }
        }
        logDeleted(messages.map((m) => m))
    }
}
