import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Avatar extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Posts your avatar or the avatar of a user.",
          help:
          `
          \`avatar\` - Posts your avatar
          \`avatar @user1 @user2\` - Posts the avatar(s) of the mentioned user(s)
          `,
          examples:
          `
          \`=>avatar\`
          `,
          aliases: ["av"],
          cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const embeds = new Embeds(discord, message)
        const avatarEmbed = embeds.createEmbed()

        if (!message.mentions.users.size) {
        await message.channel.send(avatarEmbed
          .setDescription(`**${message.author!.username}'s Profile Picture**`)
          .setImage(message.author!.displayAvatarURL({format: "png", size: 2048, dynamic: true})))
        }

        for (const [, user] of message.mentions.users) {
        await message.channel.send(avatarEmbed
          .setDescription(`**${user.username}'s Profile Picture**`)
          .setImage(user.displayAvatarURL({format: "png", size: 2048, dynamic: true})))
    }
  }
}
