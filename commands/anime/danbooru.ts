import axios from "axios"
import Booru from "booru"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Danbooru extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Search for anime pictures on danbooru.",
            help:
            `
            _Note: Underscores are not required._
            \`danbooru\` - Get a random image.
            \`danbooru link/id\` - Gets the image from the link.
            \`danbooru tag\` - Gets an image with the tag.
            \`danbooru r18\` - Get a random r18 image.
            \`danbooru r18 tag\` - Get an r18 image with the tag.
            `,
            examples:
            `
            \`=>danbooru\`
            \`=>danbooru tenma gabriel white\`
            \`=>danbooru r18 gabriel dropout\`
            `,
            aliases: ["d", "dan"],
            image: "../assets/help images/anime/danbooru.png",
            cooldown: 20
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const danbooru = Booru("danbooru", process.env.DANBOORU_API_KEY)
        const danbooruEmbed = embeds.createEmbed()
        .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
        .setTitle(`**Danbooru Search** ${discord.getEmoji("gabLewd")}`)

        let tags
        if (!args[1]) {
            tags = ["1girl", "rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
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
            url = `https://danbooru.donmai.us/posts/${tags.join("").match(/\d+/g)}`
        } else {
            const image = await danbooru.search(tagArray, {limit: 100})
            const random = Math.floor(Math.random() * image.length)
            if (!image[0]) {
                return this.invalidQuery(danbooruEmbed, "Underscores are not required, " +
                "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                "on the danbooru website.\n" + "[Danbooru Website](https://danbooru.donmai.us/)")
            }
            url = danbooru.postView(image[random].id)
        }
        const result = await axios.get(`${url}.json`)
        const img = result.data
        if (img.rating !== "s") {
            if (!perms.checkNSFW()) return
        }
        danbooruEmbed
        .setURL(url)
        .setDescription(
            `${discord.getEmoji("star")}_Character:_ **${img.tag_string_character ? Functions.toProperCase(img.tag_string_character.replace(/ /g, "\n").replace(/_/g, " ")) : "Original"}**\n` +
            `${discord.getEmoji("star")}_Artist:_ **${Functions.toProperCase(img.tag_string_artist.replace(/_/g, " "))}**\n` +
            `${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
            `${discord.getEmoji("star")}_Uploader:_ **${img.uploader_name}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(img.created_at)}**\n` +
            `${discord.getEmoji("star")}_Tags:_ ${Functions.checkChar(img.tag_string_general, 2048, " ")}\n`
        )
        .setImage(img.file_url)
        message.channel.send(danbooruEmbed)
    }
}
