import {Message, TextChannel} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"
export default class MessageDelete {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (message: Message) => {
        const discord = this.discord
        if (message.partial) message = await message.fetch()
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (message.author.bot) return
        if (message.author.id === discord.user!.id) return

        const logDeleted = async (message: Message) => {
            const messageLog = await sql.fetchColumn("logs", "message log")
            if (messageLog) {
                const msgChannel = message.guild?.channels.cache.get(messageLog)! as TextChannel
                const logEmbed =  embeds.createEmbed()
                const content = message.content ? message.content : ""
                const image = message.attachments.first() ? message.attachments.first()!.proxyURL : ""
                const attachments = message.attachments.size > 1 ? "\n" + message.attachments.map((a) => `[**Link**](${a.proxyURL})`).join("\n") : ""
                const imageText = image ? `\n_Image might be already deleted. Link_ [**here**](${image})` : ""
                logEmbed
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({format: "png", dynamic: true}))
                .setTitle(`**Message Deleted** ${discord.getEmoji("chinoSmug")}`)
                .setImage(image)
                .setDescription(content + imageText + attachments)
                .setFooter(`#${(message.channel as TextChannel).name} • ${Functions.formatDate(message.createdAt)}`)
                await msgChannel.send(logEmbed).catch(() => null)
            }
        }
        logDeleted(message)
    }
}
