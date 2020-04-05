import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Permission} from "../../structures/Permission"
import * as config from "./../../config.json"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Oauth2 extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Authorize Kisaragi with additional permissions for more features!",
            help:
            `
            _Note: The data is only used for commands requiring oauth2. You can delete it at any point._
            \`oauth2\` - Follow the url and click on "Authorize" to authorize the bot
            \`oauth2 delete\` - Revokes your oauth token and deletes your oauth2 data
            `,
            examples:
            `
            \`=>oauth2\`
            \`=>oauth2 delete\`
            `,
            guildOnly: true,
            aliases: ["authorize"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (args[1] === "delete") {
            await SQLQuery.revokeOuath2(message.author.id)
            const oauth2Embed = embeds.createEmbed()
            oauth2Embed
            .setAuthor("oauth2", "https://cdn.auth0.com/blog/guide-to-oauth2/logo.png")
            .setTitle(`**Oauth2** ${discord.getEmoji("gabYes")}`)
            .setDescription(`${discord.getEmoji("star")}Revoked your oauth token!`)
            return message.channel.send(oauth2Embed)
        }

        const url = config.testing === "on" ? config.oauth2Testing : config.oauth2
        const oauth2Embed = embeds.createEmbed()
        oauth2Embed
        .setAuthor("oauth2", "https://cdn.auth0.com/blog/guide-to-oauth2/logo.png")
        .setTitle(`**Oauth2** ${discord.getEmoji("gabYes")}`)
        .setDescription(`${discord.getEmoji("star")}Authorize Kisaragi Bot [**here**](${url}) to allow you to use oauth2 related commands (ex. Sending you email, adding you to a guild, creating a group dm).`)
        return message.channel.send(oauth2Embed)
    }
}
