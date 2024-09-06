import {Message, EmbedBuilder, SlashCommandSubcommandBuilder, RESTPostAPIChatInputApplicationCommandsJSONBody} from "discord.js"
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
  subcommandEnabled: boolean
}

export class Command {
  public readonly options: CommandOptions
  public slash: RESTPostAPIChatInputApplicationCommandsJSONBody
  public subcommand: SlashCommandSubcommandBuilder

  constructor(public readonly discord: Kisaragi, public readonly message: Message<true>, {
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
      slashEnabled = false,
      subcommandEnabled = false
    }) {
      this.options = {params, description, help, examples, enabled, guildOnly, aliases, cooldown, permission, botPermission, random, unlist, nsfw, slashEnabled, subcommandEnabled}
      this.slash = null as unknown as RESTPostAPIChatInputApplicationCommandsJSONBody
      this.subcommand = null as unknown as SlashCommandSubcommandBuilder
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
