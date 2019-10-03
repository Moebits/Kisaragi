import {GuildMember, Message, MessageEmbed, Role} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Warns extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const perms = new Permissions(discord, message)
        const sql = new SQLQuery(message)
        if (await perms.checkMod(message)) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            warnPrompt(message)
            return
        }

        const warnArray: MessageEmbed[] = []
        let warnings = ""
        let warnLog = await sql.fetchColumn("warns", "warn log") as any
        if (!warnLog[0]) warnLog = [""]
        for (let i = 0; i < warnLog.length; i++) {
            if (typeof warnLog[i] === "string") warnLog[i] = JSON.parse(warnLog[i])
            if (warnLog[0] === "") {
                warnings = "None"
            } else {
                for (let j = 0; j < warnLog[i].warns.length; j++) {
                    warnings += `**${j + 1} => **\n` + `${warnLog[i].warns[j]}\n`
                }
            }
            const warnEmbed = embeds.createEmbed()
            const member = message.guild!.members.find((m: GuildMember) => m.id === warnLog[i].user)
            warnEmbed
            .setTitle(`**Warn Log** ${discord.getEmoji("kaosWTF")}`)
            .setThumbnail(message.guild!.iconURL() as string)
            .setDescription(
                `**${member ? `${member.displayName}'s` : "No"} Warns**\n` +
                "__Warns__\n" +
                warnings + "\n" +
                "__Edit Settings__\n" +
                `${discord.getEmoji("star")}**Mention a user** to retrieve their warns.\n` +
                `${discord.getEmoji("star")}**Mention a user and type a number** to remove that warn.\n` +
                `${discord.getEmoji("star")}**Mention a user and type delete** to delete all warns.\n` +
                `${discord.getEmoji("star")}Type **destroy** to delete all warns for every member (no undo).\n` +
                `${discord.getEmoji("star")}Type **cancel** to exit.\n`
            )
            warnArray.push(warnEmbed)
        }

        if (warnArray.length > 1) {
            embeds.createReactionEmbed(warnArray)
        } else {
            message.channel.send(warnArray[0])
        }

        async function warnPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Warn Log** ${discord.getEmoji("kaosWTF")}`)
            const warnOne = await sql.fetchColumn("special roles", "warn one")
            const warnTwo = await sql.fetchColumn("special roles", "warn two")
            if (!warnLog[0]) warnLog = [""]
            let [setUser, setDelete, setPurge] = [] as boolean[]
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }

            const userID = msg.content.match(/(?<=<@)(.*?)(?=>)/g)
            const member = message.guild!.members.find((m: GuildMember) => m.id === userID!.join("")) as GuildMember
            let warnOneRole, warnTwoRole
            if (warnOne[0]) warnOneRole = message.guild!.roles.find((r: Role) => r.id === warnOne[0])
            if (warnTwo[0]) warnTwoRole = message.guild!.roles.find((r: Role) => r.id === warnTwo[0])

            if (member && !msg.content.replace(/(?<=<@)(.*?)(?=>)/g, "").match(/\s+\d/g)) setUser = true
            if (member && msg.content.replace(/(?<=<@)(.*?)(?=>)/g, "").match(/\s+\d/g)) setDelete = true
            if (member && msg.content.match(/delete/gi)) setPurge = true

            if (setPurge) {
                let found = false
                for (let i = 0; i < warnLog[0].length; i++) {
                    if (typeof warnLog[0][i] === "string") warnLog[0][i] = JSON.parse(warnLog[0][i])
                    if (warnLog[0][i].user === member.id) {
                        warnLog[0][i].warns = []
                        await sql.updateColumn("warns", "warn log", warnLog[0])
                        found = true
                        if (warnLog[0][i].warns.length < 1) {
                            if (warnOneRole) {
                                if (member.roles.has(warnOneRole.id)) {
                                    await member.roles.remove(warnOneRole)
                                    message.channel.send(
                                        `<@${userID}>, you were removed from the ${warnOneRole} role because you do not have any warns.`
                                    )
                                }
                            }
                        }
                        if (warnLog[0][i].warns.length < 2) {
                            if (warnTwoRole) {
                                if (member.roles.has(warnTwoRole.id)) {
                                    await member.roles.remove(warnTwoRole)
                                    message.channel.send(
                                        `<@${userID}>, you were removed from the ${warnTwoRole} role because you do not have two warns.`
                                    )
                                }
                            }
                        }
                    }
                }
                if (!found) return msg.reply("That user does not have any warns!")
                responseEmbed
                .setDescription(`Purged all warns from <@${member.id}>!`
                )
                return msg.channel.send(responseEmbed)
            }
            if (setUser) {
                let warns = ""
                let found = false
                for (let i = 0; i < warnLog[0].length; i++) {
                    if (typeof warnLog[0][i] === "string") warnLog[0][i] = JSON.parse(warnLog[0][i])
                    if (warnLog[0][i].user === member.id) {
                        for (let j = 0; j < warnLog[0][i].warns.length; j++) {
                            warns += `**${j + 1} => **\n` + `${warnLog[0][i].warns[j]}\n`
                        }
                        found = true
                    }
                }
                if (!found) return msg.reply("That user does not have any warns!")
                responseEmbed
                .setDescription(
                    `**${member.displayName}'s Warns**\n` +
                    warns + "\n"
                )
                return msg.channel.send(responseEmbed)
            }
            if (setDelete) {
                let num: number = Number(msg.content.replace(/(?<=<@)(.*?)(?=>)/g, "").match(/\s+\d/g)![0])
                num = num - 1
                let found = false
                for (let i = 0; i < warnLog[0].length; i++) {
                    if (typeof warnLog[0][i] === "string") warnLog[0][i] = JSON.parse(warnLog[0][i])
                    if (warnLog[0][i].user === member.id) {
                        if (warnLog[0][i].warns.length > num + 1) return msg.reply("Could not find that warning!")
                        warnLog[0][i].warns[num] = 0
                        warnLog[0][i].warns = warnLog[0][i].warns.filter(Boolean)
                        await sql.updateColumn("warns", "warn log", warnLog[0])
                        found = true
                        if (warnLog[0][i].warns.length < 1) {
                            if (warnOneRole) {
                                if (member.roles.has(warnOneRole.id)) {
                                    await member.roles.remove(warnOneRole)
                                    message.channel.send(
                                        `<@${userID}>, you were removed from the ${warnOneRole} role because you do not have any warns.`
                                    )
                                }
                            }
                        }
                        if (warnLog[0][i].warns.length < 2) {
                            if (warnTwoRole) {
                                if (member.roles.has(warnTwoRole.id)) {
                                    await member.roles.remove(warnTwoRole)
                                    message.channel.send(
                                        `<@${userID}>, you were removed from the ${warnTwoRole} role because you do not have two warns.`
                                    )
                                }
                            }
                        }
                    }
                }
                if (!found) return msg.reply("That user does not have any warns!")
                responseEmbed
                .setDescription(`Deleted warn **${num + 1}** from <@${member.id}>!`
                )
                return msg.channel.send(responseEmbed)
            }

        }

        embeds.createPrompt(warnPrompt)
    }
}
