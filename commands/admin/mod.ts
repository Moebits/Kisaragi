import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Mod extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configure moderation settings.",
            aliases: [],
            guildOnly: true,
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
        if (!perms.checkPerm("administrator")) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            modPrompt(message)
            return
        }

        const ascii = await sql.fetchColumn("blocks", "ascii name toggle")
        const mute = await sql.fetchColumn("special roles", "mute role")
        const restrict = await sql.fetchColumn("special roles", "restricted role")
        const warnOne = await sql.fetchColumn("special roles", "warn one")
        const warnTwo = await sql.fetchColumn("special roles", "warn two")
        const admin = await sql.fetchColumn("special roles", "admin role")
        const mod = await sql.fetchColumn("special roles", "mod role")
        const warnPen = await sql.fetchColumn("warns", "warn penalty")
        const warnThresh = await sql.fetchColumn("warns", "warn threshold")

        const modEmbed = embeds.createEmbed()
        modEmbed
        .setTitle(`**Moderator Settings** ${discord.getEmoji("karenAnger")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .setDescription(
            "Edit moderation settings for the server.\n" +
            "\n" +
            "**Restricted Role** = Can be any role with restricted Permission.\n" +
            "**Warn Threshold** = How many warnings will trigger the punishment.\n" +
            "**Warn Penalty** = The punishment after hitting the warn threshold.\n" +
            "**Ascii Names** = Removes all non-ascii characters in usernames.\n" +
            "\n" +
            "__Current Settings__\n" +
            `${star}Admin role: ${admin ? `<@&${admin}>` : "None"}\n` +
            `${star}Mod role: ${mod ? `<@&${mod}>` : "None"}\n` +
            `${star}Mute role: ${mute ? `<@&${mute}>` : "None"}\n` +
            `${star}Restricted role: ${restrict ? `<@&${restrict}>` : "None"}\n` +
            `${star}Warn One role: ${warnOne ? `<@&${warnOne}>` : "None"}\n` +
            `${star}Warn Two role: ${warnTwo ? `<@&${warnTwo}>` : "None"}\n` +
            `${star}Warn Threshold: **${warnThresh}**\n` +
            `${star}Warn Penalty: **${warnPen ? warnPen : "none"}**\n` +
            `${star}Ascii names are **${ascii}**\n` +
            "\n" +
            "__Edit Settings__\n" +
            `${star}Type **ascii** to toggle ascii names on/off.\n` +
            `${star}Type **any number** to set the warning threshold.\n` +
            `${star}Type **ban**, **kick**, **mute**, or **none** to set the warn penalty.\n` +
            `${star}**Mention a role or type a role id** to set the admin role.\n` +
            `${star}Do the same **between exclamation points !role!** to set the mod role.\n` +
            `${star}Do the same **between hashtags #role#** to set the mute role.\n` +
            `${star}Do the same **between dollar signs $role$** to set the restricted role.\n` +
            `${star}Do the same **between parentheses (role)** to set the role for warn one.\n` +
            `${star}Do the same **between brackets [role]** to set the role for warn two.\n` +
            `${star}**Type multiple settings** to set them at once.\n` +
            `${star}Type **reset** to reset settings.\n` +
            `${star}Type **cancel** to exit.\n`
        )

        message.channel.send(modEmbed)

        async function modPrompt(msg: Message) {
            const ascii = await sql.fetchColumn("blocks", "ascii name toggle")
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Moderator Settings** ${discord.getEmoji("karenAnger")}`)
            let [setAscii, setMute, setRestrict, setWarnOne, setWarnTwo, setWarnPenalty, setWarnThreshold, setAdmin, setMod] = [] as boolean[]
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${star}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("blocks", "ascii name toggle", "off")
                await sql.updateColumn("special roles", "mute role", null)
                await sql.updateColumn("special roles", "restricted role", null)
                await sql.updateColumn("special roles", "warn one", null)
                await sql.updateColumn("special roles", "warn one", null)
                await sql.updateColumn("warns", "warn penalty", "none")
                await sql.updateColumn("warns", "warn threshold", null)
                responseEmbed
                .setDescription(`${star}All settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }
            const newMsg = msg.content.replace(/<@&/g, "").replace(/>/g, "")
            const adminRole = newMsg.replace(/\s+\d\s+/, "").replace(/\s+/g, "").replace(/(?<=\$)(.*?)(?=\$)/g, "").replace(/(?<=\()(.*?)(?=\))/g, "")
            .replace(/(?<=!)(.*?)(?=!)/g, "").replace(/(?<=#)(.*?)(?=#)/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "").match(/\d+/g)
            const modRole = newMsg.replace(/\s+/g, "").match(/(?<=!)(.*?)(?=!)/g)
            const muteRole = newMsg.replace(/\s+/g, "").match(/(?<=#)(.*?)(?=#)/g)
            const restrictRole = newMsg.replace(/\s+/g, "").match(/(?<=\$)(.*?)(?=\$)/g)
            const warnOneRole = newMsg.replace(/\s+/g, "").match(/(?<=\()(.*?)(?=\))/g)
            const warnTwoRole = newMsg.replace(/\s+/g, "").match(/(?<=\[)(.*?)(?=\])/g)
            const warnPenalty = newMsg.match(/ban/gi) || newMsg.match(/kick/gi) || newMsg.match(/mute/gi) || newMsg.match(/none/gi)
            const warnThreshold = newMsg.match(/\s\d\s+/)
            if (msg.content.match(/ascii/gi)) setAscii = true
            if (adminRole) setAdmin = true
            if (modRole) setMod = true
            if (muteRole) setMute = true
            if (restrictRole) setRestrict = true
            if (warnOneRole) setWarnOne = true
            if (warnTwoRole) setWarnTwo = true
            if (warnPenalty) setWarnPenalty = true
            if (warnThreshold) setWarnThreshold = true

            let description = ""

            if (setAscii) {
                if (String(ascii) === "off") {
                    await sql.updateColumn("blocks", "ascii name toggle", "on")
                    description += `${star}Ascii names are **on**!\n`
                } else {
                    await sql.updateColumn("blocks", "ascii name toggle", "off")
                    description += `${star}Ascii names are **off**!\n`
                }
            }

            if (setAdmin) {
                await sql.updateColumn("special roles", "admin role", String(adminRole!))
                description += `${star}Admin role set to <@&${adminRole!}>!\n`
            }

            if (setMod) {
                await sql.updateColumn("special roles", "mod role", String(modRole!))
                description += `${star}Mod role set to <@&${modRole!}>!\n`
            }

            if (setMute) {
                await sql.updateColumn("special roles", "mute role", String(muteRole!))
                description += `${star}Mute role set to <@&${muteRole!}>!\n`
            }

            if (setRestrict) {
                await sql.updateColumn("special roles", "restricted role", String(restrictRole!))
                description += `${star}Restricted role set to <@&${restrictRole!}>!\n`
            }

            if (setWarnOne) {
                await sql.updateColumn("special roles", "warn one", String(warnOneRole!))
                description += `${star}Warn one role set to <@&${warnOneRole!}>!\n`
            }

            if (setWarnTwo) {
                await sql.updateColumn("special roles", "warn two", String(warnTwoRole!))
                description += `${star}Warn two role set to <@&${warnTwoRole!}>!\n`
            }

            if (setWarnThreshold) {
                await sql.updateColumn("warns", "warn threshold", String(warnThreshold!))
                description += `${star}Warn threshold set to **${warnThreshold!}**!\n`
            }

            if (setWarnPenalty) {
                await sql.updateColumn("warns", "warn penalty", String(warnPenalty!))
                description += `${star}Warn penalty set to **${warnPenalty!}**!\n`
            }

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return

        }

        embeds.createPrompt(modPrompt)
    }
}
