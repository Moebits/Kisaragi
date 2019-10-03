import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Avatar extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

    const embeds = new Embeds(discord, message)
    const avatarEmbed = embeds.createEmbed()

    if (!message.mentions.users.size) {
      if (message.author!!.displayAvatarURL().includes("gif" || "jpg")) {
        await message.channel.send(avatarEmbed
          .setDescription(`**${message.author!.username}'s Profile Picture**`)
          .setImage(`${message.author!.displayAvatarURL()}` + "?size=2048"))
      } else {
        await message.channel.send(avatarEmbed
          .setDescription(`**${message.author!.username}'s Profile Picture**`)
          .setImage(message.author!.displayAvatarURL()))
      }
    }

    for (const [, user] of message.mentions.users) {
      if (user.displayAvatarURL().includes("gif" || "jpg")) {
        await message.channel.send(avatarEmbed
          .setDescription(`**${user.username}'s Profile Picture**`)
          .setImage(`${user.displayAvatarURL}` + "?size=2048"))
      } else {
        await message.channel.send(avatarEmbed
          .setDescription(`**${user.username}'s Profile Picture**`)
          .setImage(user.displayAvatarURL()))
      }
    }
  }
}
