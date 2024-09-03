import {Collection, Message, TextChannel, ChannelType} from "discord.js"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"
import {Command} from "./Command"
import fs from "fs"
import path from "path"

const noCmdCool = new Set()

export class CommandFunctions {
    constructor(private readonly discord: Kisaragi, private readonly message: Message<true>) {}

    // Run Command
    public runCommand = async (msg: Message<true>, args: string[], noMsg?: boolean) => {
        args = args.filter(Boolean)
        const cmdPath = await this.findCommand(args?.[0]) as string
        if (!cmdPath) return this.noCommand(args?.[0], noMsg)
        const cp = new (require(path.join(__dirname, `${cmdPath.slice(0, -3)}`)).default)(this.discord, msg)
        if (cp.options.guildOnly) {
            // @ts-ignore
            if (msg.channel.type === ChannelType.DM) return msg.channel.send(`<@${msg.author.id}>, sorry but you can only use this command in guilds ${this.discord.getEmoji("smugFace")}`)
        }
        let data: any
        await new Promise<void>(async (resolve, reject) => {
            await cp.run(args).then((d: any) => {
                data = d
                resolve()
            })
            .catch((err: Error) => {
                if (msg) msg.channel.send({embeds: [this.discord.cmdError(msg, err)]})
                reject()
            })
        })
        return data
    }

    // Run Command (from Class)
    public runCommandClass = async (cmd: Command, msg: Message<true>, args: string[]) => {
        if (cmd.options.guildOnly) {
            // @ts-ignore
            if (msg.channel.type === ChannelType.DM) return msg.channel.send(`<@${msg.author.id}>, sorry but you can only use this command in guilds ${this.discord.getEmoji("smugFace")}`)
        }
        let data: any
        await new Promise<void>(async (resolve, reject) => {
            await cmd.run(args).then((d: any) => {
                data = d
                resolve()
            })
            .catch((err: Error) => {
                if (msg) msg.channel.send({embeds: [this.discord.cmdError(msg, err)]})
                reject()
            })
        })
        return data
    }

    // Auto Command
    public autoCommand = async () => {
        const sql = new SQLQuery(this.message)
        const command = await sql.fetchColumn("auto", "command")
        if (!command) return
        const channel = await sql.fetchColumn("auto", "channel")
        const frequency = await sql.fetchColumn("auto", "frequency")
        const toggle = await sql.fetchColumn("auto", "toggle")
        for (let i = 0; i < command.length; i++) {
            if (!toggle?.[i] || toggle[i] === "inactive") continue
            const guildChannel = (this.message.guild?.channels.cache.find((c) => c.id === channel[i])) as TextChannel
            if (!guildChannel) return
            const cmd = command[i].split(" ")
            const timeout = Number(frequency[i]) * 3600000
            let rawTimeLeft = await sql.fetchColumn("auto", "timeout")
            if (!rawTimeLeft) rawTimeLeft = []
            let timeLeft = timeout
            if (rawTimeLeft[i]) {
                let remaining = Number(rawTimeLeft[i])
                if (remaining <= 0) remaining = timeout
                timeLeft = remaining
            }
            const guildMsg = await guildChannel.messages.fetch({limit: 1}).then((m) => m.first())
            const update = async () => {
                let newTimeLeft = timeLeft - 60000
                if (newTimeLeft <= 0) newTimeLeft = timeout
                const toggle = await sql.fetchColumn("auto", "toggle")
                if (!toggle?.[i] || toggle?.[i] === "inactive" || newTimeLeft === timeout) return
                rawTimeLeft[i] = newTimeLeft
                await sql.updateColumn("auto", "timeout", rawTimeLeft)
                setTimeout(update, 60000)
            }
            setTimeout(update, 60000)
            const autoRun = async () => {
                if (!toggle?.[i] || toggle?.[i] === "inactive") return
                const msg = guildMsg ?? this.message
                msg.author.id = this.discord.user!.id
                await this.runCommand(msg, cmd, true)
                setTimeout(autoRun, timeout)
            }
            setTimeout(autoRun, timeLeft)
        }
    }

