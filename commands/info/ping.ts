import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Ping extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
      const embeds = new Embeds(discord, message)

      const pingEmbed: any = embeds.createEmbed()

      const msg = await message.channel.send(pingEmbed
      .setDescription("Ping?")) as Message
      msg.edit(pingEmbed
      .setDescription(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is /todo/ ms`))
    }
  }
