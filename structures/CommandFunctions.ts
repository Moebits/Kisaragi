import {Collection, Message, TextChannel} from "discord.js"
import fs from "fs"
import path from "path"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"

const noCmdCool = new Set()
const topDir = path.basename(__dirname).slice(0, -2) === "ts" ? "../" : ""

export class CommandFunctions {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Run Command
    public runCommand = async (msg: Message, args: string[]) => {
        args = args.filter(Boolean)
        const cmdPath = await this.findCommand(args[0])
        if (!cmdPath) return this.noCommand(args[0])
        const cp = new (require(`${topDir}${cmdPath.slice(0, -3)}`).default)(this.discord, msg)
        return new Promise(async (resolve, reject) => {
            await cp.run(args).then(() => resolve())
            .catch((err: Error) => {
                if (msg) msg.channel.send(this.discord.cmdError(msg, err))
                reject()
            })
        })
    }

    // Auto Command
    public autoCommand = async () => {
        const sql = new SQLQuery(this.message)
        const command = await sql.fetchColumn("auto", "command")
        const channel = await sql.fetchColumn("auto", "channel")
        const frequency = await sql.fetchColumn("auto", "frequency")
        const toggle = await sql.fetchColumn("auto", "toggle")
        if (!command[0]) return
        for (let i = 0; i < command.length; i++) {
            if (toggle[i] === "inactive") continue
            const guildChannel = (this.message.guild!.channels.find((c) => c.id === channel[i])) as TextChannel
            const cmd = command[i].split(" ")
            const timeout = Number(frequency[i]) * 3600000
            const rawTimeLeft = await sql.fetchColumn("auto", "timeout")
            let timeLeft = 0
            if (rawTimeLeft) {
                if (rawTimeLeft[i]) {
                    const remaining = (Date.now() - Number(rawTimeLeft[i])) || 0
                    timeLeft = remaining > timeout ? timeout - (remaining % timeout) : timeout - remaining
                } else {
                    rawTimeLeft[i] = Date.now().toString()
                    await sql.updateColumn("auto", "timeout", rawTimeLeft)
                    timeLeft = 0
                }
            } else {
                const timeoutArray: number[] = []
                timeoutArray.push(Date.now())
                await sql.updateColumn("auto", "timeout", timeoutArray)
                timeLeft = 0
            }
            const guildMsg = await guildChannel.messages.fetch({limit: 1}).then((m) => m.first())
            setInterval(async () => {
                await this.runCommand(guildMsg || this.message, cmd)
                timeLeft = timeout
            }, timeLeft > 0 ? timeLeft : timeout)
        }
    }

    public noCommand = async (input: string) => {
        const sql = new SQLQuery(this.message)
        if (noCmdCool.has(this.message.guild!.id)) return
        const commands = await sql.fetchColumn("commands", "command")
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].includes(input)) {
                noCmdCool.add(this.message.guild!.id)
                setTimeout(() => {noCmdCool.delete(this.message.guild!.id)}, 100000)
                return this.message.reply(`This is not a command! Did you mean **${commands[i]}**?`)

            }
        }
        noCmdCool.add(this.message.guild!.id)
        setTimeout(() => {noCmdCool.delete(this.message.guild!.id)}, 100000)
        return this.message.reply(`This is not a command, type **help** for help!`)
    }

    public findCommand = async (cmd: string) => {
        let cmdPath = await SQLQuery.fetchCommand(cmd, "path")
        loop1:
        if (!cmdPath) {
            const directories = fs.readdirSync(`../commands/`)
            for (let i = 0; i < directories.length; i++) {
                const commands = fs.readdirSync(`../commands/${directories[i]}`)
                for (let j = 0; j < commands.length; j++) {
                    commands[j] = commands[j].slice(0, -3)
                    if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                    const cmdClass = new (require(`${topDir}../commands/${directories[i]}/${commands[j]}.js`).default)(this.discord, this.message)
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
        if (lastMsg!.embeds[0]) {
            if (test === true) return lastMsg!.embeds[0].description.length as unknown as assertLast
            return lastMsg!.embeds[0].description.includes(String(test)) as unknown as assertLast
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
        if (lastMsg!.embeds[0]) {
            const check = lastMsg!.embeds[0].image ? true : false
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
