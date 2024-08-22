import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import * as config from "./../../config.json"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Donate extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Posts my patreon and ko-fi links.",
          help:
          `
          \`donate\` - Posts donation links
          `,
          examples:
          `
          \`=>donate\`
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

        const donateEmbed = embeds.createEmbed()
        .setTitle(`**Donation Links** ${discord.getEmoji("kannaBear")}`)
        .setDescription(
            `Here are my donation links if you want to support me!\n` +
            `[**Patreon**](${config.patreon})\n` +
            `[**Ko-fi**](${config.kofi})`
        )
        return message.channel.send({embeds: [donateEmbed]})
    }
}
