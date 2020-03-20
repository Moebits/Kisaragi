import {Collection, Message, MessageAttachment} from "discord.js"
import path from "path"
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

export default class MessageEvent {
    private readonly cooldowns: Collection<string, Collection<string, number>> = new Collection()
    private readonly responseTextCool = new Set()
    private readonly responseImageCool = new Set()
    constructor(private readonly discord: Kisaragi) {}

    public run = async (message: Message) => {
      const letters = new Letters(this.discord)
      const points = new Points(this.discord, message)
      const haiku = new Haiku(this.discord, message)
      const detect = new Detector(this.discord, message)
      const cmdFunctions = new CommandFunctions(this.discord, message)
      const links = new Link(this.discord, message)
      const generate = new Generate(this.discord, message)

      let prefix = "=>"
      try {
        prefix = await SQLQuery.fetchPrefix(message)
      } catch {
        // Do nothing
      }

      if (message.author!.bot) return

      // const cmdstr = generate.generateCommands()
      // console.log(cmdstr)

      if (message.guild) {
        const sql = new SQLQuery(message)
        Block.blockWord(message)
        detect.detectAnime()
        detect.swapRoles()
        haiku.haiku()
        /*const pointTimeout = await sql.fetchColumn("points", "point timeout")
        setTimeout(() => {
        points.calcScore()
        }, pointTimeout ? Number(pointTimeout) : 60000)*/
        cmdFunctions.autoCommand()
    }

      const responseText: any = {
      kisaragi: "Kisaragi is the best girl!",
      f: `${letters.letters("F")}`,
      e: `${letters.letters("E")}`,
      b: "🅱️",
      owo: "owo",
      uwu: "uwu",
      rip: `${this.discord.getEmoji("rip")}`
    }

      const responseImage: any = {
      "bleh": "https://i.ytimg.com/vi/Gn4ah6kAmZo/maxresdefault.jpg",
      "smug": "https://pbs.twimg.com/media/CpfL-c3WEAE1Na_.jpg",
      "stare": "https://thumbs.gfycat.com/OpenScaryJunebug-small.gif",
      "sleepy": "https://thumbs.gfycat.com/VastBlackJackal-small.gif",
      "school shooter": "https://thumbs.gfycat.com/SmoggyDependentGrayfox-size_restricted.gif",
      "cry": "https://thumbs.gfycat.com/CompletePotableDove-small.gif",
      "pat": "https://thumbs.gfycat.com/WarmheartedAridCygnet-small.gif",
      "welcome": "https://thumbs.gfycat.com/PowerlessSparklingIcelandgull-small.gif",
      "gab s": "https://thumbs.gfycat.com/PettyWeightyArrowana-small.gif",
      "piggy back": "https://thumbs.gfycat.com/IlliterateJointAssassinbug-size_restricted.gif",
      "kick": "https://thumbs.gfycat.com/SentimentalFocusedAmericansaddlebred-small.gif",
      "punch": "https://thumbs.gfycat.com/ClearcutInexperiencedAnemone-small.gif",
      "bye": "https://i.imgur.com/2CrEDAD.gif"
    }

      if (responseText[message.content.trim().toLowerCase()]) {
      if (!message.author!.bot) {
        if (this.responseTextCool.has(message.author.id || message.guild?.id)) {
          const reply = await message.channel.send(`<@${message.author.id}>, This command is under a 3 second cooldown!`) as Message
          reply.delete({timeout: 3000})
          return
        }
        const id = message.guild?.id ?? message.author.id
        this.responseTextCool.add(id)
        setTimeout(() => this.responseTextCool.delete(id), 3000)
        return message.channel.send(responseText[message.content.toLowerCase()])
      }
    }

      if (responseImage[message.content.trim().toLowerCase()]) {
      if (!message.author!.bot) {
        if (this.responseImageCool.has(message.author.id || message.guild?.id)) {
          const reply = await message.channel.send(`<@${message.author.id}>, This command is under a 10 second cooldown!`) as Message
          reply.delete({timeout: 3000})
          return
        }
        const id = message.guild?.id ?? message.author.id
        this.responseImageCool.add(id)
        setTimeout(() => this.responseImageCool.delete(id), 10000)
        return message.channel.send(new MessageAttachment(responseImage[message.content.toLowerCase()]))
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

      if (!message.content.trim().startsWith(prefix)) return

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
