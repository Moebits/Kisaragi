import axios from "axios"
import Booru from "booru"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Rule34 extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: `Searches for anime pictures on rule34.`,
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
            cooldown: 10,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
        const rule34 = Booru("rule34")
        const rule34Embed = embeds.createEmbed()
        .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
        .setTitle(`**Rule34 Search** ${discord.getEmoji("gabLewd")}`)

        let tags: string[] = []
        if (!args[1]) {
            tags = ["1girl", "rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
            if (!perms.checkNSFW(true)) return
            tags = Functions.combineArgs(args, 2).split(",")
            if (!tags.join("")) tags = ["1girl"]
            if (discord.checkMuted(message)) {
                tags.push("rating:safe")
            } else {
                tags.push("-rating:safe")
            }
        } else {
            tags = Functions.combineArgs(args, 1).split(",")
            tags.push("rating:safe")
        }

        const tagArray: string[] = []
        for (let i = 0; i < tags.length; i++) {
            tagArray.push(tags[i].trim().replace(/ /g, "_"))
        }

        let images: any[] = []
        if (tags.join("").match(/\d\d+/g)) {
            try {
                images = [await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&id=${tags.join("").match(/\d\d+/g)}`, {headers}).then((r) => r.data)]
            } catch {
                return this.invalidQuery(rule34Embed, "The url is invalid.")
            }
        } else {
            const rawImages = rule34.search(tagArray, {limit: 50, random: true})
            if (!rawImages[0]) {
                return this.invalidQuery(rule34Embed, "Underscores are not required, " +
                "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                "on the [**rule34 Website**](https://rule34.xxx//)")
            }
            // @ts-ignore
            images = rawImages.map((i) => i.data)
        }
        console.log(images)
        const rule34Array: MessageEmbed[] = []
        for (let i = 0; i < images.length; i++) {
            const img = images[i]
            if (img.rating !== "s") {
                if (!perms.checkNSFW()) continue
            }
            const rule34Embed = embeds.createEmbed()
            .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
            .setTitle(`**Rule34 Search** ${discord.getEmoji("gabLewd")}`)
            .setURL(`https://rule34.xxx/index.php?page=post&s=view&id=${img.id}`)
            .setDescription(
                `${discord.getEmoji("star")}_Score:_ **${img.score}**\n` +
                `${discord.getEmoji("star")}_Uploader:_ **${img.owner}**\n` +
                `${discord.getEmoji("star")}_Tags:_ ${Functions.checkChar(img.tags, 1900, " ")}\n`
            )
            .setImage(`https://us.rule34.xxx/images/${img.directory}/${img.image}`)
            rule34Array.push(rule34Embed)
        }
        if (!rule34Array[0]) {
            return this.invalidQuery(rule34Embed)
        }
        if (rule34Array.length === 1) {
            message.channel.send(rule34Array[0])
        } else {
            embeds.createReactionEmbed(rule34Array, true, true)
        }
    }
}
