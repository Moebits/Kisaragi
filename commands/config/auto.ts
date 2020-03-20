import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Auto extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures auto command settings (disabled).",
            help:
            `
            \`auto\` - Shows the auto settings prompt.
            \`auto cmd? #channel? num?\` - Sets the command, channel, and frequency (in hours).
            \`auto toggle setting\` - Turns a setting on or off.
            \`auto edit setting cmd? #channel? num?\` - Edits an existing setting.
            \`auto delete setting\` - Deletes a setting.
            \`auto reset\` - Resets all settings.
            `,
            examples:
            `
            \`=>auto holiday #holidays 24\`
            \`=>auto edit 1 #newchannel 12\`
            \`=>auto delete 1\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        return message.reply("This command is disabled for the time being...")
        if (!await perms.checkAdmin()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            autoPrompt(message)
            return
        }

        const command = await sql.fetchColumn("auto", "command")
        const channel = await sql.fetchColumn("auto", "channel")
        const frequency = await sql.fetchColumn("auto", "frequency")
        const toggle = await sql.fetchColumn("auto", "toggle")
        const step = 3.0
        const increment = Math.ceil((command ? command.length : 1) / step)
        const autoArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            let settings = ""
            for (let j = 0; j < step; j++) {
                if (command) {
                    const value = (i*step)+j
                    if (!command.join("")) settings = "None"
                    if (!command[value]) break
                    settings += `${i + 1} **=>**\n` +
                    `${discord.getEmoji("star")}_Command:_ **${command[i] !== "0" ? command[i] : "None"}**\n`+
                    `${discord.getEmoji("star")}_Channel:_ **${channel[i] !== "0" ? "<#" + channel[i] + ">" : "None"}**\n`+
                    `${discord.getEmoji("star")}_Frequency:_ **${frequency[i] !== "0" ? frequency[i] : "None"}**\n` +
                    `${discord.getEmoji("star")}_State:_ **${toggle[i]}**\n`
                } else {
                    settings = "None"
                }
            }
            const autoEmbed = embeds.createEmbed()
            autoEmbed
            .setTitle(`**Auto Commands** ${discord.getEmoji("think")}`)
            .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
            .setDescription(Functions.multiTrim(`
            Configure settings for auto commands. You can set up a maximum of 10 auto commands.
            newline
            **Frequency** = How often the command will run, in hours.
            **State** = Active (on) or Inactive (off).
            newline
            __Current Settings:__
            ${settings}
            newline
            __Edit Settings:__
            ${discord.getEmoji("star")}_Type **any command** to set the command._
            ${discord.getEmoji("star")}_**Mention any channel** to set the channel._
            ${discord.getEmoji("star")}_Type **any number** to set the frequency._
            ${discord.getEmoji("star")}_You can set **multiple options at once**._
            ${discord.getEmoji("star")}_Type **toggle (setting number)** to toggle the state._
            ${discord.getEmoji("star")}_Type **edit (setting number)** to edit a setting._
            ${discord.getEmoji("star")}_Type **delete (setting number)** to delete a setting._
            ${discord.getEmoji("star")}_Type **reset** to delete all settings._
            ${discord.getEmoji("star")}_Type **cancel** to exit._
            `))
            autoArray.push(autoEmbed)
        }

        if (autoArray.length > 1) {
            embeds.createReactionEmbed(autoArray)
        } else {
            message.channel.send(autoArray)
        }

        async function autoPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Auto Commands** ${discord.getEmoji("think")}`)
            let [setCmd, setChannel, setFreq, setInit] = [] as boolean[]
            let cmd = await sql.fetchColumn("auto", "command")
            let chan = await sql.fetchColumn("auto", "channel")
            let freq = await sql.fetchColumn("auto", "frequency")
            let tog = await sql.fetchColumn("auto", "toggle")
            const tim = await sql.fetchColumn("auto", "timeout")
            if (!cmd) cmd = [""]; setInit = true
            if (!chan) chan = [""]; setInit = true
            if (!freq) freq = [""]; setInit = true
            if (!tog) tog = [""]; setInit = true
            if (msg.content.toLowerCase().startsWith("delete")) {
                const newMsg = Number(msg.content.replace(/delete/g, "").trim())
                const num = newMsg - 1
                if (newMsg) {
                        cmd[num] = ""
                        chan[num] = ""
                        freq[num] = ""
                        tog[num] = ""
                        tim[num] = ""
                        const arrCmd = cmd.filter(Boolean)
                        const arrChan = chan.filter(Boolean)
                        const arrFreq = freq.filter(Boolean)
                        const arrTog = tog.filter(Boolean)
                        const arrTim = tim.filter(Boolean)
                        await sql.updateColumn("auto", "command", arrCmd)
                        await sql.updateColumn("auto", "channel", arrChan)
                        await sql.updateColumn("auto", "frequency", arrFreq)
                        await sql.updateColumn("auto", "toggle", arrTog)
                        await sql.updateColumn("auto", "timeout", arrTim)
                        return msg.channel.send(responseEmbed.setDescription(`Setting **${newMsg}** was deleted!`))
                } else {
                    return msg.channel.send(responseEmbed.setDescription("Setting not found!"))
                }
            }
            if (msg.content.toLowerCase().startsWith("toggle")) {
                const newMsg = Number(msg.content.replace(/toggle/g, "").trim())
                const num = newMsg - 1
                const testCmd = await sql.fetchColumn("auto", "command")
                const testChan = await sql.fetchColumn("auto", "channel")
                const testFreq = await sql.fetchColumn("auto", "frequency")
                if (newMsg && testCmd && testChan && testFreq) {
                        if (tog[num] === "inactive") {
                            await sql.updateColumn("auto", "toggle", "active")
                            return msg.channel.send(responseEmbed.setDescription(`State of setting **${newMsg}** is now **active**!`))
                        } else {
                            await sql.updateColumn("auto", "toggle", "inactive")
                            return msg.channel.send(responseEmbed.setDescription(`State of setting **${newMsg}** is now **inactive**!`))
                        }
                } else {
                    return msg.channel.send(responseEmbed.setDescription("You cannot use the toggle command on an unfinished setting!"))
                }
            }
            if (msg.content.toLowerCase().startsWith("edit")) {
                const newMsg = msg.content.replace(/edit/g, "").trim().split(" ")
                const tempMsg = newMsg.slice(1).join(" ")
                const num = Number(newMsg) - 1
                if (tempMsg) {
                    const tempCmd = tempMsg.match(/\D+/gi) ? tempMsg.match(/\D+/gi)!.join("").replace(/<#/g, "").replace(/>/g, "").trim() : null
                    const tempChan = tempMsg.match(/<#\d+>/g) ? tempMsg.match(/<#\d+>/g)!.join("").replace(/<#/g, "").replace(/>/g, "") : null
                    const tempReChan = new RegExp(tempChan!, "g")
                    const tempFreq = tempMsg.replace(/\D+/gi, "").replace(tempReChan, "").replace(/\s+/g, "")
                    let editDesc = ""
                    if (tempCmd) {
                        cmd[num] = tempCmd
                        await sql.updateColumn("auto", "command", String(cmd))
                        editDesc += `${discord.getEmoji("star")}Command set to **${tempCmd}**!\n`
                    }
                    if (tempChan) {
                        chan[num] = tempChan
                        await sql.updateColumn("auto", "channel", String(chan))
                        editDesc += `${discord.getEmoji("star")}Channel set to **${tempChan}**!\n`
                    }
                    if (tempFreq) {
                        freq[num] = tempFreq
                        await sql.updateColumn("auto", "frequency", String(freq))
                        editDesc += `${discord.getEmoji("star")}Command set to **${tempFreq}**!\n`
                    }
                    tim[num] = ""
                    await sql.updateColumn("auto", "timeout", String(tim))
                    const testCmd = await sql.fetchColumn("auto", "command")
                    const testChan = await sql.fetchColumn("auto", "channel")
                    const testFreq = await sql.fetchColumn("auto", "frequency")
                    if (testCmd[num] && testChan[num] && testFreq[num]) {
                        tog[num] = "active"
                        await sql.updateColumn("auto", "toggle", String(tog))
                        editDesc += `${discord.getEmoji("star")}This setting is **active**!\n`
                    } else {
                        tog[num] = "inactive"
                        await sql.updateColumn("auto", "toggle", String(tog))
                        editDesc += `${discord.getEmoji("star")}This setting is **inactive**!\n`
                    }
                    return msg.channel.send(responseEmbed.setDescription(editDesc))
                } else {
                    return msg.channel.send(responseEmbed.setDescription("No edits specified!"))
                }
            }
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("auto", "command", null)
                await sql.updateColumn("auto", "channel", null)
                await sql.updateColumn("auto", "frequency", null)
                await sql.updateColumn("auto", "toggle", null)
                await sql.updateColumn("auto", "timeout", null)
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Auto settings were wiped!`)
                msg.channel.send(responseEmbed)
                return
            }

            const newCmd = msg.content.match(/\D+/gi)!.join("").replace(/<#/g, "").replace(/>/g, "").trim()
            const newChan = msg.content.match(/<#\d+>/g)!.join("").replace(/<#/g, "").replace(/>/g, "")
            const reChan = new RegExp(newChan, "g")
            const newFreq = msg.content.replace(/\D+/gi, "").replace(reChan, "").replace(/\s+/g, "")
            if (newCmd) setCmd = true
            if (newChan) setChannel = true
            if (newFreq) setFreq = true

            let description = ""

            if (setCmd) {
                if (cmd.length === 10) {
                    return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"))
                } else {
                    cmd.push(newCmd)
                    const arrCmd = cmd.filter(Boolean)
                    await sql.updateColumn("auto", "command", String(arrCmd))
                    description += `${discord.getEmoji("star")}Command set to **${newCmd}**!\n`
                }
            }

            if (setChannel) {
                if (cmd.length === 10) {
                    return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"))
                } else {
                    chan.push(newChan)
                    const arrChan = chan.filter(Boolean)
                    await sql.updateColumn("auto", "channel", String(arrChan))
                    description += `${discord.getEmoji("star")}Channel set to <#${newChan}>!\n`
                }
            }

            if (setFreq) {
                if (cmd.length === 10) {
                    return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"))
                } else {
                    freq.push(newFreq)
                    const arrFreq = freq.filter(Boolean)
                    await sql.updateColumn("auto", "frequency", String(arrFreq))
                    description += `${discord.getEmoji("star")}Frequency set to **${newFreq}**!\n`
                }
            }

            if (!setCmd) {
                if (setInit) cmd = cmd.filter(Boolean)
                cmd.push("")
                await sql.updateColumn("auto", "command", String(cmd))
            }
            if (!setChannel) {
                if (setInit) chan = chan.filter(Boolean)
                chan.push("")
                await sql.updateColumn("auto", "command", String(chan))
            }
            if (!setFreq) {
                if (setInit) freq = freq.filter(Boolean)
                freq.push("")
                await sql.updateColumn("auto", "command", String(freq))
            }

            if (setCmd && setChannel && setFreq) {
                tog = tog.filter(Boolean)
                tog.push("active")
                await sql.updateColumn("auto", "toggle", String(tog))
                description += `${discord.getEmoji("star")}This setting is **active**!\n`
            } else {
                tog = tog.filter(Boolean)
                tog.push("inactive")
                await sql.updateColumn("auto", "toggle", String(tog))
                description += `${discord.getEmoji("star")}This setting is **inactive**!\n`
            }

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return

        }

        embeds.createPrompt(autoPrompt)
    }
}
