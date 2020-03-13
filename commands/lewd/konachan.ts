import axios from "axios"
import Booru from "booru"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Konachan extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Search for anime pictures on konachan.",
            help:
            `
            _Note: Underscores are not required._
            \`konachan\` - Get a random image.
            \`konachan link/id\` - Gets the image from the link.
            \`konachan tag\` - Gets an image with the tag.
            \`konachan r18\` - Get a random r18 image.
            \`konachan r18 tag\` - Get an r18 image with the tag.
            `,
            examples:
            `
            \`=>konachan\`
            \`=>konachan kisaragi (azur lane)\`
            \`=>konachan r18 azur lane\`
            `,
            aliases: ["k", "kona", "kchan"],
            random: "none",
            cooldown: 20
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
        const konachan = Booru("konachan.com", process.env.KONACHAN_API_KEY)
        const konachanEmbed = embeds.createEmbed()
        .setTitle(`**Konachan Image** ${discord.getEmoji("gabLewd")}`)
        .setAuthor("konachan", "https://lh3.googleusercontent.com/U_veaCEvWC-ebOBbwhUhTJtNdDKyAhKsJXmDFeZ2xV2jaoIPNbRhzK7nGlKpQtusbHE")

        let tags
        if (!args[1]) {
            tags = ["loli", "rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
            tags = Functions.combineArgs(args, 2).split(",")
            if (!tags) tags = ["loli"]
            tags.push("-rating:safe")
        } else {
            tags = Functions.combineArgs(args, 1).split(",")
            if (!tags) tags = ["loli"]
            tags.push("rating:safe")
        }

        const tagArray: string[] = []
        for (let i = 0; i < tags.length; i++) {
            tagArray.push(tags[i].trim().replace(/ /g, "_"))
        }

        let url
        if (tags.join("").match(/\d\d+/g)) {
            url = `https://konachan.net/post/show/${tags.join("").match(/\d\d+/g)}/`
        } else {
            const image = await konachan.search(tagArray, {limit: 1, random: true})
            if (!image[0]) {
                return this.invalidQuery(konachanEmbed, "Underscores are not required, " +
                "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                "on the [**Konachan Website**](https://konachan.com//)")
            }
            url = konachan.postView(image[0].id)
        }

        const id = url.match(/\d\d+/g)!.join("")
        const result = await axios.get(`https://konachan.com/post.json?tags=id:${id}`, {headers})
        const img = result.data[0]
        if (!img) return this.invalidQuery(konachanEmbed, "The url is invalid.")
        if (img.rating !== "s") {
            if (!perms.checkNSFW()) return
        }
        konachanEmbed
        .setURL(url)
        .setDescription(
            `${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
            `${discord.getEmoji("star")}_Uploader:_ **${img.author}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(img.created_at*1000))}**\n` +
            `${discord.getEmoji("star")}_Tags:_ ${Functions.checkChar(img.tags, 1900, " ")}\n`
        )
        .setImage(img.sample_url)
        message.channel.send(konachanEmbed)
    }
}
