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
                const content = message.content ? message.content : ""
                const image = message.attachments.first() ? message.attachments.first()!.proxyURL : ""
                if (!content && !image) return
                const logs = await message.guild?.fetchAuditLogs({type: "MESSAGE_DELETE", limit: 1}).then((l) => l.entries.first())
                let executor = ""
                if (logs?.createdTimestamp && logs?.createdTimestamp > Date.now() - 1000) {
                    if (logs?.executor.id === discord.user!.id && !/discord/gi.test(message.content)) {
                        return
                    } else {
                        executor = `${discord.getEmoji("star")}_Deleter:_ **<@!${logs.executor.id}> (${logs.executor.tag})**\n` +
                        `${discord.getEmoji("star")}_Deleter ID:_ \`${logs.executor.id}\`\n`
                    }
                }
                const msgChannel = message.guild?.channels.cache.get(messageLog)! as TextChannel
                const logEmbed =  embeds.createEmbed()
                const attachments = message.attachments.size > 1 ? "\n" + message.attachments.map((a) => `[**Link**](${a.proxyURL})`).join("\n") : ""
                const imageText = image ? `\n_Image might be already deleted. Link_ [**here**](${image})` : ""
                logEmbed
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({format: "png", dynamic: true}))
                .setTitle(`**Message Deleted** ${discord.getEmoji("chinoSmug")}`)
                .setImage(image)
                .setDescription(executor + content + imageText + attachments)
                .setFooter(`#${(message.channel as TextChannel).name} • ${Functions.formatDate(message.createdAt)}`)
                await msgChannel.send(logEmbed).catch(() => null)
            }
        }
        logDeleted(message)
    }
}
