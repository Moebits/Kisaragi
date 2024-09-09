import {Message, EmbedBuilder, SlashCommandSubcommandBuilder, RESTPostAPIChatInputApplicationCommandsJSONBody, AttachmentBuilder} from "discord.js"
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
  public name: string
  public category: string
  public path: string
  public options: CommandOptions
  public slash: RESTPostAPIChatInputApplicationCommandsJSONBody
  public subcommand: SlashCommandSubcommandBuilder

  constructor(public discord: Kisaragi, public message: Message<true>, {
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
      this.name = ""
      this.category = ""
      this.path = ""
      this.options = {params, description, help, examples, enabled, guildOnly, aliases, cooldown, permission, botPermission, random, unlist, nsfw, slashEnabled, subcommandEnabled}
      this.slash = null as unknown as RESTPostAPIChatInputApplicationCommandsJSONBody
      this.subcommand = null as unknown as SlashCommandSubcommandBuilder
    }

  get help() {
      return this.options
  }

  public run = async (args: string[]): Promise<void | Message> => {}

  public reply = (embed: EmbedBuilder | string, file?: AttachmentBuilder) => {
    let options = {} as any
    if (embed instanceof EmbedBuilder) {
      options.embeds = [embed]
    } else if (typeof embed === "string") {
      options.content = embed
    }
    if (file) options.file = [file]
    return this.message.reply(options)
  }

  public send = (embed: EmbedBuilder | string, file?: AttachmentBuilder) => {
    let options = {} as any
    if (embed instanceof EmbedBuilder) {
      options.embeds = [embed]
    } else if (typeof embed === "string") {
      options.content = embed
    }
    if (file) options.file = [file]
    return this.message.channel.send(options)
  }

  public edit = (msg: Message, embed: EmbedBuilder | string, file?: AttachmentBuilder) => {
    let options = {} as any
    if (embed instanceof EmbedBuilder) {
      options.embeds = [embed]
    } else if (typeof embed === "string") {
      options.content = embed
    }
    if (file) options.file = [file]
    return msg.edit(options)
  }

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
