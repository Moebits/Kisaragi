import Booru from "booru"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Rule34 extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const rule34 = Booru("rule34")
        const rule34Embed = embeds.createEmbed()
        const axios = require("axios")

        let tags
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
            rule34Embed
            .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
            .setTitle(`**Rule34 Search** ${discord.getEmoji("gabLewd")}`)
            .setDescription("No results were found. Underscores are not required, " +
            "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
            "on the rule34 website.\n" + "[rule34 Website](https://rule34.xxx//)")
            message.channel.send(rule34Embed)
            return
        }

        const tagArray: any = []
        for (const i in tags) {
            tagArray.push(tags[i].trim().replace(/ /g, "_"))
        }

        let url
        if (tags.join("").match(/\d+/g)) {
            const rawUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${tags.join("").match(/\d+/g)}`
            url = rawUrl.replace(/34,/g, "")
        } else {
            const image = await rule34.search(tagArray, {limit: 1, random: true})
            url = rule34.postView(image[0].id)
        }

        const rawID = url.match(/\d+/g).join("")
        const id = rawID.slice(2)
        const result = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&id=${id}`)
        const img = result.data[0]
        console.log(img)
        rule34Embed
        .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
        .setURL(url)
        .setTitle(`**Rule34 Image** ${discord.getEmoji("gabLewd")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Score:_ **${img.score}**\n` +
            `${discord.getEmoji("star")}_Uploader:_ **${img.owner}**\n` +
            `${discord.getEmoji("star")}_Tags:_ ${Functions.checkChar(img.tags, 1900, " ")}\n`
        )
        .setImage(`https://us.rule34.xxx/images/${img.directory}/${img.image}`)
        message.channel.send(rule34Embed)
    }
}
