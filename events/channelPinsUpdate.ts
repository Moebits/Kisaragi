import {DMChannel, Message, TextChannel, Webhook} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class ChannelPinsUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public postPin = async (channel: TextChannel, pinChannel: TextChannel, message: Message) => {
        const discord = this.discord
        const embeds = new Embeds(discord, message)
        const webhooks = await pinChannel.fetchWebhooks()
        let webhook: Webhook
        if (webhooks.size) {
            webhook = webhooks.first()!
        } else {
            try {
                webhook = await pinChannel.createWebhook("Pinboard", {avatar: this.discord.user!.displayAvatarURL({format: "png", dynamic: true})})
            } catch {
                return channel.send(`I need the **Manage Webhooks** permission to forward pinned messages ${discord.getEmoji("kannaFacepalm")}`)
            }
        }
        let pin: Message
        try {
            pin = await channel.messages.fetchPinned().then((m) => m.first()!)
        } catch {
            return channel.send(`I need the **Manage Messages** permission to see pins ${discord.getEmoji("kannaFacepalm")}`)
        }
        if (!pin?.pinned) return
        const pinEmbed = embeds.createEmbed()
        pinEmbed
        .setAuthor("pin", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")
        .setTitle(`**Message Pinned!**`)
        .setURL(pin.url)
        .setDescription(`[**Message Link**](${pin.url})\n` + pin.content)
        .setImage(pin.attachments.first() ? pin.attachments.first()!.url : "")
        .setFooter(`${pin.author.tag} • #${(message.channel as TextChannel).name}`, pin.author.displayAvatarURL({format: "png", dynamic: true}))
        await webhook.send({embeds: [pinEmbed], avatarURL: pin.author.displayAvatarURL({format: "png", dynamic: true}), username: pin.member?.displayName})
        await pin.unpin()
        const pinMsg = await channel.messages.fetch({limit: 10}).then((m) => m.find((m) => m.type === "PINS_ADD"))
        if (pinMsg) await pinMsg.delete()
    }

    public run = async (channel: DMChannel | TextChannel, time: Date) => {
        if (channel instanceof DMChannel) return
        const message = channel.lastMessage!
        const sql = new SQLQuery(message)

        const pinboardID = await sql.fetchColumn("guilds", "pinboard")
        const nsfwPinboardID = await sql.fetchColumn("guilds", "nsfw pinboard")
        if (!pinboardID && !nsfwPinboardID) return
        const pinboard = channel.guild.channels.cache.get(pinboardID ?? "")!
        const nsfwPinboard = channel.guild.channels.cache.get(nsfwPinboardID ?? "")

        if (!channel.nsfw && pinboard) {
            if (!(pinboard instanceof TextChannel)) return
            await this.postPin(channel, pinboard, message)
        } else if (channel.nsfw && nsfwPinboard) {
            if (!(nsfwPinboard instanceof TextChannel)) return
            await this.postPin(channel, nsfwPinboard, message)
        }
    }

}
