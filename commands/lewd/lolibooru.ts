import axios from "axios"
import Booru from "booru"
import {Message, EmbedBuilder} from "discord.js"
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
            \`lolibooru r18\` - Gets a random r18 image.
            \`lolibooru r18 tag\` - Gets an r18 image with the tag.
            `,
            examples:
            `
            \`=>lolibooru\`
            \`=>lolibooru kanna kamui\`
            `,
            aliases: ["lb"],
            cooldown: 20,
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
        .setAuthor({name: "lolibooru", iconURL: "https://i.imgur.com/vayyvC4.png"})
        .setTitle(`**Lolibooru Image** ${discord.getEmoji("gabLewd")}`)

        let tags: string[] = []
        if (!args[1]) {
            tags = ["pantyhose", "rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
            if (!perms.checkNSFW()) return
            tags = Functions.combineArgs(args, 2).split(",")
            if (!tags.join("")) tags = ["pantyhose"]
            if (discord.checkMuted(message)) {
                tags.push("rating:safe")
            } else {
                tags.push("-rating:safe")
            }
        } else {
            tags = Functions.combineArgs(args, 1).split(",")
            if (!tags.join("")) tags = ["pantyhose"]
            tags.push("rating:safe")
        }

        const tagArray: string[] = []
        for (let i = 0; i < tags.length; i++) {
            tagArray.push(tags[i].trim().replace(/ /g, "_"))
        }

        let images: any[] = []
        if (tags.join("").match(/\d\d+/g)) {
            try {
                images = [await axios.get(`https://lolibooru.moe/post/index.json?tags=id:${tags.join("").match(/\d\d+/g)}`, {headers}).then((r) => r.data)]
            } catch {
                return this.invalidQuery(lolibooruEmbed, "The url is invalid.")
            }
        } else {
            const rawImages = await lolibooru.search(tagArray, {limit: 50, random: true})
            if (!rawImages[0]) {
                return this.invalidQuery(lolibooruEmbed, "Underscores are not required, " +
                "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                "on the [**Lolibooru Website**](https://lolibooru.moe//)")
            }
            // @ts-ignore
            images = rawImages.map((i) => i.data)
        }
        const lolibooruArray: EmbedBuilder[] = []
        for (let i = 0; i < images.length; i++) {
            const img = images[i]
            if (img.rating !== "s") {
                if (!perms.checkNSFW(true)) continue
            }
            const lolibooruEmbed = embeds.createEmbed()
            .setAuthor({name: "lolibooru", iconURL: "https://i.imgur.com/vayyvC4.png"})
            .setTitle(`**Lolibooru Image** ${discord.getEmoji("gabLewd")}`)
            .setURL(`https://lolibooru.net/post/show/${img.id}`)
            .setDescription(
                `${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
                `${discord.getEmoji("star")}_Uploader:_ **${img.author}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(img.created_at*1000))}**\n` +
                `${discord.getEmoji("star")}_Tags:_ ${Functions.checkChar(img.tags, 1900, " ")}\n`
            )
            .setImage(img.sample_url.replace(/ /g, ""))
            lolibooruArray.push(lolibooruEmbed)
        }
        if (!lolibooruArray[0]) {
            return this.invalidQuery(lolibooruEmbed)
        }
        if (lolibooruArray.length === 1) {
            message.channel.send({embeds: [lolibooruArray[0]]})
        } else {
            embeds.createReactionEmbed(lolibooruArray, true, true)
        }
    }
}
