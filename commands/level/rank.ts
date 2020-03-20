import {createCanvas} from "canvas"
import {Message, MessageAttachment} from "discord.js"
import path from "path"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Points} from "./../../structures/Points"
import {SQLQuery} from "./../../structures/SQLQuery"

const imageDataURI = require("image-data-uri")

export default class Rank extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts your rank (disabled).",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const points = new Points(discord, message)
        return message.reply("This command is disabled for the time being...")

        const canvas = createCanvas(200, 5)
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, 200, 5)
        const rawPointThreshold = await sql.fetchColumn("points", "point threshold")
        const pointThreshold = Number(rawPointThreshold)

        const userScore = await points.fetchScore()
        const userLevel = await points.fetchLevel()

        const rankEmbed = embeds.createEmbed()

        if (userScore === (null || undefined)) {
            message.channel.send(rankEmbed
                .setDescription("Could not find a score for you!"))
        } else {
            const percent: number = (100 / pointThreshold) * (userScore! % pointThreshold)
            const width: number = (percent / 100) * 200
            ctx.fillStyle = "#ff3d9b"
            ctx.fillRect(0, 0, width, 5)
            const dataUrl = canvas.toDataURL()
            await imageDataURI.outputFile(dataUrl, path.join(__dirname, `../../../assets/images/dump/rankBar.jpg`))
            const attachment = new MessageAttachment(path.join(__dirname, `../../../assets/images/dump/rankBar.jpg`))
            message.channel.send(rankEmbed
                .setTitle(`**${message.author!.username}'s Rank ${discord.getEmoji("kannaXD")}**`)
                .setDescription(
                `${discord.getEmoji("star")}_Level_: **${userLevel}**\n` +
                `${discord.getEmoji("star")}_Points_: **${userScore}**\n` +
                `${discord.getEmoji("star")}_Progress_: ${userScore}/${(pointThreshold * userLevel!) + pointThreshold}\n` +
                `${discord.getEmoji("star")}**${percent.toFixed(1)}%** of the way there!`)
                .attachFiles([attachment])
                .setImage(`attachment://rankBar.jpg`)
                .setThumbnail(message.author!.displayAvatarURL()))

        }
    }
}
