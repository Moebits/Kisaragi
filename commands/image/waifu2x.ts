import axios from "axios"
import {Message, MessageAttachment, MessageEmbed} from "discord.js"
import * as fs from "fs"
import md5 from "md5"
import * as path from "path"
import waifu2x from "waifu2x"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {SQLQuery} from "../../structures/SQLQuery"
export default class Waifu2x extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Upscales an image with waifu2x.",
            help:
            `
            Note: If the bot isn't on a windows machine it won't work.
            \`waifu2x\` - Scales the first image found above (up to 20 messages)
            \`waifu2x url\` -Scales the image from the url
            `,
            examples:
            `
            \`=>waifu2x\`
            `,
            aliases: ["2x"],
            cooldown: 30
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const deepai = require("deepai")
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
        deepai.setApiKey(process.env.DEEP_API_KEY)

        /*
        if (args[1] === "list") {
            const data = await sql.selectColumn("waifu2x", "id")
            const users = await sql.selectColumn("waifu2x", "user")
            const dates = await sql.selectColumn("waifu2x", "date")
            const waifu2xArray: MessageEmbed[] = []
            const max = data.length > 500 ? 500 : data.length
            for (let i = 0; i < max; i++) {
                const imageURL = `https://api.deepai.org/job-view-file/${data[i]}/outputs/output.png`
                const waifu2xEmbed = embeds.createEmbed()
                waifu2xEmbed
                .setAuthor("waifu2x", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9hWZ1ptE9IrNWOUqHzcf9OFD7RMMQEXeUwqpE3zCMB8PWD8Caeg")
                .setTitle(`**Waifu 2x Upscaling** ${discord.getEmoji("gabYes")}`)
                .setDescription(`_Requested by_ \`${users[i]}\` _on_ \`${Functions.formatDate(new Date(dates[i]))}\`.`)
                .setImage(imageURL)
                .setURL(imageURL)
                waifu2xArray.push(waifu2xEmbed)
            }
            embeds.createReactionEmbed(waifu2xArray, true, true)
            return
        }*/

        let imgUrl
        if (!args[1]) {
            const messages = await message.channel.messages.fetch({limit: 100})
            let imgUrls = messages.filter((m: Message) => m.attachments.size ? true : false)
            if (!imgUrls.first()) {
                imgUrls = messages.filter((m: Message) => m.embeds?.[0]?.image ? true : false)
                imgUrl = imgUrls.first()?.embeds?.[0]?.image?.url
                if (!imgUrl) return message.reply("You must post an image first!")
            }
            imgUrl = imgUrls.first()?.attachments.first()?.url
        } else {
            imgUrl = args[1]
        }

        const resp = await deepai.callStandardApi("waifu2x", {image: imgUrl})
        const imageURL = resp.output_url

        /*
        const topDir = path.basename(__dirname).slice(0, -2) === "ts" ? "../" : ""
        const folder =  `${topDir}../assets/waifu2x`
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        const response = await axios.get(imgUrl!, {responseType: "arraybuffer"})
        const sourcePath = `${folder}/image.jpg`
        fs.writeFileSync(sourcePath, Buffer.from(response.data, "binary"))
        const absoluteFolder = `${topDir}assets/waifu2x`
        try {
            const result = waifu2x.upscaleImage(path.join(absoluteFolder, "..", sourcePath), path.join(absoluteFolder, "upscaled/image2x.png"))
        } catch {
            // do nothing
        }
        const msgAttachment = new MessageAttachment(`${folder}/upscaled/image2x.png`, "upscaled.png")
        */
        const waifuEmbed = embeds.createEmbed()
        waifuEmbed
        .setAuthor("waifu2x", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9hWZ1ptE9IrNWOUqHzcf9OFD7RMMQEXeUwqpE3zCMB8PWD8Caeg")
        .setTitle(`**Waifu 2x Upscaling** ${discord.getEmoji("gabYes")}`)
        // .attachFiles([msgAttachment])
        // .setImage(`attachment://upscaled.png`)
        .setImage(imageURL)
        .setURL(imageURL)
        return message.channel.send(waifuEmbed)
    }
}
