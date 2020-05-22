import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import * as config from "./../../config.json"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Review extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Write a review of my bot.",
          help:
          `
          \`review\` - Write a review
          `,
          examples:
          `
          \`=>review\`
          `,
          aliases: [],
          random: "none",
          cooldown: 5,
          unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const reviewEmbed = embeds.createEmbed()
        .setTitle(`**Review** ${discord.getEmoji("raphi")}`)
        .setDescription(
            `You can leave a review of my bot [**here**](${config.review}).\n`
        )
        return message.channel.send(reviewEmbed)
    }
}
