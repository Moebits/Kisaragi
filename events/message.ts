import {Collection, Message, MessageAttachment} from "discord.js"
import path from "path"
import {CommandFunctions} from "../structures/CommandFunctions"
import {Cooldown} from "../structures/Cooldown.js"
import {Kisaragi} from "../structures/Kisaragi.js"
import {Block} from "./../structures/Block"
import {Detector} from "./../structures/Detector"
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
      const cmdFunctions = new CommandFunctions(this.discord, message)
      const detect = new Detector(this.discord, message)
      const links = new Link(this.discord, message)

      /*let guildIDs = [
        "594616328351121419"
      ]
      for (let i in guildIDs) {
        let guild = discord.guilds.find(g => guildIDs[i] === g.id.toString())
        await guild.delete()
      }*/

      const prefix = await SQLQuery.fetchPrefix(message)

      /*const letterNames = [
        "numberSelect"
      ]
      const {Generate} = require("../structures/Generate")
      const generate = new Generate(this.discord)
      generate.generateEmojis(letterNames)*/

      if (message.author!.bot) return

      if (message.guild) {
        const sql = new SQLQuery(message)
        const pointTimeout = await sql.fetchColumn("points", "point timeout")
        setTimeout(() => {
        points.calcScore()
        }, pointTimeout ? Number(pointTimeout) : 60000)
        Block.blockWord(message)
        detect.detectAnime()
        detect.swapRoles()
        haiku.haiku()
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
        if (this.responseTextCool.has(message.guild!.id)) {
          const reply = await message.reply("This command is under a 3 second cooldown!") as Message
          reply.delete({timeout: 3000})
        }
        this.responseTextCool.add(message.guild!.id)
        setTimeout(() => this.responseTextCool.delete(message.guild!.id), 3000)
        return message.channel.send(responseText[message.content.toLowerCase()])
      }
    }

      if (responseImage[message.content.trim().toLowerCase()]) {
      if (!message.author!.bot) {
        if (this.responseImageCool.has(message.guild!.id)) {
          const reply = await message.reply("This command is under a 10 second cooldown!") as Message
          reply.delete({timeout: 3000})
        }
        this.responseImageCool.add(message.guild!.id)
        setTimeout(() => this.responseImageCool.delete(message.guild!.id), 10000)
        return message.channel.send(new MessageAttachment(responseImage[message.content.toLowerCase()]))
      }
    }

      if (message.content.trim().toLowerCase() === "i love you") {
      if (message.author!.id === process.env.OWNER_ID) {
        message.channel.send(`I love you more, <@${message.author!.id}>!`)
      } else {
        message.channel.send(`Sorry <@${message.author!.id}>, but I don't share the same feelings. We can still be friends though!`)
      }
    }

      if (this.discord.checkBotMention(message)) {
        const args = message.content.slice(`<@!${this.discord.user!.id}>`.length).trim().split(/ +/g)
        message.reply(`My prefix is set to "${prefix}"!\n`)
        if (!args[0]) {
          cmdFunctions.runCommand(message, ["help"])
        } else {
          cmdFunctions.runCommand(message, args)
        }
    }

      if (message.content.startsWith("https")) {
      await links.postLink()
      return
    }

      if (!message.content.startsWith(prefix[0])) return

      const args = message.content.slice(prefix.length).trim().split(/ +/g)
      if (args[0] === undefined) return
      const cmd = args[0].toLowerCase()
      const pathFind = await cmdFunctions.findCommand(cmd)
      if (!pathFind) return cmdFunctions.noCommand(cmd)
      const cmdPath = new (require(pathFind).default)(this.discord, message)

      const cooldown = new Cooldown(this.discord, message)
      const onCooldown = cooldown.cmdCooldown(path.basename(pathFind).slice(0, -3), cmdPath.options.cooldown, this.cooldowns)
      if (onCooldown) return message.reply({embed: onCooldown})

      const msg = await message.channel.send(`**Loading** ${this.discord.getEmoji("gabCircle")}`) as Message
      cmdPath.run(args).then(() => {
      const msgCheck = message.channel.messages
      if (msgCheck.has(msg.id)) msg.delete({timeout: 1000})
      }).catch((err: Error) => message.channel.send(this.discord.cmdError(message, err)))
    }
  }
