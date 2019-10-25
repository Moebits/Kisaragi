import axios from "axios"
import Booru from "booru"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Yandere extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for images on yandere.",
            help:
            `
            _Note: Underscores are not required._
            \`yandere\` - Get a random image.
            \`yandere link/id\` - Gets the image from the link.
            \`yandere tag\` - Gets an image with the tag.
            \`yandere r18\` - Get a random r18 image.
            \`yandere r18 tag\` - Get an r18 image with the tag.
            `,
            examples:
            `
            \`=>yandere\`
            \`=>yandere kisaragi (azur lane)\`
            \`=>yandere r18 azur lane\`
            `,
            aliases: ["y", "ydere"],
            cooldown: 20
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const star = discord.getEmoji("star")
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const yandere = Booru("yande.re", process.env.yandere_API_KEY)
        const yandereEmbed = embeds.createEmbed()
        .setAuthor("yandere", "https://i.imgur.com/5DiQTnW.png")
        .setTitle(`**Yandere Image** ${discord.getEmoji("gabLewd")}`)

        let tags: string[]
        if (!args[1]) {
            tags = ["loli", "rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
            tags = Functions.combineArgs(args, 2).split(",")
            if (!tags.join("")) tags = ["loli"]
            tags.push("-rating:safe")
        } else {
            tags = Functions.combineArgs(args, 1).split(",")
            if (!tags.join("")) tags = ["loli"]
            tags.push("rating:safe")
        }

        const tagArray: string[] = []
        for (let i = 0; i < tags.length; i++) {
            tagArray.push(tags[i].trim().replace(/ /g, "_"))
        }

        let url
        if (tags.join("").match(/\d\d+/g)) {
            url = `https://yande.re/post/show/${tags.join("").match(/\d\d+/g)}/`
        } else {
            const image = await yandere.search(tagArray, {limit: 1, random: true})
            if (!image[0]) {
                return this.invalidQuery(yandereEmbed, "Underscores are not required, " +
                "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                "on the [**Yandere Website**](https://yande.re//)")
            }
            url = yandere.postView(image[0].id)
        }

        const id = url.match(/\d+/g)!.join("")
        const result = await axios.get(`https://yande.re/post/index.json?tags=id:${id}`)
        const img = result.data[0]
        if (!img) return this.invalidQuery(yandereEmbed, "The url is invalid.")
        if (img.rating !== "s") {
            if (!perms.checkNSFW()) return
        }
        yandereEmbed
        .setURL(url)
        .setDescription(
            `${star}_Source:_ ${img.source}\n` +
            `${star}_Uploader:_ **${img.author}**\n` +
            `${star}_Creation Date:_ **${Functions.formatDate(new Date(img.created_at*1000))}**\n` +
            `${star}_Tags:_ ${Functions.checkChar(img.tags, 1900, " ")}\n`
        )
        .setImage(img.sample_url.replace(/ /g, ""))
        message.channel.send(yandereEmbed)
    }
}
