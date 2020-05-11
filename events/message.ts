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
          const globalChat = await sql.fetchColumn("guilds", "global chat")
          if (globalChat && !message.content.startsWith(prefix) && !message.author.bot) {
            const globalChannel = message.guild.channels.cache.find((c) => c.id === globalChat)
            if (message.channel.id === globalChannel?.id) {
              if (globalChatCool.has(message.author.id)) return message.reply(`You hit the rate limit for **global chat**! Wait 3 seconds before trying again. ${this.discord.getEmoji("kannaHungry")}`)
              if (message.content.length > 300) return message.reply(`There is a limit of 300 characters on the global chat. ${this.discord.getEmoji("sagiriBleh")}`)
              if (message.mentions.users.size) return message.reply(`You can't mention anyone on the global chat. ${this.discord.getEmoji("sagiriBleh")}`)
              if (block.containsInvite()) return message.reply(`You can't post invite links on the global chat. ${this.discord.getEmoji("sagiriBleh")}`)
              if (message.attachments.first()) message.content = message.attachments.first()!.url
              const cleaned = message.content.replace(/@/g, `@\u200b`)
              const translated = await Functions.googleTranslate(cleaned)
              if (Functions.badWords(translated, true)) return message.reply(`You can't post messages containing profane or dirty words. ${this.discord.getEmoji("sagiriBleh")}`)
              let globalChannels = await SQLQuery.selectColumn("guilds", "global chat")
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
              const reply = await message.channel.send(`<@${message.author.id}>, You hit the rate limit for **haiku**! Please wait 3 seconds before trying again. ${this.discord.getEmoji("kannaHungry")}`)
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
            const pointTimeout = await sql.fetchColumn("guilds", "point timeout")
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
        const responseToggle = await sql.fetchColumn("guilds", "response")
        if (responseToggle === "on") {
          if (responses.text[message.content.trim().toLowerCase()]) {
            const response = message.content.trim().toLowerCase()
            if (!message.author!.bot) {
              if (responseTextCool.has(message.author.id) || responseTextCool.has(message.guild?.id)) {
                const reply = await message.channel.send(`<@${message.author.id}>, You hit the rate limit for **${response}**! Wait 3 seconds before trying again. ${this.discord.getEmoji("kannaHungry")}`)
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
                const reply = await message.channel.send(`<@${message.author.id}>, You hit the rate limit for **${response}**! Please wait 10 seconds before trying again.`)
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
      if (cmdPath.options.nsfw && this.discord.checkMuted(message)) return

      if (cmdPath.options.guildOnly) {
        if (message.channel.type === "dm") return message.channel.send(`<@${message.author.id}>, sorry but you can only use this command in guilds. ${this.discord.getEmoji("smugFace")}`)
      }

      if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild.me!)?.has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK"])) {
        let setEmbed = false
        if ((message.channel as TextChannel).permissionsFor(message.guild.me!)?.has(["EMBED_LINKS"])) setEmbed = true
        const permMessage =
          `Sorry, but the bot is missing permissions that break or prevent the execution of most commands, if not all of them.${setEmbed ? "" : " " + this.discord.getEmoji("kannaFacepalm").toString()}\n` +
          `\`Send Messages\` - Um... everything? If you can see this message, the bot has this one at least.\n` +
          `\`Use External Emojis\` - Needed to post and react with custom emojis.\n` +
          `\`Embed Links\` - Needed to post message embeds.\n` +
          `\`Add Reactions + Read Message History\` - Needed to add reactions to the bots own messages.\n` +
          `\`Attach Files\` - Needed to upload local files, specifically images.\n` +
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

      this.discord.muted = false
      const msg = await message.channel.send(`**Loading** ${this.discord.getEmoji("gabCircle")}`) as Message
      this.discord.muted = this.discord.checkMuted(message)
      if (cmdPath.options.unlist && message.author.id !== process.env.OWNER_ID) return message.reply(`Only the bot developer can use commands not listed on the help command. ${this.discord.getEmoji("sagiriBleh")}`)

      cmdPath.run(args).then(() => {
          const msgCheck = message.channel.messages
          if (msgCheck.cache.has(msg.id)) msg.delete({timeout: 1000})
        }).catch((err: Error) => {
        message.channel.send(this.discord.cmdError(message, err))
      })
    }
  }
