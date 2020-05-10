import {Message, MessageEmbed} from "discord.js"
import nmap from "node-nmap"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Nmap extends Command {
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Scans a network using nmap.",
            help:
            `
            \`nmap host/ip\` - Scans the network
            `,
            examples:
            `
            \`=>nmap google.com\`
            `,
            aliases: [],
            cooldown: 10,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const text = Functions.combineArgs(args, 1)
        if (!text) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("nmap", "https://miro.medium.com/max/450/1*e0PvOyJqlUEGd8h3WHWEnA.jpeg", "https://nmap.org/")
            .setTitle(`**Nmap Scan** ${discord.getEmoji("kannaSpook")}`), "You must specify a host name or ip address.")
        }
        if (/127.0.0.1|localhost/gi.test(text) && message.author.id !== process.env.OWNER_ID) {
            return message.reply(`Nice try, hackerman ${discord.getEmoji("kannaFU")}`)
        }
        const quickscan = new nmap.NmapScan(text)

        let data = "" as any
        quickscan.startScan()
        await new Promise((resolve) => {
            quickscan.on("complete", (d: any) => {
                data = d
                resolve()
            })
            quickscan.on("error", (err: Error) => {
                console.log(err)
                return this.invalidQuery(embeds.createEmbed()
                .setAuthor("nmap", "https://miro.medium.com/max/450/1*e0PvOyJqlUEGd8h3WHWEnA.jpeg", "https://nmap.org/")
                .setTitle(`**Nmap Scan** ${discord.getEmoji("kannaSpook")}`))
            })
        })
        const nmapArray: MessageEmbed[] = []
        for (let i = 0; i < data.length; i++) {
            const info = data[i]
            if (!info.hostname) continue
            const ports = info.openPorts ? "\n" + info.openPorts.map((p: any) => {
                return `_Port_: **${p.port}**\n` +
                `_Service:_ **${p.service}**\n`
            }).join("") : "None"
            const nmapEmbed = embeds.createEmbed()
            nmapEmbed
            .setAuthor("nmap", "https://miro.medium.com/max/450/1*e0PvOyJqlUEGd8h3WHWEnA.jpeg", "https://nmap.org/")
            .setTitle(`**Nmap Scan** ${discord.getEmoji("kannaSpook")}`)
            .setURL(`https://${info.hostname}`)
            .setDescription(
                `${discord.getEmoji("star")}_Hostname:_ **${info.hostname}**\n` +
                `${discord.getEmoji("star")}_IP Address:_ **${info.ip}**\n` +
                `${discord.getEmoji("star")}_Mac Address:_ ${info.mac ? `**${info.mac}**` : "Unavailable"}\n` +
                `${discord.getEmoji("star")}_OS:_ ${info.osNmap ? `**${info.osNmap}**` : "Unavailable"}\n` +
                `${discord.getEmoji("star")}_Open Ports:_ ${ports}\n`
            )
            nmapArray.push(nmapEmbed)
        }

        if (nmapArray.length === 1) {
            message.channel.send(nmapArray[0])
        } else {
            embeds.createReactionEmbed(nmapArray)
        }
    }
}
