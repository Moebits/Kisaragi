import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Selfroles extends Command {
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

        // If not admin, only shows the role list.
        if (await perms.checkAdmin(message, true)) {
            let selfroles = await sql.fetchColumn("special roles", "self roles")
            selfroles = JSON.parse(selfroles[0])
            const step = 3.0
            const increment = Math.ceil((selfroles[0] ? selfroles.length : 1) / step)
            const selfArray: MessageEmbed[] = []
            for (let i = 0; i < increment; i++) {
                let settings = ""
                for (let j = 0; j < step; j++) {
                    if (selfroles[0]) {
                        const value = (i*step)+j
                        if (!selfroles.join("")) settings = "None"
                        if (!selfroles[value]) break
                        settings += `${i + 1} **=>** ` +  `<@&${selfroles[value]}>`
                    } else {
                        settings = "None"
                    }
                }
                const selfEmbed = embeds.createEmbed()
                selfEmbed
                .setTitle(`**Self Role List** ${discord.getEmoji("karenSugoi")}`)
                .setThumbnail(message.guild!.iconURL() as string)
                .setDescription(
                    settings + "\n"
                )
                selfArray.push(selfEmbed)
            }

            if (selfArray.length > 1) {
                embeds.createReactionEmbed(selfArray)
            } else {
                message.channel.send(selfArray[0])
            }
            return
        }

        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            selfPrompt(message)
            return
        }

        let selfroles = await sql.fetchColumn("special roles", "self roles")
        selfroles = JSON.parse(selfroles[0])
        const step = 3.0
        const increment = Math.ceil((selfroles[0] ? selfroles.length : 1) / step)
        const selfArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            let settings = ""
            for (let j = 0; j < step; j++) {
                if (selfroles[0]) {
                    const value = (i*step)+j
                    if (!selfroles.join("")) settings = "None"
                    if (!selfroles[value]) break
                    settings += `${i + 1} **=>** ` +  `<@&${selfroles[value]}>`
                } else {
                    settings = "None"
                }
            }
            const selfEmbed = embeds.createEmbed()
            selfEmbed
            .setTitle(`**Self Role Settings** ${discord.getEmoji("karenSugoi")}`)
            .setThumbnail(message.guild!.iconURL() as string)
            .setDescription(
                `Add and remove self-assignable roles. Users can assign them with the command **selfrole**.\n` +
                "\n" +
                `__Current Settings__\n` +
                settings + "\n" +
                "\n" +
                `__Edit Settings__\n` +
                `${discord.getEmoji("star")}**Mention roles** to add self assignable roles.\n` +
                `${discord.getEmoji("star")}Type **delete (setting number)** to remove a role.\n` +
                `${discord.getEmoji("star")}Type **reset** to delete all roles.\n` +
                `${discord.getEmoji("star")}Type **cancel** to exit.\n`
            )
            selfArray.push(selfEmbed)
        }

        if (selfArray.length > 1) {
            embeds.createReactionEmbed(selfArray)
        } else {
            message.channel.send(selfArray[0])
        }

        async function selfPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Self Role Settings** ${discord.getEmoji("karenSugoi")}`)
            let selfroles = await sql.fetchColumn("special roles", "self roles")
            selfroles = JSON.parse(selfroles[0])
            if (!selfroles[0]) selfroles = []
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("special roles", "self roles", null)
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Self role settings were wiped!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase().includes("delete")) {
                const num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""))
                if (num) {
                    if (selfroles[0] ? selfroles[num - 1] : false) {
                        selfroles[num - 1] = ""
                        selfroles = selfroles.filter(Boolean)
                        await sql.updateColumn("special roles", "selfroles", JSON.stringify(selfroles))
                        responseEmbed
                        .setDescription(`${discord.getEmoji("star")}Setting ${num} was deleted!`)
                        msg.channel.send(responseEmbed)
                        return
                    } else {
                        responseEmbed
                        .setDescription(`${discord.getEmoji("star")}Setting not found!`)
                        msg.channel.send(responseEmbed)
                        return
                    }
                } else {
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}Setting not found!`)
                    msg.channel.send(responseEmbed)
                    return
                }
            }

            let roles = msg.content.replace(/<@&/g, "").replace(/>/g, "").match(/\s?\d+/g)
            roles = roles!.map((r: string) => r.trim())

            let description = ""

            for (let i = 0; i < roles.length; i++) {
                selfroles.push(roles[i])
                description += `${discord.getEmoji("star")}Added <@&${roles[i]}>!\n`
            }

            if (!description) return
            await sql.updateColumn("special roles", "self roles", JSON.stringify(selfroles))

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return

        }

        embeds.createPrompt(selfPrompt)
    }
}
