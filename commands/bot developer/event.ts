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
      discord.emit(event)
      return
  }
}
