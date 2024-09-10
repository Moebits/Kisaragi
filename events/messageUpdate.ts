import {Message, PartialMessage, TextChannel} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class MessageUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (oldMessage: Message<true> | PartialMessage, newMessage: Message<true> | PartialMessage) => {
        const discord = this.discord
        if (newMessage.partial) newMessage = await newMessage.fetch() as Message<true>
        const sql = new SQLQuery(newMessage)
        const embeds = new Embeds(discord, newMessage)
        if (newMessage.author.bot) return
        if (newMessage.author.id === discord.user!.id) return

        const logUpdated = async (oldMsg: Message | PartialMessage, newMsg: Message | PartialMessage) => {
            if (newMsg.partial) newMsg = await newMsg.fetch()
            const messageLog = await sql.fetchColumn("guilds", "message log")
            if (messageLog) {
                if (oldMsg.content === newMsg.content) return
                const msgChannel = newMsg.guild?.channels.cache.get(messageLog)! as TextChannel
                const logEmbed =  embeds.createEmbed()
                const oldContent = oldMsg.content ? `**Old Message**\n ${oldMsg.content}\n` : ""
                const newContent = newMsg.content ? `**New Message**\n ${newMsg.content}\n` : ""
                const image = newMsg.attachments?.first()?.url ? newMsg.attachments.first()!.proxyURL : ""
                const attachments = newMsg.attachments.size > 1 ? "\n" + newMsg.attachments.map((a) => `[**Link**](${a.proxyURL})`).join("\n") : ""
                logEmbed
                .setAuthor({name: `${newMsg.author.tag} (${newMsg.author.id})`, iconURL: newMsg.author.displayAvatarURL({extension: "png"})})
                .setTitle(`**Message Edited** ${discord.getEmoji("mexShrug")}`)
                .setImage(image)
                .setDescription(oldContent + newContent + attachments)
                .setFooter({text: `#${(newMsg.channel as TextChannel).name} • ${Functions.formatDate(newMsg.editedAt!)}`})
                await this.discord.channelSend(msgChannel, logEmbed).catch(() => null)
            }
        }
        logUpdated(oldMessage, newMessage)
    }
}
