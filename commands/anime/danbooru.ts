import axios from "axios"
import Booru from "booru"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Danbooru extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const danbooru = Booru("danbooru", process.env.DANBOORU_API_KEY)
        const danbooruEmbed = embeds.createEmbed()

        let tags
        if (!args[1]) {
            tags = ["rating:safe"]
        } else if (args[1].toLowerCase() === "r18") {
            if (!perms.checkNSFW()) return
            tags = Functions.combineArgs(args, 2).split(",")
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
            const image = await danbooru.search(tagArray, {limit: 1})
            if (!image[0]) {
                danbooruEmbed
                .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
                .setTitle(`**Danbooru Search** ${discord.getEmoji("gabLewd")}`)
                .setDescription("No results were found. Underscores are not required, " +
                "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                "on the danbooru website.\n" + "[Danbooru Website](https://danbooru.donmai.us/)")
                message.channel.send(danbooruEmbed)
                return
            }
            url = danbooru.postView(image[0].id)
        }

        const result = await axios.get(`${url}.json`)
        const img = result.data
        danbooruEmbed
        .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
        .setURL(url)
        .setTitle(`**Danbooru Image** ${discord.getEmoji("gabLewd")}`)
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