    public noCommand = async (input: string, noMsg?: boolean) => {
        if (noMsg || this.discord.checkMuted(this.message)) return
        if (noCmdCool.has(this.message.guild!.id)) return
        const commands = await SQLQuery.selectColumn("commands", "command")
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].toLowerCase().includes(input.toLowerCase())) {
                noCmdCool.add(this.message.guild!.id)
                setTimeout(() => {noCmdCool.delete(this.message.guild!.id)}, 10000)
                return this.message.reply(`This is not a command! Did you mean **${commands[i]}**?`)
            }
        }
        noCmdCool.add(this.message.guild!.id)
        setTimeout(() => {noCmdCool.delete(this.message.guild!.id)}, 10000)
        return this.message.reply(`This is not a command, type **help** for help!`)
    }

    public findCommand = async (cmd: string) => {
        let cmdPath = await SQLQuery.fetchCommand(cmd, "path")
        loop1:
        if (!cmdPath) {
            const directories = fs.readdirSync(path.join(__dirname, `../commands/`))
            for (let i = 0; i < directories.length; i++) {
                const commands = fs.readdirSync(path.join(__dirname, `../commands/${directories[i]}`))
                for (let j = 0; j < commands.length; j++) {
                    commands[j] = commands[j].slice(0, -3)
                    if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                    const cmdClass = new (require(path.join(__dirname, `../commands/${directories[i]}/${commands[j]}.js`)).default)(this.discord, this.message)
                    const aliases = cmdClass.options.aliases
                    for (let k = 0; k < aliases.length; k++) {
                        if (aliases[k] === cmd) {
                            cmdPath = [`../commands/${directories[i]}/${commands[j]}.js`]
                            break loop1
                        }
                    }
                }
            }
        }
        if (!cmdPath) {
            return false
        } else {
            return String(cmdPath)
        }
    }

    // Assert Last Command Worked
    public assertLast = async <T extends string | boolean>(test: T, timeout?: number): Promise<T extends true ? number : boolean> => {
        type assertLast = Promise<T extends true ? number : boolean>
        if (!timeout) timeout = 20
        await Functions.timeout(timeout)
        const channel = this.message.channel as TextChannel
        if (channel.nsfw === false) await channel.setNSFW(true)
        const lastMsg = await this.message.channel.messages.fetch({limit: 1}).then((c: Collection<string, Message>) => c.first())
        if (lastMsg!.embeds?.[0]) {
            if (test === true) return lastMsg!.embeds?.[0].description!.length as unknown as assertLast
            return lastMsg!.embeds?.[0].description!.includes(String(test)) as unknown as assertLast
        } else {
            if (test === true) return lastMsg!.content.length as unknown as assertLast
            return lastMsg!.content.includes(String(test)) as unknown as assertLast
        }
    }

    // Assert Command only works in NSFW channels
    public assertNSFW = async (cmd: string[], timeout?: number) => {
        if (!timeout) timeout = 20
        const channel = this.message.channel as TextChannel
        await channel.setNSFW(false)
        await this.runCommand(this.message, cmd)
        await Functions.timeout(timeout)
        await channel.setNSFW(true)
        if (await this.assertLast("You can only use this command in NSFW channels!")) {
            return true
        } else {
            return false
        }
    }

    // Assert Command Image
    public assertImage = async (cmd: string[], timeout?: number) => {
        if (!timeout) timeout = 20
        await this.runCommand(this.message, cmd)
        await Functions.timeout(timeout)
        const lastMsg = await this.message.channel.messages.fetch({limit: 1}).then((c: Collection<string, Message>) => c.first())
        if (lastMsg!.embeds?.[0]) {
            const check = lastMsg!.embeds?.[0].image ? true : false
            return check
        } else {
            const check = lastMsg!.attachments.first() ? true : false
            return check
        }
    }

    // Assert that command was rejected
    public assertReject = async (cmd: string[], timeout?: number) => {
        if (!timeout) timeout = 20
        await this.runCommand(this.message, cmd)
        await Functions.timeout(timeout)
        let reject = await this.assertLast("No results were found.")
        if (!reject) reject = await this.assertLast("You must provide a search query.")
        return reject
    }
}
