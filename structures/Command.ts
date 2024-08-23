import {Message, EmbedBuilder, RESTPostAPIChatInputApplicationCommandsJSONBody} from "discord.js"
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
  slashEnabled: boolean
}

export class Command {
  public readonly options: CommandOptions
  public slash: RESTPostAPIChatInputApplicationCommandsJSONBody

  constructor(public readonly discord: Kisaragi, public readonly message: Message, {
      params = "",
      description = "No description provided.",
      help = "This command is not documented.",
      examples = "There are no examples.",
      enabled = true,
      guildOnly = false,
      aliases = [""],
      cooldown = 3,
      permission = "SendMessages",
      botPermission = "SendMessages",
      random = "ignore" as "none" | "string" | "specific" | "ignore",
      unlist = false,
      nsfw = false,
      slashEnabled = false
    }) {
      this.options = {params, description, help, examples, enabled, guildOnly, aliases, cooldown, permission, botPermission, random, unlist, nsfw, slashEnabled}
      this.slash = null as unknown as RESTPostAPIChatInputApplicationCommandsJSONBody
    }

  get help() {
      return this.options
  }

  public run = async (args: string[]): Promise<void | Message> => {}

  public noQuery = (embed: EmbedBuilder, text?: string) => {
    const discord = this.discord
    const desc = text ? `${discord.getEmoji("star")}You must provide a search query. ${text}` : `${discord.getEmoji("star")}You must provide a search query.`
    embed.setDescription(desc)
    this.message.reply({embeds: [embed]})
  }

  public invalidQuery = (embed: EmbedBuilder, text?: string) => {
    const discord = this.discord
    const desc = text ? `${discord.getEmoji("star")}No results were found. ${text}` : `${discord.getEmoji("star")}No results were found.`
    embed.setDescription(desc)
    this.message.reply({embeds: [embed]})
  }

}
