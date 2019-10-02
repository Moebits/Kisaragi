import {createCanvas} from "canvas"
import {Message, MessageAttachment} from "discord.js"
import * as imageDataURI from "image-data-uri"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Points} from "./../../structures/Points"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Rank extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const points = new Points(discord)

        const canvas = createCanvas(200, 5)
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, 200, 5)
        const rawPointThreshold = await sql.fetchColumn("points", "point threshold")
        const pointThreshold = Number(rawPointThreshold)

        const userScore = await points.fetchScore(message)
        const userLevel = await points.fetchLevel(message)

        const rankEmbed: any = embeds.createEmbed()

        if (userScore === (null || undefined)) {
            message.channel.send(rankEmbed
                .setDescription("Could not find a score for you!"))
        } else {
            const percent: number = (100 / pointThreshold) * (userScore % pointThreshold)
            const width: number = (percent / 100) * 200
            ctx.fillStyle = "#ff3d9b"
            ctx.fillRect(0, 0, width, 5)
            const dataUrl = canvas.toDataURL()
            await imageDataURI.outputFile(dataUrl, `../assets/images/rankBar.jpg`)
            const attachment = new MessageAttachment(`../assets/images/rankBar.jpg`)
            message.channel.send(rankEmbed
                .setTitle(`**${message.author!.username}'s Rank ${discord.getEmoji("kannaXD")}**`)
                .setDescription(
                `${discord.getEmoji("star")}_Level_: **${userLevel}**\n` +
                `${discord.getEmoji("star")}_Points_: **${userScore}**\n` +
                `${discord.getEmoji("star")}_Progress_: ${userScore}/${(pointThreshold * userLevel!) + pointThreshold}\n` +
                `${discord.getEmoji("star")}**${percent.toFixed(1)}%** of the way there!`)
                .attachFiles([attachment])
                .setImage(`attachment://rankBar.jpg`)
                .setThumbnail(message.author!.displayAvatarURL))

        }
    }
}
