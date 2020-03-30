import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"

export default class DetectChannels extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures channels ignored by anime detection.",
            help:
            `
            \`detectignore\` - Opens the detect ignore prompt
            \`detectignore #channel1 #channel2\` - Sets channels that are ignored from anime detection
            \`detectignore reset\` - Deletes all settings
            `,
            examples:
            `
            \`=>detectignore #channel\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkAdmin()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            await detectPrompt(message)
            return
        }

        const ignored = await sql.fetchColumn("detection", "ignored")
        const step = 5.0
        const increment = Math.ceil((ignored ? ignored.length : 1) / step)
        const detectArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            let description = ""
            for (let j = 0; j < step; j++) {
                if (ignored) {
                    const value = (i*step)+j
                    if (!ignored[value]) break
                    description += `**${value + 1} =>**\n` +
                    `${discord.getEmoji("star")}Channel: ${ignored ? (ignored[value] ? `<#${ignored[value]}>` : "None") : "None"}\n`
                } else {
                    description = "None"
                }
            }
            const detectEmbed = embeds.createEmbed()
            detectEmbed
            .setTitle(`**Ignored Detection Channels** ${discord.getEmoji("kisaragibawls")}`)
            .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
            .setDescription(Functions.multiTrim(`
                Channels in this list will be exempt from anime detection.
                newline
                __Current Settings__
                ${description}
                newline
                __Edit Settings__
                ${discord.getEmoji("star")}**Mention channels** to add channels.
                ${discord.getEmoji("star")}Type **reset** to delete all settings.
                ${discord.getEmoji("star")}Type **cancel** to exit.
            `))
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
            if (!dIgnored) dIgnored = [""]; setInit = true
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("detection", "ignored", null)
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}All settings were **reset**!`)
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
                description += `${discord.getEmoji("star")}Added <#${newChan![i]}>!\n`
            }

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }

        await embeds.createPrompt(detectPrompt)
    }
}
