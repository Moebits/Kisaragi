import type {GuildEmoji, Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Logs extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures logging settings (messages, users, audit logs, etc).",
            help:
            `
            \`logs\` - Opens the logs prompt
            \`logs #channel? [#channel]? (#channel)? {#channel}?\` - Sets the message, mod, user, and guild log respectively
            \`logs delete message/mod/user/member\` - Removes the specified log channels.
            \`logs reset\` - Removes all channels.
            `,
            examples:
            `
            \`=>logs\`
            \`=>logs #message-log [#mod-log] <#user-log>\`
            \`=>logs reset\`
            `,
            aliases: ["log", "logging"],
            guildOnly: true,
            cooldown: 15
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            await logPrompt(message)
            return
        }

        const messageLog = await sql.fetchColumn("logs", "message log")
        const modLog = await sql.fetchColumn("logs", "mod log")
        const userLog = await sql.fetchColumn("logs", "user log")
        const memberLog = await sql.fetchColumn("logs", "member log")

        const logEmbed = embeds.createEmbed()
        logEmbed
        .setTitle(`**Logs** ${discord.getEmoji("kannaSpook")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .setDescription(Functions.multiTrim(`
            Edit Logging settings for the server.
            newline
            **Message Log** - Channel where deleted and edited messages are posted.
            **Mod Log** - Channel where mod actions (bans, kicks) are posted.
            **User Log** - Channel where user joins and leaves are posted.
            **Member Log** - Guild member updates (nicknames, avatars, roles, etc)
            newline
            __Current Settings__
            ${discord.getEmoji("star")}Message Log: ${messageLog ? `<#${messageLog}>` : "None"}
            ${discord.getEmoji("star")}Mod Log: ${modLog ? `<#${modLog}>` : "None"}
            ${discord.getEmoji("star")}User Log: ${userLog ? `<#${userLog}>` : "None"}
            ${discord.getEmoji("star")}Member Log: ${memberLog ? `<#${memberLog}>` : "None"}
            newline
            __Edit Settings__
            ${discord.getEmoji("star")}**Mention or type a channel id** to set the message log channel.
            ${discord.getEmoji("star")}**[Mention or type a channel id] between brackets** to set the mod log channel.
            ${discord.getEmoji("star")}**(Mention or type a channel id) between parentheses** to set the user log channel.
            ${discord.getEmoji("star")}**{Mention or type a channel id} between braces** to set the member log channel.
            ${discord.getEmoji("star")}Type **delete message/mod/user/member** to remove the respective channels.
            ${discord.getEmoji("star")}Type **reset** to reset all settings.
            ${discord.getEmoji("star")}Type **cancel** to exit.
        `))

        message.channel.send(logEmbed)

        async function logPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            .setTitle(`**Logs** ${discord.getEmoji("kannaSpook")}`)

            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                return msg.channel.send(responseEmbed)
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("logs", "message log", null)
                await sql.updateColumn("logs", "mod log", null)
                await sql.updateColumn("logs", "user log", null)
                await sql.updateColumn("logs", "member log", null)
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Logging settings were wiped!`)
                return msg.channel.send(responseEmbed)
            }
            if (msg.content.toLowerCase() === "delete") {
                let desc = ""
                if (/message/i.test(msg.content)) {
                    await sql.updateColumn("logs", "message log", null)
                    desc +=  `${discord.getEmoji("star")}Removed the message log channel!\n`
                }
                if (/mod/i.test(msg.content)) {
                    await sql.updateColumn("logs", "mod log", null)
                    desc +=  `${discord.getEmoji("star")}Removed the mod log channel!\n`
                }
                if (/user/i.test(msg.content)) {
                    await sql.updateColumn("logs", "user log", null)
                    desc +=  `${discord.getEmoji("star")}Removed the user log channel!\n`
                }
                if (/member/i.test(msg.content)) {
                    await sql.updateColumn("logs", "member log", null)
                    desc +=  `${discord.getEmoji("star")}Removed the member log channel!\n`
                }
                if (!desc) desc = `No deletions were made ${discord.getEmoji("kannaFacepalm")}\n`
                responseEmbed
                .setDescription(desc)
                return msg.channel.send(responseEmbed)
            }

            let [setMsg, setMod, setUser, setMember] = [false, false, false, false]
            const newMod = msg.content.match(/(?<=\[)(.*?)(?=\])/)?.[0].match(/\d+/)?.[0] ?? ""
            const newUser = msg.content.match(/(?<=\()(.*?)(?=\))/)?.[0].match(/\d+/)?.[0] ?? ""
            const newMember = msg.content.match(/(?<={)(.*?)(?=})/)?.[0].match(/\d+/)?.[0] ?? ""
            const newMsg = msg.content.replace(newMod, "").replace(newUser, "").replace(newMember, "").match(/\d+/)?.[0] ?? ""

            if (Number(newMod)) setMod = true
            if (Number(newUser)) setUser = true
            if (Number(newMember)) setMember = true
            if (Number(newMsg)) setMsg = true

            let description = ""

            if (setMsg) {
                const channelTest = msg.guild?.channels.cache.get(newMsg)
                if (!channelTest) return msg.reply(`Invalid message log channel!`)
                await sql.updateColumn("logs", "message log", newMsg)
                description += `${discord.getEmoji("star")}Message log channel set to <#${newMsg}>!\n`
            }

            if (setMod) {
                const channelTest = msg.guild?.channels.cache.get(newMod)
                if (!channelTest) return msg.reply(`Invalid mod log channel!`)
                await sql.updateColumn("logs", "mod log", newMod)
                description += `${discord.getEmoji("star")}Mod log channel set to <#${newMod}>!\n`
            }

            if (setUser) {
                const channelTest = msg.guild?.channels.cache.get(newUser)
                if (!channelTest) return msg.reply(`Invalid user log channel!`)
                await sql.updateColumn("logs", "user log", newUser)
                description += `${discord.getEmoji("star")}User log channel set to <#${newUser}>!\n`
            }

            if (setMember) {
                const channelTest = msg.guild?.channels.cache.get(newMember)
                if (!channelTest) return msg.reply(`Invalid member log channel!`)
                await sql.updateColumn("logs", "member log", newMember)
                description += `${discord.getEmoji("star")}Member log channel set to <#${newMember}>!\n`
            }

            if (!description) return msg.reply(`No additions were made, canceled ${discord.getEmoji("kannaFacepalm")}`)
            responseEmbed
            .setDescription(description)
            return msg.channel.send(responseEmbed)
        }

        await embeds.createPrompt(logPrompt)
    }
}
