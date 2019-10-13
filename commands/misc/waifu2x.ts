import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Waifu2x extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Upscale an image with waifu2x.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        let imgUrl
        if (!args[1]) {
            const messages = await message.channel.messages.fetch({limit: 10})
            const imgUrls = messages.filter((m: Message) => m.attachments.size ? true : false)
            imgUrl = imgUrls.first()!.attachments.first()!.url
        } else {
            imgUrl = args[1]
        }

        const deepai = require("deepai")
        deepai.setApiKey(process.env.DEEP_API_KEY)

        const response = await deepai.callStandardApi("waifu2x", {
            image: imgUrl
        })

        const waifuEmbed = embeds.createEmbed()
        waifuEmbed
        .setAuthor("waifu2x", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9hWZ1ptE9IrNWOUqHzcf9OFD7RMMQEXeUwqpE3zCMB8PWD8Caeg")
        .setTitle(`**Waifu 2x Image Resizing** ${discord.getEmoji("gabYes")}`)
        .setURL(response.output_url)
        .setImage(response.output_url)
        message.channel.send(waifuEmbed)

    }
}
