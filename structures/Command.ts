import {Message, MessageEmbed} from "discord.js"
import {Kisaragi} from "./Kisaragi"
interface CommandOptions {
  params: string
  description: string
  help: string
  examples: string
  enabled: boolean
  guildOnly: boolean
  aliases: string[]
  cooldown: number
  permission: string
  botPermission: string
  random: "none" | "string" | "specific" | "ignore"
  unlist: boolean
  nsfw: boolean
}

export class Command {

  public readonly options: CommandOptions

  constructor(public readonly discord: Kisaragi, public readonly message: Message, {
      params = "",
      description = "No description provided.",
      help = "This command is not documented.",
      examples = "There are no examples.",
      enabled = true,
      guildOnly = false,
      aliases = [""],
      cooldown = 3,
      permission = "SEND_MESSAGES",
      botPermission = "SEND_MESSAGES",
      random = "ignore" as "none" | "string" | "specific" | "ignore",
      unlist = false,
      nsfw = false
    }) {
      this.options = {params, description, help, examples, enabled, guildOnly, aliases, cooldown, permission, botPermission, random, unlist, nsfw}
    }

  get help() {
      return this.options
  }

  public noQuery = (embed: MessageEmbed, text?: string) => {
    const discord = this.discord
    const desc = text ? `${discord.getEmoji("star")}You must provide a search query. ${text}` : `${discord.getEmoji("star")}You must provide a search query.`
    embed.setDescription(desc)
    this.message.reply({embed})
  }

  public invalidQuery = (embed: MessageEmbed, text?: string) => {
    const discord = this.discord
    const desc = text ? `${discord.getEmoji("star")}No results were found. ${text}` : `${discord.getEmoji("star")}No results were found.`
    embed.setDescription(desc)
    this.message.reply({embed})
  }

}
