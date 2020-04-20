import {Message} from "discord.js"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"

export class Points {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    /** Resets a users points */
    public zero = async (id: string) => {
        const sql = new SQLQuery(this.message)
        const scores = await sql.fetchColumn("points", "scores")
        if (scores) {
            for (let i = 0; i < scores.length; i++) {
                const user = JSON.parse(scores[i])
                if (user.id === id) {
                    user.score = 0
                    scores[i] = JSON.stringify(user)
                    await sql.updateColumn("points", "scores", scores)
                }
            }
        } else {
            return Promise.reject("No scores")
        }
    }

    /** Gives score to a user */
    public giveScore = async (id: string, score: number) => {
        const sql = new SQLQuery(this.message)
        const embeds = new Embeds(this.discord, this.message)
        const scores = await sql.fetchColumn("points", "scores")
        if (scores) {
            for (let i = 0; i < scores.length; i++) {
                const user = JSON.parse(scores[i])
                if (user.id === id) {
                    user.score = Number(user.score) + Number(score)
                    scores[i] = JSON.stringify(user)
                    await sql.updateColumn("points", "scores", scores)
                    let pointThreshold = await sql.fetchColumn("points", "point threshold")
                    pointThreshold = Number(pointThreshold)
                    const newLevel = Math.floor(user.score / pointThreshold)

                    if (newLevel > user.level) {
                        let levelUpMessage = await sql.fetchColumn("points", "level message")
                        levelUpMessage = levelUpMessage.replace("user", `<@${this.message.author!.id}>`)
                        levelUpMessage = levelUpMessage.replace("newlevel", `**${newLevel}**`)
                        user.level = newLevel
                        scores[i] = JSON.stringify(user)
                        await sql.updateColumn("points", "scores", scores)
                        const levelEmbed = embeds.createEmbed()
                        levelEmbed
                        .setTitle(`**Level Up!** ${this.discord.getEmoji("karenXmas")}`)
                        .setDescription(levelUpMessage)
                        this.message.channel.send(levelEmbed)
                    }

                    if (newLevel < user.level) {
                        user.level = newLevel
                        scores[i] = JSON.stringify(user)
                        await sql.updateColumn("points", "scores", scores)
                        const levelEmbed = embeds.createEmbed()
                        levelEmbed
                        .setTitle(`**Level Down!** ${this.discord.getEmoji("kaosWTF")}`)
                        .setDescription(`You were leveled down to level **${newLevel}**!`)
                        this.message.channel.send(levelEmbed)
                    }
                }
            }
        } else {
            return Promise.reject("No scores")
        }
    }

    /** Fetches a users score */
    public fetchScore = async () => {
        const sql = new SQLQuery(this.message)
        const scores = await sql.fetchColumn("points", "scores")
        let score = 0
        let level = 0
        if (scores) {
            for (let i = 0; i < scores.length; i++) {
                const user = JSON.parse(scores[i])
                if (user.id === this.message.author!.id) {
                    level = user.level
                    score = user.score
                    return {score, level}
                }
            }
        }
        return {score, level}
    }

    /** Calculates new scores, and sends a message on level up */
    public calcScore = async () => {
        if (this.message.author?.bot) return
        if (!this.message.guild) return
        const sql = new SQLQuery(this.message)
        const embeds = new Embeds(this.discord, this.message)
        const toggle = await sql.fetchColumn("points", "point toggle")
        if (!toggle || toggle === "off") return
        const scores = await sql.fetchColumn("points", "scores")
        let pointRange = await sql.fetchColumn("points", "point range")
        let pointThreshold = await sql.fetchColumn("points", "point threshold")
        let levelUpMessage = await sql.fetchColumn("points", "level message")
        pointRange = pointRange?.map((num: string) => Number(num))
        pointThreshold = Number(pointThreshold)
        levelUpMessage = levelUpMessage.replace("user", `<@${this.message.author!.id}>`)
        const userList = this.message.guild.members.cache.map((m) => m.id)

        if (!scores?.[0]) {
            const initList: object[] = []
            for (let i = 0; i < userList.length; i++) {
                initList.push({id: userList[i], score: 0, level: 0})
            }
            await sql.updateColumn("points", "scores", initList)
            return
        }

        const idList = scores.map((s: any) => JSON.parse(s).id)
        if (!idList.includes(this.message.author.id)) {
            scores.push({id: this.message.author.id, score: 0, level: 0})
            await sql.updateColumn("points", "scores", scores)
            return
        }

        for (let i = 0; i < scores.length; i++) {
            const user = JSON.parse(scores[i])
            if (user.id === this.message.author.id) {
                const newPoints = Math.floor(user.score + Functions.getRandomNum(pointRange[0], pointRange[1]))
                const newLevel = Math.floor(user.score / pointThreshold)
                levelUpMessage = levelUpMessage.replace("newlevel", `**${newLevel}**`)

                if (newLevel > user.level) {
                    user.level = newLevel
                    scores[i] = JSON.stringify(user)
                    await sql.updateColumn("points", "scores", scores)
                    const levelEmbed = embeds.createEmbed()
                    levelEmbed
                    .setTitle(`**Level Up!** ${this.discord.getEmoji("karenXmas")}`)
                    .setDescription(levelUpMessage)
                    this.message.channel.send(levelEmbed)
                }
                user.score = newPoints
                scores[i] = JSON.stringify(user)
                await sql.updateColumn("points", "scores", scores)
                return
            }
        }
      }
}
