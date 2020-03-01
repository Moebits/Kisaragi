import {Message} from "discord.js"
import {Command} from "./../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Config extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures bot settings.",
            help:
            `
            \`config\` - Shows the config prompt.
            \`config default/random/#hexcolor\` - Sets the colors of the embeds
            \`config role/perm\` - Checks permissions with mod/admin roles or discord permissions (eg. ban members)
            \`config reset\` - Resets settings to the default
            `,
            examples:
            `
            \`=>config default role\`
            \`=>config reset\`
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
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        if (!await perms.checkAdmin()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            configPrompt(message)
            return
        }

        const color = await sql.fetchColumn("config", "embed colors")
        const permCheck = await sql.fetchColumn("config", "permissions")
        const configEmbed = embeds.createEmbed()
        configEmbed
        .setTitle(`**Bot Config Settings** ${discord.getEmoji("gabStare")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .setDescription(Functions.multiTrim(`
        Configure bot settings.
        newline
        __Current Settings__
        ${star}Embed color set to **${color}**
        ${star}Permission checks set to **${permCheck}**
        newline
        __Edit Settings__
        ${star}Type **default/random** or a **hexcolor** to set the embed color.
        ${star}Type **role/perm** to set how permissions are checked.
        ${star}Type **multiple settings** to set them at once.
        ${star}Type **reset** to delete all settings.
        ${star}Type **cancel** to exit.
        `
        ))

        message.channel.send(configEmbed)

        async function configPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Bot Config Settings** ${discord.getEmoji("gabStare")}`)
            let [setColor, setPerm] = [] as boolean[]

            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${star}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("config", "embed colors", "default")
                await sql.updateColumn("config", "permissions", "role")
                responseEmbed
                .setDescription(`${star}All settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }

            const newColor = (msg.content.match(/default/gi) || msg.content.match(/random/gi) ||
            msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig))
            const newPerm = (msg.content.match(/role/gi) || msg.content.match(/perm/gi))

            if (newColor) setColor = true
            if (newPerm) setPerm = true

            let description = ""

            if (setColor) {
                await sql.updateColumn("config", "embed colors", String(newColor))
                description += `${star}Embed color set to **${newColor}!**\n`
            }

            if (setPerm) {
                await sql.updateColumn("config", "permissions", String(newPerm))
                description += `${star}Permission check set to **${newPerm}!**\n`
            }

            if (!description) description = `${star}Invalid arguments provided, canceled the prompt.`
            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }
        embeds.createPrompt(configPrompt)
    }
}
