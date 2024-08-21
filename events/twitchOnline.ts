import {Guild, GuildAuditLogsEntry, Message, TextChannel, User, WebhookClient} from "discord.js"
import {HelixStream} from "twitch"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class TwitchOnline {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (stream: HelixStream) => {
        const discord = this.discord
        const config = await SQLQuery.fetchColumn("twitch", "config", "channel", stream.userDisplayName)
        for (let i = 0; i < config.length; i++) {
            const current = JSON.parse(config[i])
            if (!current.id || !current.token) continue
            if (!current.state || current.state === "Off") continue
            const webhook = new WebhookClient(current.id, current.token, {
                disableMentions: "everyone",
                restTimeOffset: 0
            })
            if (!current.mention) current.mention = ""
            const message = `${current.mention}[**${stream.userDisplayName}**](https://www.twitch.tv/${stream.userDisplayName}) is streaming on twitch! https://www.twitch.tv/${stream.userDisplayName}`
            await webhook.send(message, {avatarURL: discord.user?.displayAvatarURL({format: "png", dynamic: true}), username: discord.user!.username})
            webhook.destroy()
        }
    }
}
