import {GuildMember, Message, Role} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Warn extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gives users a warning.",
            guildOnly: true,
            help:
            `
            \`warn @user/id reason?\` - Warns the user for the reason
            `,
            examples:
            `
            \`=>warn @user stop spamming\`
            `,
            aliases: [],
            cooldown: 10
        })
    }

    public checkWarns = async (warnLog: any, userID: any, warnThreshold: string, warnPenalty: string, warnOneRole: any, warnTwoRole: any) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const member = message.guild!.members.cache.find((m: GuildMember) => m.id === userID)
        if (!member) return
        const warnReason = `Exceeded the threshold of ${warnThreshold} warns.`
        const dmEmbed = embeds.createEmbed()
        const guildEmbed = embeds.createEmbed()
        const dm = await member.createDM()
        for (let i = 0; i < warnLog.length; i++) {
            if (warnLog[i].user === userID) {
                if (warnLog[i].warns.length >= 1) {
                    if (warnOneRole) {
                        if (!member.roles.cache.has(warnOneRole.id)) {
                            await member.roles.add(warnOneRole)
                            await message.channel.send(`<@${userID}>, you were given the ${warnOneRole} role because you have one warn.`)
                        }
                    }
                }
                if (warnLog[i].warns.length >= 2) {
                    if (warnTwoRole) {
                        if (!member.roles.cache.has(warnTwoRole.id)) {
                            await member.roles.add(warnTwoRole)
                            await message.channel.send(`<@${userID}>, you were given the ${warnTwoRole} role because you have two warns.`)
                        }
                    }
                }
                if (warnLog[i].warns.length >= Number(warnThreshold)) {
                    switch (warnPenalty.toLowerCase().trim()) {
                        case "ban":
                            dmEmbed
                            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were banned from ${message.guild!.name} for reason:_ **${warnReason}**`)
                            await dm.send(dmEmbed).catch(() => null)
                            guildEmbed
                            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                            .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${userID}> for reason:_ **${warnReason}**`)
                            await member?.ban({reason: warnReason})
                            message.channel.send(guildEmbed)
                            break
                        case "kick":
                            dmEmbed
                            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                            .setTitle(`**You Were Kicked** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were kicked from ${message.guild!.name} for reason:_ **${warnReason}**`)
                            await dm.send(dmEmbed).catch(() => null)
                            guildEmbed
                            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                            .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully kicked <@${userID}> for reason:_ **${warnReason}**`)
                            await member?.kick(warnReason).catch(() => null)
                            message.channel.send(guildEmbed)
                            break
                        case "mute":
                            const mute = await sql.fetchColumn("special roles", "mute role")
                            if (!mute) {
                                message.reply(`Failed to mute <@${userID}>. You do not have a mute role set!`)
                                return false
                            }
                            await member?.roles.add(mute)
                            dmEmbed
                            .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                            .setTitle(`**You Were Muted** ${discord.getEmoji("sagiriBleh")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were muted from ${message.guild!.name} for reason:_ **${warnReason}**`)
                            await dm.send(dmEmbed).catch(() => null)
                            guildEmbed
                            .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                            .setTitle(`**Member Muted** ${discord.getEmoji("sagiriBleh")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully muted <@${userID}> for reason:_ **${warnReason}**`)
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
        if (!warnLog) warnLog = []

        let warnOneRole, warnTwoRole
        if (warnOne) warnOneRole = message.guild!.roles.cache.find((r: Role) => r.id === warnOne)
        if (warnTwo) warnTwoRole = message.guild!.roles.cache.find((r: Role) => r.id === warnTwo)

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
        const modLog = await sql.fetchColumn("logs", "mod log")

        for (let i = 0; i < userArray.length; i++) {
            const hash = Functions.randomString(16)
            const data = {type: "warn", reason, hash, user: userArray[i], date: Date.now(), executor: message.author.id, executorTag: message.author.tag, guild: message.guild?.id}
            let found = false
            for (let j = 0; j < warnLog.length; j++) {
                if (!warnLog[j]) break
                warnLog[j] = JSON.parse(warnLog[j])
                if (userArray[i] === warnLog[j].user) {
                    warnLog[j].warns.push(data)
                    found = true
                }
            }
            if (!found) {
                warnLog.push({user: `${userArray[i]}`, warns: [data]})
            }
            if (modLog) discord.emit("caseUpdate", data)
            await this.checkWarns(warnLog, userArray[i], warnThreshold, warnPenalty, warnOneRole, warnTwoRole)
        }

        await sql.updateColumn("warns", "warn log", warnLog)

        let users = ""
        for (let i = 0; i < userArray.length; i++) {
            users += `<@${userArray[i]}> `
            const warnDMEmbed = embeds.createEmbed()
            warnDMEmbed
            .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
            .setTitle(`**You Were Warned** ${discord.getEmoji("raphi")}`)
            .setDescription(
                `${discord.getEmoji("star")}_You were warned in ${message.guild!.name} for reason: **${reason}**_`
            )
            const member = message.guild!.members.cache.find((m: GuildMember) => m.id === userArray[i])
            try {
                await member?.send(warnDMEmbed)
            } catch {
                continue
            }
        }

        const warnEmbed = embeds.createEmbed()
        warnEmbed
        .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
        .setTitle(`**Member Warned** ${discord.getEmoji("raphi")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Successfully warned ${users} for reason: **${reason}**_`
        )
        message.channel.send(warnEmbed)
    }
}
