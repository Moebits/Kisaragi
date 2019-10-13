import {Message, MessageEmbed} from "discord.js"
import {Kisaragi} from "./Kisaragi"
interface CommandOptions {
  params: string
  description: string
  help: string
  examples: string
  image: string
  enabled: boolean
  guildOnly: boolean
  aliases: string[]
  cooldown: number
  permission: string
  botPermission: string
}

export class Command {

  public readonly options: CommandOptions

  constructor(public readonly discord: Kisaragi, public readonly message: Message, {
      params = "",
      description = "No description provided.",
      help = "This command is not documented.",
      examples = "There are no examples.",
      image = "",
      enabled = true,
      guildOnly = false,
      aliases = [""],
      cooldown = 3,
      permission = "SEND_MESSAGES",
      botPermission = "SEND_MESSAGES"
    }) {
      this.options = {params, description, help, examples, image, enabled, guildOnly, aliases, cooldown, permission, botPermission}
    }

  get help() {
      return this.options
  }

  public noQuery = (embed: MessageEmbed, text?: string) => {
    const star = this.discord.getEmoji("star")
    const desc = text ? `${star}You must provide a search query. ${text}` : `${star}You must provide a search query.`
    embed.setDescription(desc)
    this.message.reply({embed})
  }

  public invalidQuery = (embed: MessageEmbed, text?: string) => {
    const star = this.discord.getEmoji("star")
    const desc = text ? `${star}No results were found. ${text}` : `${star}No results were found.`
    embed.setDescription(desc)
    this.message.reply({embed})
  }

}
