import {Message, TextChannel} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"
export default class MessageUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (oldMessage: Message, newMessage: Message) => {
        const discord = this.discord
        const sql = new SQLQuery(newMessage)
        const embeds = new Embeds(discord, newMessage)
        if (newMessage.partial) newMessage = await newMessage.fetch()
        if (newMessage.author.bot) return
        if (newMessage.author.id === discord.user!.id) return

        const logUpdated = async (oldMsg: Message, newMsg: Message) => {
            const messageLog = await sql.fetchColumn("logs", "message log")
            if (messageLog) {
                if (oldMsg.content) {
                    if (oldMsg.content === newMsg.content) return
                }
                const msgChannel = newMsg.guild?.channels.cache.get(messageLog)! as TextChannel
                const logEmbed =  embeds.createEmbed()
                const oldContent = oldMsg.content ? `**Old Message**\n ${oldMsg.content}\n` : ""
                const newContent = newMsg.content ? `**New Message**\n ${newMsg.content}\n` : ""
                const image = newMsg.attachments?.first()?.url ? newMsg.attachments.first()!.proxyURL : ""
                const attachments = newMsg.attachments.size > 1 ? "\n" + newMsg.attachments.map((a) => `[**Link**](${a.proxyURL})`).join("\n") : ""
                logEmbed
                .setAuthor(`${newMsg.author.tag} (${newMsg.author.id})`, newMsg.author.displayAvatarURL({format: "png", dynamic: true}))
                .setTitle(`**Message Edited** ${discord.getEmoji("mexShrug")}`)
                .setImage(image)
                .setDescription(oldContent + newContent + attachments)
                .setFooter(`#${(newMsg.channel as TextChannel).name} • ${Functions.formatDate(newMsg.editedAt!)}`)
                await msgChannel.send(logEmbed).catch(() => null)
            }
        }
        logUpdated(oldMessage, newMessage)
    }
}
