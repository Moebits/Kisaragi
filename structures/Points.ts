import {Message} from "discord.js"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"

export class Points {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    /** Adds level up roles */
    public levelRoles = async (user: any, batch?: boolean) => {
        const sql = new SQLQuery(this.message)
        const embeds = new Embeds(this.discord, this.message)
        const roles = await sql.fetchColumn("points", "level roles")
        if (!roles?.[0]) return
        let add = false
        let remove = false
        let first = true
        let batchRoles: string[] = []
        for (let i = 0; i < roles.length; i++) {
            const curr = JSON.parse(roles[i])
            if (Number(user.level) >= Number(curr.level)) {
                const role = this.message.guild?.roles.cache.get(curr.role)
                if (!role) continue
                try {
                    await this.message.member?.roles.add(role)
                } catch {
                    return this.message.channel.send(`I need the **Manage Roles** permission to add level up roles ${this.discord.getEmoji("kannaFacepalm")}`)
                }
                if (batch) {
                    if (remove) continue
                    batchRoles.push(role.id)
                    add = true
                } else {
                    let levelMessage = curr.message ? curr.message : `Congrats user, you now have the role rolename! ${this.discord.getEmoji("kannaWave")}`
                    levelMessage = levelMessage.replace("user", `<@${this.message.author!.id}>`).replace("tag", `**${this.message.author.tag}**`).replace("rolename", role.name).replace("name", `**${this.message.author.username}**`).replace("rolemention", `<@&${role.id}>`)
                    await this.message.channel.send(levelMessage)
                }
            } else if (Number(user.level) < Number(curr.level)) {
                const role = this.message.guild?.roles.cache.get(curr.role)
                if (!role) continue
                await this.message.member?.roles.remove(role).catch(() => null)
                if (add) continue
                remove = true
                if (first) {
                    batchRoles = []
                    first = false
                }
                if (batch) batchRoles.push(role.id)
            }
        }
        if (batch) {
            let roleMessage = add ? `<@${user.id}> gained the role(s) rolementions!` : `<@${user.id}> lost the role(s) rolementions!`
            const title = add ? `**Level Role Add** ${this.discord.getEmoji("aquaUp")}` : `**Level Role Remove** ${this.discord.getEmoji("sagiriBleh")}`
            const authorText = add ? `role add` : `role remove`
            const authorImage = add ? `https://cdn4.iconfinder.com/data/icons/material-design-content-icons/512/add-circle-512.png` : `https://img.icons8.com/plasticine/2x/filled-trash.png`
            roleMessage = roleMessage.replace("rolementions", batchRoles.map((r) => `<@&${r}>`).join(", "))
            const levelRoleEmbed = embeds.createEmbed()
            levelRoleEmbed
            .setAuthor(authorText, authorImage)
            .setTitle(title)
            .setDescription(roleMessage)
            await this.message.channel.send(levelRoleEmbed)
        }
    }

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
                        levelUpMessage = levelUpMessage.replace("user", `<@${this.message.author!.id}>`).replace("tag", `**${this.message.author.tag}**`).replace("name", `**${this.message.author.username}**`)
                        levelUpMessage = levelUpMessage.replace("newlevel", `**${newLevel}**`).replace("newlevel", `**${newLevel}**`).replace("totalpoints", `**${user.score}**`)
                        user.level = newLevel
                        scores[i] = JSON.stringify(user)
                        await sql.updateColumn("points", "scores", scores)
                        const levelEmbed = embeds.createEmbed()
                        levelEmbed
                        .setTitle(`**Level Up!** ${this.discord.getEmoji("karenXmas")}`)
                        .setDescription(levelUpMessage)
                        await this.message.channel.send(levelEmbed)
                        await this.levelRoles(user, true)
                    }

                    if (newLevel < user.level) {
                        user.level = newLevel
                        scores[i] = JSON.stringify(user)
                        await sql.updateColumn("points", "scores", scores)
                        const levelEmbed = embeds.createEmbed()
                        levelEmbed
                        .setTitle(`**Level Down!** ${this.discord.getEmoji("kaosWTF")}`)
                        .setDescription(`You were leveled down to level **${newLevel}**!`)
                        await this.message.channel.send(levelEmbed)
                        await this.levelRoles(user, true)
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
        const levelChannels = await sql.fetchColumn("points", "level channels")
        if (!toggle || toggle === "off") return
        if (levelChannels?.includes(this.message.channel.id)) return
        const scores = await sql.fetchColumn("points", "scores")
        let pointRange = await sql.fetchColumn("points", "point range")
        let pointThreshold = await sql.fetchColumn("points", "point threshold")
        let levelUpMessage = await sql.fetchColumn("points", "level message")
        pointRange = pointRange?.map((num: string) => Number(num))
        pointThreshold = Number(pointThreshold)
        levelUpMessage = levelUpMessage.replace("user", `<@${this.message.author.id}>`).replace("tag", `**${this.message.author.tag}**`).replace("name", `**${this.message.author.username}**`)
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
        if (!idList?.includes(this.message.author.id)) {
            scores.push({id: this.message.author.id, score: 0, level: 0})
            await sql.updateColumn("points", "scores", scores)
            return
        }

        for (let i = 0; i < scores.length; i++) {
            const user = JSON.parse(scores[i])
            if (user.id === this.message.author.id) {
                const newPoints = Math.floor(user.score + Functions.getRandomNum(pointRange[0], pointRange[1]))
                const newLevel = Math.floor(user.score / pointThreshold)
                levelUpMessage = levelUpMessage.replace("newlevel", `**${newLevel}**`).replace("totalpoints", `**${newPoints}**`)

                if (newLevel > user.level) {
                    user.level = newLevel
                    scores[i] = JSON.stringify(user)
                    await sql.updateColumn("points", "scores", scores)
                    const levelEmbed = embeds.createEmbed()
                    levelEmbed
                    .setTitle(`**Level Up!** ${this.discord.getEmoji("karenXmas")}`)
                    .setDescription(levelUpMessage)
                    await this.message.channel.send(levelEmbed)
                    await this.levelRoles(user)
                }
                user.score = newPoints
                scores[i] = JSON.stringify(user)
                await sql.updateColumn("points", "scores", scores)
                return
            }
        }
      }
}
