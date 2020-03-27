import {Message} from "discord.js"
import util from "util"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Eval extends Command {
  constructor(discord: Kisaragi, message: Message) {
      super(discord, message, {
          description: "Evaluates Javascript code.",
          aliases: [],
          cooldown: 3
      })
  }

  public clean = (text: string) => {
    if (!text) return text
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
  }

  public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return

        try {
          const code = Functions.combineArgs(args, 1)
          let evaled = await eval(code)
          if (typeof evaled !== "string") evaled = util.inspect(evaled)
          const evalEmbed = embeds.createEmbed()
          evalEmbed
          .setTitle(`**Javascript Code Eval** ${discord.getEmoji("kaosWTF")}`)
          .setDescription(Functions.checkChar(this.clean(evaled), 2000, ""))
          message.channel.send(evalEmbed)
        } catch (error) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(error)}\n\`\`\``)
        }
  }
}
