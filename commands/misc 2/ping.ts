import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Ping extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Ping.",
          help:
          `
          \`ping\` - Posts the response time
          `,
          examples:
          `
          \`=>ping\`
          `,
          aliases: [],
          random: "none",
          cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const pingEmbed = embeds.createEmbed()

        const msg = await message.channel.send(pingEmbed
        .setDescription("Ping?")) as Message
        msg.edit(pingEmbed
        .setTitle(`**Ping** ${discord.getEmoji("kannaHungry")}`)
        .setDescription(`Ping is **${msg.createdTimestamp - message.createdTimestamp}ms**`))
    }
  }
