import Booru from "booru"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Yandere extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const yandere = Booru("yande.re", process.env.yandere_API_KEY)
        const yandereEmbed = embeds.createEmbed()
        const axios = require("axios")

        let tags: string[]
        if (!args[1]) {
            tags = ["rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
            tags = Functions.combineArgs(args, 2).split(",")
            tags.push("-rating:safe")
        } else {
            tags = Functions.combineArgs(args, 1).split(",")
            tags.push("rating:safe")
        }

        if (!tags.join(" ")) {
            yandereEmbed
        .setAuthor("yandere", "https://i.imgur.com/5DiQTnW.pngE")
            .setTitle(`**Yandere Search** ${discord.getEmoji("gabLewd")}`)
            .setDescription("No results were found. Underscores are not required, " +
            "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
            "on the yandere website.\n" + "[yandere Website](https://yande.re//)")
            message.channel.send(yandereEmbed)
            return
        }

        const tagArray: string[] = []
        for (let i = 0; i < tags.length; i++) {
            tagArray.push(tags[i].trim().replace(/ /g, "_"))
        }

        let url
        if (tags.join("").match(/\d\d+/g)) {
            url = `https://yande.re/post/show/${tags.join("").match(/\d+/g)}/`
        } else {
            const image = await yandere.search(tagArray, {limit: 1, random: true})
            url = yandere.postView(image[0].id)
        }

        const id = url.match(/\d+/g)!.join("")
        const result = await axios.get(`https://yande.re/post/index.json?tags=id:${id}`)
        const img = result.data[0]
        console.log(img)
        yandereEmbed
        .setAuthor("yandere", "https://i.imgur.com/5DiQTnW.png")
        .setURL(url)
        .setTitle(`**Yandere Image** ${discord.getEmoji("gabLewd")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
            `${discord.getEmoji("star")}_Uploader:_ **${img.author}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(img.created_at*1000))}**\n` +
            `${discord.getEmoji("star")}_Tags:_ ${Functions.checkChar(img.tags, 1900, " ")}\n`
        )
        .setImage(img.sample_url.replace(/ /g, ""))
        message.channel.send(yandereEmbed)
    }
}
