import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Invite extends Command {
    constructor(discord: Kisaragi, message: Message) {
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
          aliases: ["support"],
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
            `[**Invite Link**](https://discordapp.com/api/oauth2/authorize?client_id=593838271650332672&permissions=2113793271&scope=bot)\n` +
            `[**Support Server**](https://discord.gg/77yGmWM)`
        )
        return message.channel.send(inviteEmbed)
    }
}
