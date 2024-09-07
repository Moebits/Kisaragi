import {createCanvas} from "@napi-rs/canvas"
import {Message, AttachmentBuilder} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import fs from "fs"
import path from "path"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Points} from "./../../structures/Points"
import {SQLQuery} from "./../../structures/SQLQuery"

const imageDataURI = require("image-data-uri")

export default class Rank extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Posts your rank (level and score).",
            help:
            `
            \`rank\` - Posts your rank
            `,
            examples:
            `
            \`=>rank\`
            `,
            aliases: ["score", "level", "xp"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const points = new Points(discord, message)

        const canvas = createCanvas(200, 5)
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, 200, 5)
        const pointThreshold = await sql.fetchColumn("guilds", "point threshold").then((p) => Number(p))

        const {score, level} = await points.fetchScore()

        const rankEmbed = embeds.createEmbed()
        let percent = (100 / pointThreshold) * (score % pointThreshold)
        if (percent < 0) percent = 100 + percent
        const width = (percent / 100) * 200
        ctx.fillStyle = "#ff3d9b"
        ctx.fillRect(0, 0, width, 5)
        const dataUrl = canvas.toDataURL()
        let image = path.join(__dirname, `../../assets/misc/images/dump/rankBar.jpg`)
        let i = 1
        while (fs.existsSync(image)) {
            image = path.join(__dirname, `../../assets/misc/images/dump/rankBar${i}.jpg`)
            i++
        }
        await imageDataURI.outputFile(dataUrl, image)
        const attachment = new AttachmentBuilder(image)
        rankEmbed
        .setTitle(`**${message.author!.username}'s Rank ${discord.getEmoji("cute")}**`)
        .setDescription(
        `${discord.getEmoji("star")}_Level_: **${level}**\n` +
        `${discord.getEmoji("star")}_Points_: **${score}**\n` +
        `${discord.getEmoji("star")}_Progress_: ${score}/${(pointThreshold * level!) + pointThreshold}\n` +
        `${discord.getEmoji("star")}**${percent.toFixed(1)}%** of the way there!`)
        .setImage(`attachment://rankBar.jpg`)
        .setThumbnail(message.author.displayAvatarURL({extension: "png"}))
        await message.channel.send({embeds: [rankEmbed], files: [attachment]})
        fs.unlink(image, () => null)
    }
}
