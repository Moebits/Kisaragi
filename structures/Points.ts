import {Message} from "discord.js"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"

export class Points {
    constructor(private readonly discord: Kisaragi) {}

    // Fetch Score
    public fetchScore = async (message: Message) => {
        const sql = new SQLQuery(message)
        const rawScoreList = await sql.fetchColumn("points", "score list", false, false, true)
        const rawUserList = await sql.fetchColumn("points", "user id list", false, false, true)
        const scoreList = rawScoreList.map((num: string) => Number(num))
        const userList = rawUserList.map((num: string) => Number(num))
        for (let i = 0; i < userList.length; i++) {
            if (userList[i] === Number(message.author.id)) {
                const userScore: number = scoreList[i]
                return userScore
            }
        }
    }

    // Fetch Level
    public fetchLevel = async (message: Message) => {
        const sql = new SQLQuery(message)
        const rawLevelList = await sql.fetchColumn("points", "level list", false, false, true)
        const rawUserList = await sql.fetchColumn("points", "user id list", false, false, true)
        const levelList = rawLevelList.map((num: string) => Number(num))
        const userList = rawUserList.map((num: string) => Number(num))
        for (let i = 0; i < userList.length; i++) {
            if (userList[i] === Number(message.author.id)) {
                const userLevel: number = levelList[i]
                return userLevel
            }
        }
    }

    // Calculate Score
    public calcScore = async (message: Message) => {
        if (message.author.bot) return
        const sql = new SQLQuery(message)
        const embeds = new Embeds(this.discord, message)
        const rawScoreList = await sql.fetchColumn("points", "score list", false, false, true)
        const rawLevelList = await sql.fetchColumn("points", "level list", false, false, true)
        const rawPointRange = await sql.fetchColumn("points", "point range", false, false, true)
        const rawPointThreshold = await sql.fetchColumn("points", "point threshold", false, false, true)
        const rawUserList = await sql.fetchColumn("points", "user id list", false, false, true)
        const levelUpMessage = await sql.fetchColumn("points", "level message", false, false, true)
        const userList = rawUserList.map((num: string) => Number(num))

        if (!rawScoreList[0]) {
            const initList: number[] = []
            for (let i = 0; i < userList.length; i++) {
                initList[i] = 0
            }
            await sql.updateColumn("points", "score list", initList)
            await sql.updateColumn("points", "level list", initList)
            return
        }

        const scoreList: number[] = rawScoreList.map((num: string) => Number(num))
        const levelList: number[] = rawLevelList.map((num: string) => Number(num))
        const pointRange: number[] = rawPointRange.map((num: string) => Number(num))
        const pointThreshold: number = Number(rawPointThreshold)
        const userStr: string = levelUpMessage.join("").replace("user", `<@${message.author.id}>`)

        for (let i = 0; i < userList.length; i++) {
            if (userList[i] === Number(message.author.id)) {
                const userScore: number = scoreList[i]
                const userLevel: number = levelList[i]
                if (userScore === undefined || userScore === null) {
                    scoreList[i] = 0
                    levelList[i] = 0
                    await sql.updateColumn("points", "score list", scoreList)
                    await sql.updateColumn("points", "score list", levelList)
                    return
                }
                const newPoints: number = Math.floor(userScore + Functions.getRandomNum(pointRange[0], pointRange[1]))
                const newLevel: number = Math.floor(userScore / pointThreshold)
                const lvlStr: string = userStr.replace("newlevel", newLevel.toString())

                if (newLevel > userLevel) {
                    levelList[i] = newLevel
                    await sql.updateColumn("points", "level list", levelList)
                    const channel = message.member!.lastMessage!.channel
                    const levelEmbed = embeds.createEmbed()
                    levelEmbed
                    .setTitle(`**Level Up!** ${this.discord.getEmoji("vigneXD")}`)
                    .setDescription(lvlStr)
                    channel.send(levelEmbed)
                }

                scoreList[i] = newPoints
                await sql.updateColumn("points", "score list", scoreList)
                return
            }
        }
      }
}
