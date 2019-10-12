import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class DetectChannels extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const star = discord.getEmoji("star")
        if (!await perms.checkAdmin()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            detectPrompt(message)
            return
        }

        const ignored = await sql.fetchColumn("detection", "ignored")
        const step = 5.0
        const increment = Math.ceil((ignored[0] ? ignored[0].length : 1) / step)
        const detectArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            let description = ""
            for (let j = 0; j < step; j++) {
                if (ignored[0]) {
                    const value = (i*step)+j
                    if (!ignored[0][value]) break
                    description += `**${value + 1} =>**\n` +
                    `${star}Channel: ${ignored[0] ? (ignored[0][value] ? `<#${ignored[0][value]}>` : "None") : "None"}\n`
                } else {
                    description = "None"
                }
            }
            const detectEmbed = embeds.createEmbed()
            detectEmbed
            .setTitle(`**Ignored Detection Channels** ${discord.getEmoji("kisaragibawls")}`)
            .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
            .setDescription(
                "Channels in this list will be exempt from anime detection.\n" +
                "\n" +
                "__Current Settings__\n" +
                description + "\n" +
                "\n" +
                "__Edit Settings__\n" +
                `${star}**Mention channels** to add channels.\n` +
                `${star}Type **reset** to delete all settings.\n` +
                `${star}Type **cancel** to exit.\n`
            )
            detectArray.push(detectEmbed)
        }

        if (detectArray.length > 1) {
            embeds.createReactionEmbed(detectArray)
        } else {
            message.channel.send(detectArray[0])
        }

        async function detectPrompt(msg: Message) {
            let dIgnored = await sql.fetchColumn("detection", "ignored")
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Ignored Detection Channels** ${discord.getEmoji("kisaragibawls")}`)
            let setInit = false
            if (!dIgnored[0]) dIgnored = [""]; setInit = true
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${star}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("detection", "ignored", null)
                responseEmbed
                .setDescription(`${star}All settings were **reset**!`)
                msg.channel.send(responseEmbed)
                return
            }

            const newChan = msg.content.match(/(?<=<#)(.*?)(?=>)/g)
            if (!newChan!.join("")) return msg.reply("You did not mention any channels!")

            let description = ""

            for (let i = 0; i < newChan!.length; i++) {
                dIgnored.push(newChan![i])
                if (setInit) dIgnored = dIgnored.filter(Boolean)
                await sql.updateColumn("detection", "ignored", dIgnored)
                description += `${star}Added <#${newChan![i]}>!\n`
            }

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }

        embeds.createPrompt(detectPrompt)
    }
}
