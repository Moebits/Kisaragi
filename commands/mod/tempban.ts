import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import SQL from "../bot developer/sql"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class TempBan extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Bans a user for the specified period.",
            help:
            `
            _Note: Time is in \`0y 0mo 0w 0d 0h 0m 0s\` format._
            \`tempban @user1 @user2 time reason?\` - tempbans the user(s) with an optional reason
            \`tempban id1 id2 time reason?\` - tempbans by user id instead of mention
            `,
            examples:
            `
            \`=>tempban @user 100y bye\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        if (!await perms.checkMod()) return
        const tempBanEmbed = embeds.createEmbed()
        const reasonArray: string[] = []
        const timeArray: string[] = []
        const userArray: string[] = []

        for (let i = 1; i < args.length; i++) {
            if (args[i].match(/\d{10,}/g)) {
                userArray.push(args[i].match(/\d{10,}/g)![0])
            } else {
                if (/\d+(y|mo|w|d|h|m|s)/gi.test(args[i])) {
                    timeArray.push(args[i])
                } else {
                    reasonArray.push(args[i])
                }
            }
        }
        if (!timeArray[0]) return message.reply(`You must provide a time limit ${discord.getEmoji("kannaFacepalm")}`)
        const rawTime = timeArray.join(" ")
        const seconds = Functions.parseCalenderSeconds(rawTime)

        const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

        const members: string[] = []
        for (let i = 0; i < userArray.length; i++) {
            const user = await discord.users.fetch(userArray[i])
            if (user) {
                members.push(`<@${user.id}>`)
            } else {
                continue
            }
            tempBanEmbed
            .setAuthor({name: "tempban", iconURL: "https://cdn.discordapp.com/emojis/579870079735562261.png"})
            .setTitle(`**You Were Temp Banned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were temp banned from **${message.guild!.name}** for **${rawTime}**, reason:_ **${reason}**`)
            const dm = await user.createDM()
            const id = user.id
            try {
                await message.guild?.members.ban(user, {reason, deleteMessageSeconds: 7 * 24 * 60 * 60})
                const data = {type: "tempban", user: user.id, executor: message.author.id, date: Date.now(), guild: message.guild?.id, reason, time: rawTime, context: message.url}
                discord.emit("caseUpdate", data)
                let tempArr = await SQLQuery.redisGet(`${message.guild?.id}_tempban`)
                tempArr = JSON.parse(tempArr)
                if (!tempArr) tempArr = [] as any
                tempArr.push({member: id, time: seconds*1000, reason})
                await SQLQuery.redisSet(`${message.guild?.id}_tempban`, JSON.stringify(tempArr))
                setInterval(async () => {
                    let newArr = await SQLQuery.redisGet(`${message.guild?.id}_tempban`)
                    newArr = JSON.parse(newArr)
                    if (!newArr) return
                    const index = newArr.findIndex((i: any) => i.member === id)
                    if (index === -1) return
                    const curr = newArr[index]
                    const time = Number(curr.time)-60000
                    if (time <= 0) {
                        await this.message.guild?.members.unban(curr.id, curr.reason).catch(() => null)
                        newArr[index] = null
                        newArr = newArr.filter(Boolean)?.[0] ?? null
                        await SQLQuery.redisSet(`${this.message.guild?.id}_tempban`, newArr)
                        // @ts-expect-error
                        clearInterval()
                        return
                    }
                    newArr[index] = {...curr, time}
                    await SQLQuery.redisSet(`${message.guild?.id}_tempban`, JSON.stringify(newArr))
                }, 60000)
                setTimeout(async () => {
                    await message.guild?.members.unban(id, reason).catch(() => null)
                    const index = tempArr.findIndex((i: any) => i.member === id)
                    if (index === -1) return
                    tempArr[index] = null
                    tempArr = tempArr.filter(Boolean)?.[0] ?? null
                    await SQLQuery.redisSet(`${this.message.guild?.id}_tempban`, tempArr)
                }, seconds*1000)
            } catch (e) {
                console.log(e)
                return message.reply(`I need the **Ban Members** permission ${discord.getEmoji("kannaFacepalm")}`)
            }
            await dm.send({embeds: [tempBanEmbed]}).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        tempBanEmbed
        .setAuthor({name: "tempban", iconURL: "https://cdn.discordapp.com/emojis/579870079735562261.png"})
        .setTitle(`**Member Temp Banned** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully temp banned ${members.join(", ")} for the duration **${rawTime}** for reason:_ **${reason}**`)
        message.channel.send({embeds: [tempBanEmbed]})
        return
    }
}
