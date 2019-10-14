import {Message} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Reload extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Reloads a command.",
          aliases: ["reload"],
          cooldown: 50
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return
        const commandName = args[1]

        const subDir = fs.readdirSync("commands")
        let found = false
        cdLoop:
        for (let i = 0; i < subDir.length; i++) {
          const commands = fs.readdirSync(`commands/${subDir[i]}`)
          for (let j = 0; j < commands.length; j++) {
            if (commands[j].slice(0, -3) === commandName) {
              delete require.cache[require.resolve(`../${subDir[i]}/${commands[j]}`)]
              new (require(`../${subDir[i]}/${commands[j]}`).default)(this.discord, this.message)
              found = true
              break cdLoop
            }
          }
        }
        if (!found) return message.reply(`The command ${commandName} was not found.`)
        const reloadEmbed = embeds.createEmbed()
        .setTitle(`**Reload** ${discord.getEmoji("gabStare")}`)
        .setDescription(`The command **${commandName}** has been reloaded!`)
        return message.channel.send(reloadEmbed)
  }
}
