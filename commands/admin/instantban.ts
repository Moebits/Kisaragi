import {GuildChannel, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class InstantBan extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configure settings for instant bans.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const star = discord.getEmoji("star")
        if (!await perms.checkAdmin()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            instantBanPrompt(message)
            return
        }

        const pfpBan = await sql.fetchColumn("blocks", "pfp ban toggle")
        const leaveBan = await sql.fetchColumn("blocks", "leaver ban toggle")
        const defChannel = await sql.fetchColumn("blocks", "default channel")
        const instantBanEmbed = embeds.createEmbed()
        instantBanEmbed
        .setTitle(`**Instant Bans** ${discord.getEmoji("mexShrug")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .setDescription(
            "Configure settings for instant bans.\n" +
            "\n" +
            "**Profile Picture Ban** = Bans all members that have a default profile picture upon joining.\n" +
            "**Leave Ban** = Bans all members that join and then leave in under 5 minutes.\n" +
            "**Default Channel** = The default channel where messages will be posted.\n" +
            "\n" +
            "__Current Settings:__\n" +
            `${star}_Profile Picture Ban:_ **${pfpBan}**\n` +
            `${star}_Leave Ban:_ **${leaveBan}**\n` +
            `${star}_Default Channel:_ **${defChannel ? `<#${defChannel}>` : "None"}**\n` +
            "\n" +
            "__Edit Settings:__\n" +
            `${star}_Type **pfp** to toggle profile picture bans._\n` +
            `${star}_Type **leave** to toggle leave bans._\n` +
            `${star}_**Mention a channel** to set the default channel._\n` +
            `${star}_**You can type multiple options** to enable all at once._\n` +
            `${star}_Type **reset** to disable all settings._\n` +
            `${star}_Type **cancel** to exit._\n`
        )
        message.channel.send(instantBanEmbed)

        async function instantBanPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            let setPfp, setLeave, setChannel
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${star}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("blocks", "pfp ban toggle", "off")
                await sql.updateColumn("blocks", "leaver ban toggle", "off")
                responseEmbed
                .setDescription(`${star}All settings were disabled!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.match(/pfp/g)) setPfp = true
            if (msg.content.match(/leave/g)) setLeave = true
            if (msg.mentions.channels.array().join("")) setChannel = true

            if (setChannel) {
                const channel = msg.guild!.channels.find((c: GuildChannel) => c === msg.mentions.channels.first())
                await sql.updateColumn("blocks", "default channel", channel!.id)
                responseEmbed
                .setDescription(`${star}Default channel set to <#${channel!.id}>!\n`)
                if (setPfp || setLeave) {
                    msg.channel.send(responseEmbed)
                } else {
                    msg.channel.send(responseEmbed)
                    return
                }
            }

            if (setPfp && setLeave) {
                await sql.updateColumn("blocks", "pfp ban toggle", "on")
                await sql.updateColumn("blocks", "leaver ban toggle", "on")
                responseEmbed
                .setDescription(`${star}Profile picture and leave bans are now **on**!`)
                msg.channel.send(responseEmbed)
                return
            }

            if (setPfp) {
                if (String(pfpBan) === "off") {
                    await sql.updateColumn("blocks", "pfp ban toggle", "on")
                    responseEmbed
                    .setDescription(`${star}Profile picture bans are now **on**!`)
                    msg.channel.send(responseEmbed)
                    return
                } else {
                    await sql.updateColumn("blocks", "pfp ban toggle", "off")
                    responseEmbed
                    .setDescription(`${star}Profile picture bans are now **off**!`)
                    msg.channel.send(responseEmbed)
                    return
                }
            }

            if (setLeave) {
                if (String(leaveBan) === "off") {
                    await sql.updateColumn("blocks", "leaver ban toggle", "on")
                    responseEmbed
                    .setDescription(`${star}Leave bans are now **on**!`)
                    msg.channel.send(responseEmbed)
                    return
                } else {
                    await sql.updateColumn("blocks", "leaver ban toggle", "off")
                    responseEmbed
                    .setDescription(`${star}Leave bans are now **off**!`)
                    msg.channel.send(responseEmbed)
                    return
                }
            }

            responseEmbed
            .setDescription(`${star}Invalid arguments provided, canceled the prompt.`)
            msg.channel.send(responseEmbed)
            return
        }

        embeds.createPrompt(instantBanPrompt)
    }
}
