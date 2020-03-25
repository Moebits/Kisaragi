import {Collection, Message, MessageAttachment} from "discord.js"
import path from "path"
import * as responses from "../assets/json/responses.json"
import SQL from "../commands/bot developer/sql"
import {CommandFunctions} from "../structures/CommandFunctions"
import {Cooldown} from "../structures/Cooldown.js"
import {Kisaragi} from "../structures/Kisaragi.js"
import {Block} from "./../structures/Block"
import {Detector} from "./../structures/Detector"
import {Generate} from "./../structures/Generate"
import {Haiku} from "./../structures/Haiku"
import {Letters} from "./../structures/Letters"
import {Link} from "./../structures/Link"
import {Points} from "./../structures/Points"
import {SQLQuery} from "./../structures/SQLQuery"

const responseTextCool = new Set()
const responseImageCool = new Set()
const haikuCool = new Set()

export default class MessageEvent {
    private readonly cooldowns: Collection<string, Collection<string, number>> = new Collection()
    constructor(private readonly discord: Kisaragi) {}

    public run = async (message: Message) => {
      const letters = new Letters(this.discord)
      const points = new Points(this.discord, message)
      const haiku = new Haiku(this.discord, message)
      const detect = new Detector(this.discord, message)
      const cmdFunctions = new CommandFunctions(this.discord, message)
      const links = new Link(this.discord, message)
      const generate = new Generate(this.discord, message)

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

      if (!this.discord.checkMuted(message.guild)) {
        if (message.guild) {
          const sql = new SQLQuery(message)
          Block.blockWord(message)
          detect.detectAnime()
          detect.swapRoles()
          const haikuEmbed = haiku.haiku()
          if (haikuEmbed) {
            if (haikuCool.has(message.author.id) || haikuCool.has(message.guild?.id)) {
              const reply = await message.channel.send(`<@${message.author.id}>, **haiku** is under a 3 second cooldown!`)
              reply.delete({timeout: 3000})
              return
            }
            const id = message.guild?.id ?? message.author.id
            haikuCool.add(id)
            setTimeout(() => haikuCool.delete(id), 3000)
            return message.channel.send(haikuEmbed)
          }
          /*const pointTimeout = await sql.fetchColumn("points", "point timeout")
          setTimeout(() => {
          points.calcScore()
          }, pointTimeout ? Number(pointTimeout) : 60000)*/
          cmdFunctions.autoCommand()
        }
        if (responses.text[message.content.trim().toLowerCase()]) {
          const response = message.content.trim().toLowerCase()
          if (!message.author!.bot) {
            if (responseTextCool.has(message.author.id) || responseTextCool.has(message.guild?.id)) {
              const reply = await message.channel.send(`<@${message.author.id}>, **${response}** is under a 3 second cooldown!`)
              reply.delete({timeout: 3000})
              return
            }
            const id = message.guild?.id ?? message.author.id
            responseTextCool.add(id)
            setTimeout(() => responseTextCool.delete(id), 3000)
            return message.channel.send(responses.text[response])
          }
        }
        if (responses.image[message.content.trim().toLowerCase()]) {
          const response = message.content.trim().toLowerCase()
          if (!message.author!.bot) {
            if (responseImageCool.has(message.author.id) || responseImageCool.has(message.guild?.id)) {
              const reply = await message.channel.send(`<@${message.author.id}>, **${response}** is under a 10 second cooldown!`)
              reply.delete({timeout: 3000})
              return
            }
            const id = message.guild?.id ?? message.author.id
            responseImageCool.add(id)
            setTimeout(() => responseImageCool.delete(id), 10000)
            return message.channel.send(new MessageAttachment(responses.image[response]))
          }
       }
        if (message.content.trim().toLowerCase() === "i love you") {
          if (message.author.id === process.env.OWNER_ID) {
            message.channel.send(`I love you more, <@${message.author.id}>!`)
          } else {
            message.channel.send(`Sorry <@${message.author.id}>, but I don't share the same feelings.`)
          }
        }
        if (this.discord.checkBotMention(message)) {
          const args = message.content.slice(`<@!${this.discord.user?.id}>`.length).trim().split(/ +/g)
          if (args[0]) {
            cmdFunctions.runCommand(message, args)
          } else {
            message.reply(`My prefix is set to "${prefix}"!\n`)
          }
        }
        if (message.content.trim().startsWith("http")) {
          await links.postLink()
          return
        }
      }

      if (!message.content.trim().startsWith(prefix)) return
      if (message.content === prefix) return
      const args = message.content.trim().slice(prefix.length).split(/ +/g)
      if (args[0] === undefined) return
      const cmd = args[0].toLowerCase()
      const pathFind = await cmdFunctions.findCommand(cmd)
      if (!pathFind) return cmdFunctions.noCommand(cmd)
      const cmdPath = new (require(pathFind).default)(this.discord, message)

      if (cmdPath.options.guildOnly) {
        if (message.channel.type === "dm") return message.channel.send(`<@${message.author.id}>, sorry but you can only use this command in guilds ${this.discord.getEmoji("smugFace")}`)
      }

      const cooldown = new Cooldown(this.discord, message)
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
