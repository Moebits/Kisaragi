import {Message} from "discord.js"
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
        case "messageUpdate":
            discord.emit(event, message)
            break
        case "messageReactionAdd":
            const reaction = await message.react(discord.getEmoji("aquaUp"))
            discord.emit(event, reaction, message.author)
            break
        case "messageReactionRemove":
            const reaction2 = await message.react(discord.getEmoji("aquaUp"))
            discord.emit(event, reaction2, message.author)
            break
        default:
            discord.emit(event)
      }
      return
  }
}
