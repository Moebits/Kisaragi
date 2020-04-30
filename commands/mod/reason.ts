import {GuildChannel, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Reason extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Edits the reason of a case.",
          help:
          `
          _Note: If you enabled the mod log, it should also display the audit log id. For warn reasons, use the \`warns\` command, since this feature is not part of Discord._
          \`reason id reason?\` - Sets the new topic
          `,
          examples:
          `
          \`=>reason [audit log id] being bad\`
          `,
          guildOnly: true,
          aliases: [],
          cooldown: 5,
          unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return

        if (!args[1]) return message.reply(`You need to specify an audit log id ${discord.getEmoji("kannaFacepalm")}`)
        let reason = Functions.combineArgs(args, 2).trim()
        if (!reason) reason = "None provided!"
        const entry = await message.guild?.fetchAuditLogs({before: args[1], limit: 1}).then((a) => a.entries.first())
        if (!entry) return message.reply(`Could not find this audit log entry ${discord.getEmoji("kannaFacepalm")}`)

        return message.reply(`Successfully edited this case! ${discord.getEmoji("aquaUp")}`)
    }
}
