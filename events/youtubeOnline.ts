import {Guild, GuildAuditLogsEntry, Message, TextChannel, User, WebhookClient} from "discord.js"
import {HelixStream} from "twitch"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class YoutubeOnline {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (data: any) => {
        const discord = this.discord
        const config = await SQLQuery.fetchColumn("yt", "config", "channel id", data.channel.id)
        if (!config?.[0]) return
        for (let i = 0; i < config.length; i++) {
            const current = JSON.parse(config[i])
            if (!current.id || !current.token) continue
            if (!current.state || current.state === "Off") continue
            const webhook = new WebhookClient(current.id, current.token, {
                disableMentions: "everyone",
                restTimeOffset: 0
            })
            if (!current.mention) current.mention = ""
            const message = `${current.mention}[**${data.channel.name}**](${data.channel.link}) uploaded a new video, [**${data.video.title}**](${data.video.link})! ${data.video.link}`
            await webhook.send(message, {avatarURL: discord.user?.displayAvatarURL({format: "png", dynamic: true}), username: discord.user?.username})
            webhook.destroy()
        }
    }
}
