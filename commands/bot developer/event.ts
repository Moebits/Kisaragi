import {Collection, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Event extends Command {
  constructor(discord: Kisaragi, message: Message) {
      super(discord, message, {
          description: "Triggers an event.",
          aliases: [],
          cooldown: 3
      })
  }

  public run = async (args: string[]) => {
      const discord = this.discord
      const message = this.message
      const perms = new Permission(discord, message)
      if (!perms.checkBotDev()) return
      if (!message.guild || !message.member) return

      const event = Functions.combineArgs(args, 1).trim()
      switch (event) {
        case "guildCreate":
            discord.emit(event, message.guild)
            break
        case "guildDelete":
            discord.emit(event, message.guild)
            break
        case "guildMemberAdd":
            discord.emit(event, message.member)
            break
        case "guildMemberRemove":
            discord.emit(event, message.member)
            break
        case "message":
            discord.emit(event, message)
            break
        case "messageDelete":
            discord.emit(event, message)
            break
        case "messageDeleteBulk":
            const col = new Collection() as any
            col.set(message.id, message)
            discord.emit(event, col)
            break
        case "messageReactionAdd":
            const reaction = await message.react(discord.getEmoji("aquaUp"))
            discord.emit(event, reaction, message.author)
            break
        case "messageReactionRemove":
            const reaction2 = await message.react(discord.getEmoji("aquaUp"))
            discord.emit(event, reaction2, message.author)
            break
        case "guildBanAdd":
            discord.emit(event, message.guild, message.author)
            break
        case "guildBanRemove":
            discord.emit(event, message.guild, message.author)
            break
        case "channelCreate":
            discord.emit(event, message.channel)
            break
        case "channelDelete":
            discord.emit(event, message.channel)
            break
        case "emojiCreate":
            discord.emit(event, discord.getEmoji("chinoSmug"))
            break
        case "emojiDelete":
            discord.emit(event, discord.getEmoji("chinoSmug"))
            break
        default:
            discord.emit(event as any)
      }
      return message.reply("Triggered the event!")
  }
}
