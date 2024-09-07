import {Message} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import * as config from "./../../config.json"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Invite extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
          description: "Posts the invite link and support server link.",
          help:
          `
          \`invite\` - Posts invite
          `,
          examples:
          `
          \`=>invite\`
          `,
          aliases: ["support", "contact"],
          random: "none",
          cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const inviteEmbed = embeds.createEmbed()
        .setTitle(`**Invite Links** ${discord.getEmoji("kannaHungry")}`)
        .setDescription(
            `Here is the bot invite link and support server invite link!\n` +
            `[**Invite Link**](${config.invite.replace("CLIENTID", discord.user!.id)})\n` +
            `[**Support Server**](${config.support})`
        )
        return message.channel.send({embeds: [inviteEmbed]})
    }
}
