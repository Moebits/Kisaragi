import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Clean extends Command {
  constructor() {
      super({
          aliases: [],
          cooldown: 3
      })
  }

  public clean = (text: string) => {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
  }

  public run = async (discord: Kisaragi, message: Message, args: string[]) => {
    const perms = new Permission(discord, message)
    const embeds = new Embeds(discord, message)
    if (!perms.checkBotDev()) return

    const evalEmbed = embeds.createEmbed()

    try {
          const code: string = Functions.combineArgs(args, 1)
          let evaled: string = eval(code)

          if (typeof evaled !== "string") {
            evaled = require("util").inspect(evaled)
          }

          evalEmbed
          .setTitle(`**Javascript Code Eval** ${discord.getEmoji("kaosWTF")}`)
          .setDescription(this.clean(evaled))
          message.channel.send(evalEmbed)

        } catch (error) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(error)}\n\`\`\``)
        }
  }
}
