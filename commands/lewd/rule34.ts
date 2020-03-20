import axios from "axios"
import Booru from "booru"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Rule34 extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: `Searches for anime pictures on rule34 (disabled).`,
            help:
            `
            \`rule34\` - Gets a random sfw image
            \`rule34 r18 query?\` - Gets a nsfw image (random or with a query)
            \`rule34 url/id\` - Gets the image by url or id
            `,
            examples:
            `
            \`=>rule34 anime\`
            \`=>rule34\`
            `,
            aliases: ["r34"],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        return message.reply("This command is disabled for the time being...")
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
        const rule34 = Booru("rule34")
        const rule34Embed = embeds.createEmbed()
        .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
        .setTitle(`**Rule34 Search** ${discord.getEmoji("gabLewd")}`)

        let tags
        if (!args[1]) {
            tags = ["1girl", "rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
            if (!perms.checkNSFW()) return
            tags = Functions.combineArgs(args, 2).split(",")
            if (!tags.join("")) tags = ["1girl"]
            tags.push("-rating:safe")
        } else {
            tags = Functions.combineArgs(args, 1).split(",")
            tags.push("rating:safe")
        }

        const tagArray: string[] = []
        for (let i = 0; i < tags.length; i++) {
            tagArray.push(tags[i].trim().replace(/ /g, "_"))
        }

        let url
        if (tags.join("").match(/\d\d+/g)) {
            const rawUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${tags.join("").match(/\d\d+/g)}`
            url = rawUrl.replace(/34,/g, "")
        } else {
            const image = await rule34.search(tagArray, {limit: 1, random: true})
            url = rule34.postView(image[0].id)
        }

        const rawID = url.match(/\d+/g)!.join("")
        const id = rawID.slice(2)
        let result
        try {
            result = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&id=${id}`, {headers})
        } catch {
            return this.invalidQuery(rule34Embed, "The url is invalid.")
        }
        console.log(result)
        const img = result.data[0]
        if (img.rating !== "s") {
            if (!perms.checkNSFW()) return
        }
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
