import {TextChannel, Message} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Role extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
          description: "Sets the topic on the current channel.",
          help:
          `
          \`topic newtopic\` - Sets the new topic
          `,
          examples:
          `
          \`=>topic general chat\`
          `,
          guildOnly: true,
          aliases: ["channeltopic"],
          cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return

        const topic = Functions.combineArgs(args, 1).trim()
        if (!topic) return message.reply(`You need to specify what you want to set the topic to ${discord.getEmoji("kannaCurious")}`)

        await (message.channel as TextChannel).setTopic(topic, "Changed the channel topic to a better one.").catch(() => null)
        return message.reply(`Set the topic to: **${topic}** ${discord.getEmoji("aquaUp")}`)
    }
}
