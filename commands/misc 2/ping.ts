import {Message, SlashCommandBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Ping extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Posts the response time.",
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
          cooldown: 3,
          slashEnabled: true
        })
        this.slash = new SlashCommandBuilder()
        .setName(this.constructor.name.toLowerCase())
        .setDescription(this.options.description)
        .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const pingEmbed = embeds.createEmbed()

        // @ts-ignore
        const msg = await message.reply({fetchReply: true, embeds: [pingEmbed
        .setDescription("Ping?")]}) as Message
        msg.edit({embeds: [pingEmbed
        .setTitle(`**Ping** ${discord.getEmoji("kannaHungry")}`)
        .setDescription(`Ping is **${msg.createdTimestamp - message.createdTimestamp}ms**`)]})
    }
  }
