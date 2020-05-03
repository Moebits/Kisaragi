import {Collection, Message, MessageAttachment, TextChannel} from "discord.js"
import path from "path"
import * as responses from "../assets/json/responses.json"
import * as config from "../config.json"
import {CommandFunctions} from "../structures/CommandFunctions"
import {Cooldown} from "../structures/Cooldown.js"
import {Kisaragi} from "../structures/Kisaragi.js"
import {Block} from "./../structures/Block"
import {Detector} from "./../structures/Detector"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Generate} from "./../structures/Generate"
import {Haiku} from "./../structures/Haiku"
import {Letters} from "./../structures/Letters"
import {Link} from "./../structures/Link"
import {Permission} from "./../structures/Permission"
import {Points} from "./../structures/Points"
import {SQLQuery} from "./../structures/SQLQuery"

const responseTextCool = new Set()
const responseImageCool = new Set()
const haikuCool = new Set()
const firstMessage = new Set()
const globalChatCool = new Set()
const pointCool = new Collection() as Collection<string, Set<string>>

export default class MessageEvent {
    private readonly cooldowns: Collection<string, Collection<string, number>> = new Collection()
    constructor(private readonly discord: Kisaragi) {}

    public run = async (message: Message) => {
      const letters = new Letters(this.discord)
      const points = new Points(this.discord, message)
      const haiku = new Haiku(this.discord, message)
      const detect = new Detector(this.discord, message)
      const block = new Block(this.discord, message)
      const cmdFunctions = new CommandFunctions(this.discord, message)
      const links = new Link(this.discord, message)
      const generate = new Generate(this.discord, message)
      const embeds = new Embeds(this.discord, message)
      const perms = new Permission(this.discord, message)
      const sql = new SQLQuery(message)

      if (message.partial) {
        try {
          message = await message.fetch()
        } catch {
          return
        }
      }

      const prefix = await SQLQuery.fetchPrefix(message)

      if (message.author.bot) return
      if (await this.discord.blacklistStop(message)) return

      // const cmdstr = generate.generateCommands()
      // console.log(cmdstr)

      if (!this.discord.checkMuted(message)) {
        if (message.guild) {
          const globalChat = await sql.fetchColumn("special channels", "global chat")
          if (globalChat && !message.content.startsWith(prefix) && !message.author.bot) {
            const globalChannel = message.guild.channels.cache.find((c) => c.id === globalChat)
            if (message.channel.id === globalChannel?.id) {
              if (globalChatCool.has(message.author.id)) return message.reply(`**global chat** is under a 3 second cooldown! ${this.discord.getEmoji("kannaHungry")}`)
              if (message.content.length > 100) return message.reply(`There is a limit of 100 characters on the global chat. ${this.discord.getEmoji("sagiriBleh")}`)
              if (message.mentions.users.size) return message.reply(`You can't mention anyone on the global chat. ${this.discord.getEmoji("sagiriBleh")}`)
              if (block.containsInvite()) return message.reply(`You can't post invite links on the global chat. ${this.discord.getEmoji("sagiriBleh")}`)
              if (message.attachments.first()) message.content = message.attachments.first()!.url
              const cleaned = message.content.replace(/@/g, `@\u200b`)
              const translated = await Functions.googleTranslate(cleaned)
              if (Functions.badWords(translated, true)) return message.reply(`You can't post messages containing profane/dirty words ${this.discord.getEmoji("sagiriBleh")}`)
              let globalChannels = await SQLQuery.selectColumn("special channels", "global chat")
              globalChannels = globalChannels.filter(Boolean)
              for (let i = 0; i < globalChannels.length; i++) {
                if (globalChannels[i] === message.channel.id) continue
                const sourceChan = message.channel as TextChannel
                const chan = this.discord.channels.cache.find((c) => c.id === globalChannels[i]) as TextChannel
                chan.send(`\`#${sourceChan.name}\` ${message.author.tag} -> ${translated}`)
                globalChatCool.add(message.author.id)
                setTimeout(() => {
                  globalChatCool.delete(message.author.id)
                }, 3000)
              }
            }
          }
          block.blockWord()
          block.blockInvite()
          block.everyone()
          block.gallery()
          detect.detectAnime()
          detect.swapRoles()
          const haikuEmbed = haiku.haiku()
          if (haikuEmbed) {
            if (haikuCool.has(message.author.id) || haikuCool.has(message.guild?.id)) {
              const reply = await message.channel.send(`<@${message.author.id}>, **haiku** is under a 3 second cooldown! ${this.discord.getEmoji("kannaHungry")}`)
              reply.delete({timeout: 3000})
              return
            }
            const id = message.guild?.id ?? message.author.id
            haikuCool.add(id)
            setTimeout(() => haikuCool.delete(id), 3000)
            return message.channel.send(haikuEmbed)
          }

          if (!pointCool.get(message.guild.id)?.has(message.author.id)) {
            points.calcScore()
            pointCool.get(message.guild.id)?.add(message.author.id)
            const pointTimeout = await sql.fetchColumn("points", "point timeout")
            setTimeout(() => {
              pointCool.get(message.guild?.id ?? "")?.delete(message.author.id)
            }, pointTimeout ? Number(pointTimeout) : 60000)
          }

          if (!firstMessage.has(message.guild.id)) {
            await embeds.updateColor()
            perms.continueTempBans()
            perms.continueTempMutes()
            cmdFunctions.autoCommand()
            firstMessage.add(message.guild.id)
            pointCool.set(message.guild.id, new Set())
          }
        }
        const responseToggle = await sql.fetchColumn("detection", "response")
        if (responseToggle === "on") {
          if (responses.text[message.content.trim().toLowerCase()]) {
            const response = message.content.trim().toLowerCase()
            if (!message.author!.bot) {
              if (responseTextCool.has(message.author.id) || responseTextCool.has(message.guild?.id)) {
                const reply = await message.channel.send(`<@${message.author.id}>, **${response}** is under a 3 second cooldown! ${this.discord.getEmoji("kannaHungry")}`)
                reply.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
                return
              }
              const id = message.guild?.id ?? message.author.id
              responseTextCool.add(id)
              setTimeout(() => responseTextCool.delete(id), 3000)
              let text = responses.text[response]
              if (text === "f") {
                text = this.discord.getEmoji("FU")
              } else if (text === "rip") {
                text = this.discord.getEmoji("rip")
              } else if (Array.isArray(text)) {
                text = text.join("")
              }
              return message.channel.send(text)
            }
          }
          if (responses.image[message.content.trim().toLowerCase()]) {
            const response = message.content.trim().toLowerCase()
            if (!message.author!.bot) {
              if (responseImageCool.has(message.author.id) || responseImageCool.has(message.guild?.id)) {
                const reply = await message.channel.send(`<@${message.author.id}>, **${response}** is under a 10 second cooldown!`)
                reply.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
                return
              }
              const id = message.guild?.id ?? message.author.id
              responseImageCool.add(id)
              setTimeout(() => responseImageCool.delete(id), 10000)
              return message.channel.send(new MessageAttachment(responses.image[response]))
            }
         }
        }
        if (this.discord.checkBotMention(message)) {
          const args = message.content.slice(`<@!${this.discord.user?.id}>`.length).trim().split(/ +/g)
          if (args[0]) {
            cmdFunctions.runCommand(message, args)
          } else {
            message.reply(`My prefix is set to "**${prefix}**"!\n`)
          }
        }
        if (!message.content.trim().startsWith(prefix) && message.content.match(/https?:\/\//)) {
          await links.postLink()
          return
        }
      }

      if (!message.content.trim().startsWith(prefix)) return
      if (message.content.trim() === prefix) return
      const args = message.content.trim().slice(prefix.length).trim().split(/ +/g)
      if (args[0] === undefined) return
      const cmd = args[0].toLowerCase()
      const pathFind = await cmdFunctions.findCommand(cmd)
      if (!pathFind) return cmdFunctions.noCommand(cmd)
      const cmdPath = new (require(pathFind).default)(this.discord, message)

      if (cmdPath.options.guildOnly) {
        if (message.channel.type === "dm") return message.channel.send(`<@${message.author.id}>, sorry but you can only use this command in guilds ${this.discord.getEmoji("smugFace")}`)
      }

      if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild.me!)?.has(["MANAGE_MESSAGES", "SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "READ_MESSAGE_HISTORY"])) {
        let setEmbed = false
        if ((message.channel as TextChannel).permissionsFor(message.guild.me!)?.has(["EMBED_LINKS"])) setEmbed = true
        const permMessage =
          `Sorry, but the bot is missing permissions that break or prevent the execution of most commands, if not all of them.${setEmbed ? "" : " " + this.discord.getEmoji("kannaFacepalm")}\n` +
          `\`Send Messages\` - Um... everything? If you can see this message, the bot has this one at least.\n` +
          `\`Use External Emojis\` - Everything. Needed to post and react with custom emojis (all emojis are custom).\n` +
          `\`Embed Links\` - Everything. Needed to post message embeds.\n` +
          `\`Add Reactions + Read Message History\` - Nearly everything. Needed to add reactions to the bots own messages.\n` +
          `\`Manage Messages\` - Nearly everything. Needed to bulk delete the bots own reactions (page scrolling on help command), delete your reactions (all reaction embeds), and delete your response to a reaction (all reactions that take user input).\n` +
          `\`Attach Files\` - Large amount. Needed by all image commands (uploading local files) and to download images from embeds.\n` +
          `\`Connect + Speak\` - Large amount. Needed by all music and recording commands (one of the primary features of the bot).\n` +
          `**Please give the bot sufficient permissions.**`
        const permEmbed = embeds.createEmbed()
        permEmbed
        .setTitle(`**Missing Permissions** ${this.discord.getEmoji("kannaFacepalm")}`)
        .setDescription(permMessage)
        return setEmbed ? message.channel.send(permEmbed) : message.channel.send(permMessage)
      }

      const cooldown = new Cooldown(this.discord, message)
      sql.usageStatistics(pathFind)
      const onCooldown = cooldown.cmdCooldown(path.basename(pathFind).slice(0, -3), cmdPath.options.cooldown, this.cooldowns)
      if (onCooldown && (message.author?.id !== process.env.OWNER_ID)) return message.reply({embed: onCooldown})

      const msg = await message.channel.send(`**Loading** ${this.discord.getEmoji("gabCircle")}`) as Message

      cmdPath.run(args).then(() => {
          const msgCheck = message.channel.messages
          if (msgCheck.cache.has(msg.id)) msg.delete({timeout: 1000})
        }).catch((err: Error) => {
        message.channel.send(this.discord.cmdError(message, err))
      })
    }
  }
