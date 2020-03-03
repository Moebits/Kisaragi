import {GuildMember, Message, Role} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Warn extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gives users a warning.",
            guildOnly: true,
            aliases: [],
            cooldown: 3
        })
    }

    public checkWarns = async (discord: Kisaragi, message: Message, embeds: Embeds, sql: SQLQuery, warnLog: any, userID: any, warnThreshold: string[], warnPenalty: string[], warnOneRole: any, warnTwoRole: any) => {
        const member = message.guild!.members.cache.find((m: GuildMember) => m.id === userID)
        const warnReason = `Exceeded the threshold of ${warnThreshold[0]} warns.`
        const dmEmbed = embeds.createEmbed()
        const guildEmbed = embeds.createEmbed()
        const dm = await member!.createDM()
        for (let i = 0; i < warnLog.length; i++) {
            if (typeof warnLog[i] === "string") warnLog[i] = JSON.parse(warnLog[i])
            if (warnLog[i].user === userID) {
                if (warnLog[i].warns.length >= 1) {
                    if (warnOneRole) {
                        if (!member!.roles.cache.has(warnOneRole.id)) {
                            await member!.roles.add(warnOneRole)
                            message.channel.send(
                                `<@${userID}>, you were given the ${warnOneRole} role because you have one warn.`
                            )
                        }
                    }
                }
                if (warnLog[i].warns.length >= 2) {
                    if (warnTwoRole) {
                        if (!member!.roles.cache.has(warnTwoRole.id)) {
                            await member!.roles.add(warnTwoRole)
                            message.channel.send(
                                `<@${userID}>, you were given the ${warnTwoRole} role because you have two warns.`
                            )
                        }
                    }
                }
                if (warnLog[i].warns.length >= parseInt(warnThreshold[0], 10)) {
                    switch (warnPenalty[0].toLowerCase().trim()) {
                        case "ban":
                            dmEmbed
                            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were banned from ${message.guild!.name} for reason:_ **${warnReason}**`)
                            try {
                                await dm.send(dmEmbed)
                            } catch (err) {
                                console.log(err)
                            }
                            guildEmbed
                            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                            .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${userID}> for reason:_ **${warnReason}**`)
                            await member!.ban({reason: warnReason})
                            message.channel.send(guildEmbed)
                            break
                        case "kick":
                            dmEmbed
                            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                            .setTitle(`**You Were Kicked** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were kicked from ${message.guild!.name} for reason:_ **${warnReason}**`)
                            try {
                                await dm.send(dmEmbed)
                            } catch (err) {
                                console.log(err)
                            }
                            guildEmbed
                            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                            .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully kicked <@${userID}> for reason:_ **${warnReason}**`)
                            await member!.kick(warnReason)
                            message.channel.send(guildEmbed)
                            break
                        case "mute":
                            const mute = await sql.fetchColumn("special roles", "mute role")
                            if (!mute) {
                                message.reply(`Failed to mute <@${userID}>. You do not have a mute role set!`)
                                return false
                            }
                            await member!.roles.add(mute.join(""))
                            dmEmbed
                            .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                            .setTitle(`**You Were Muted** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were muted from ${message.guild!.name} for reason:_ **${warnReason}**`)
                            try {
                                await dm.send(dmEmbed)
                            } catch (err) {
                                console.log(err)
                            }
                            guildEmbed
                            .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                            .setTitle(`**Member Muted** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully muted <@${userID}> for reason:_ **${warnReason}**`)
                            await member!.kick(warnReason)
                            message.channel.send(guildEmbed)
                            break
                        default:
                    }
                }
            }
        }
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        if (!await perms.checkMod()) return
        const warnThreshold = await sql.fetchColumn("warns", "warn threshold")
        const warnPenalty = await sql.fetchColumn("warns", "warn penalty")
        const warnOne = await sql.fetchColumn("special roles", "warn one")
        const warnTwo = await sql.fetchColumn("special roles", "warn two")
        let warnLog = await sql.fetchColumn("warns", "warn log") as any
        let setInit = false
        if (!warnLog.join("")) warnLog = [""]; setInit = true

        let warnOneRole, warnTwoRole
        if (warnOne[0]) warnOneRole = message.guild!.roles.cache.find((r: Role) => r.id === warnOne[0])
        if (warnTwo[0]) warnTwoRole = message.guild!.roles.cache.find((r: Role) => r.id === warnTwo[0])

        const reasonArray: string[] = []
        const userArray: string[] = []
        for (let i = 1; i < args.length; i++) {
            if (args[i].match(/\d+/g)) {
                userArray.push(args[i].match(/\d+/g)![0])
            } else {
                reasonArray.push(args[i])
            }
        }

        const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

        for (let i = 0; i < userArray.length; i++) {
            let found = false
            for (let j = 0; j < warnLog.length; j++) {
                warnLog[j] = JSON.parse(warnLog[j])
                if (userArray[i] === warnLog[j].user ? warnLog[j].user.toString() : null) {
                    warnLog[j].warns.push(reason)
                    found = true
                }
            }
            if (!found) {
                warnLog.push(`{"user": "${userArray[i]}", "warns": ["${reason}"]}`)
            }
            for (let j = 0; j < warnLog.length; j++) {
                warnLog[j] = JSON.parse(JSON.stringify(warnLog[j]))
            }
            await this.checkWarns(discord, message, embeds, sql, warnLog, userArray[i], warnThreshold, warnPenalty, warnOneRole, warnTwoRole)
        }

        if (setInit) warnLog = warnLog.filter(Boolean)
        await sql.updateColumn("warns", "warn log", warnLog)

        let users = ""
        for (let i = 0; i < userArray.length; i++) {
            users += `<@${userArray[i]}> `
            const warnDMEmbed = embeds.createEmbed()
            warnDMEmbed
            .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
            .setTitle(`**You Were Warned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(
                `${discord.getEmoji("star")}_You were warned in ${message.guild!.name} for reason: **${reason}**_`
            )
            const member = message.guild!.members.cache.find((m: GuildMember) => m.id === userArray[i])
            const dm = await member!.createDM()
            await dm.send(warnDMEmbed)
        }

        const warnEmbed = embeds.createEmbed()
        warnEmbed
        .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
        .setTitle(`**Member Warned** ${discord.getEmoji("kannaFU")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Successfully warned ${users} for reason: **${reason}**_`
        )
        message.channel.send(warnEmbed)
    }
}
