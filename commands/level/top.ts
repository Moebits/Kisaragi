import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Top extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Lists the xp leaderboard (disabled).",
          aliases: [],
          cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        return message.reply("This command is disabled for the time being...")

        const rawScoreList = await sql.fetchColumn("points", "score list")
        const rawLevelList = await sql.fetchColumn("points", "level list")
        const rawUserList = await sql.fetchColumn("points", "user id list")
        const userList = rawUserList.map((num: string) => Number(num))
        const scoreList  = rawScoreList.map((num: string) => Number(num))
        const levelList = rawLevelList.map((num: string) => Number(num))

        const objectArray: any = []
        for (let i = 0; i < userList.length; i++) {
      const scoreObject: object = {
        user: userList[i],
        points: scoreList[i],
        level: levelList[i]
      }
      objectArray.push(scoreObject)
    }

        objectArray.sort((a: any, b: any) => (a.points > b.points) ? -1 : 1)

        const iterations = Math.ceil(message.guild!.memberCount / 10)

        const embedArray: MessageEmbed[] = []
        loop1:
    for (let i = 0; i < iterations; i++) {
      const topEmbed = embeds.createEmbed()
      let description = ""
      for (let j = 0; j < 10; j++) {
        const position = (i*10) + j
        if (!objectArray[position]) break loop1
        description += `${discord.getEmoji("star")}_User:_ <@${objectArray[position].user}>\n` +
        `${discord.getEmoji("star")}_Points:_ **${objectArray[position].points}**\n` +
        `${discord.getEmoji("star")}_Level:_ **${objectArray[position].level}**\n`
      }
      topEmbed
      .setTitle(`**${message.guild!.name}'s Leaderboard** ${discord.getEmoji("hanaDesires")}`)
      .setThumbnail(message.guild!.iconURL() as string)
      .setDescription(description)
      embedArray.push(topEmbed)
    }
        embeds.createReactionEmbed(embedArray)
  }
}
