import axios from "axios"
import Booru from "booru"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Lolibooru extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for anime pictures on lolibooru",
            help:
            `
            _Note: Underscores are not required._
            \`lolibooru\` - Get a random image.
            \`lolibooru link/id\` - Gets the image from the link.
            \`lolibooru tag\` - Gets an image with the tag.
            \`lolibooru r18\` - Get a random r18 image.
            \`lolibooru r18 tag\` - Get an r18 image with the tag.
            `,
            examples:
            `
            \`=>lolibooru\`
            \`=>lolibooru kanna kamui\`
            \`=>lolibooru r18 megumin\`
            `,
            aliases: ["lb"],
            cooldown: 20,
            random: "none",
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
        const lolibooru = Booru("lolibooru")
        const lolibooruEmbed = embeds.createEmbed()
        .setAuthor("lolibooru", "https://i.imgur.com/vayyvC4.png")
        .setTitle(`**Lolibooru Image** ${discord.getEmoji("gabLewd")}`)

        let tags
        if (!args[1]) {
            tags = ["girl", "rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
            if (!perms.checkNSFW()) return
            tags = Functions.combineArgs(args, 2).split(",")
            if (!tags.join("")) tags = ["girl"]
            tags.push("-rating:safe")
        } else {
            tags = Functions.combineArgs(args, 1).split(",")
            if (!tags.join("")) tags = ["girl"]
            tags.push("rating:safe")
        }

        const tagArray: string[] = []
        for (let i = 0; i < tags.length; i++) {
            tagArray.push(tags[i].trim().replace(/ /g, "_"))
        }

        let url
        if (tags.join("").match(/\d\d+/g)) {
            url = `https://lolibooru.net/post/show/${tags.join("").match(/\d\d+/g)}/`
        } else {
            const image = await lolibooru.search(tagArray, {limit: 1, random: true})
            if (!image[0]) {
                return this.invalidQuery(lolibooruEmbed, "Underscores are not required, " +
                "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                "on the [**Lolibooru Website**](https://lolibooru.moe//)")
            }
            url = lolibooru.postView(image[0].id)
        }

        const id = url.match(/\d+/g)!.join("")

        const result = await axios.get(`https://lolibooru.moe/post/index.json?tags=id:${id}`, {headers})
        const img = result.data[0]
        if (!img) return this.invalidQuery(lolibooruEmbed, "The url is invalid.")
        if (img.rating !== "s") {
            if (!perms.checkNSFW()) return
        }
        lolibooruEmbed
        .setURL(url)
        .setDescription(
            `${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
            `${discord.getEmoji("star")}_Uploader:_ **${img.author}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(img.created_at*1000))}**\n` +
            `${discord.getEmoji("star")}_Tags:_ ${Functions.checkChar(img.tags, 1900, " ")}\n`
        )
        .setImage(img.sample_url.replace(/ /g, ""))
        message.channel.send(lolibooruEmbed)
    }
}
