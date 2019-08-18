import Booru from "booru";
import {Message} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => {
    const danbooru = Booru("danbooru", process.env.DANBOORU_API_KEY);
    const danbooruEmbed = discord.createEmbed();
    let axios = require("axios");

    let tags; 
    if (!args[1]) {
        tags = ["rating:safe"];
    } else if (args[1].toLowerCase() === "r18") {
        tags = discord.combineArgs(args, 2).split(",")
        tags.push("-rating:safe")
    } else {
        tags = discord.combineArgs(args, 1).split(",")
        tags.push("rating:safe")
    }

    if (!tags.join(" ")) {
        danbooruEmbed
        .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
        .setTitle(`**Danbooru Search** ${discord.getEmoji("gabLewd")}`)
        .setDescription("No results were found. Underscores are not required, " +
        "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
        "on the danbooru website.\n" + "[Danbooru Website](https://danbooru.donmai.us/)")
        message.channel.send(danbooruEmbed)
        return;
    }

    let tagArray: any = [];
    for (let i in tags) {
        tagArray.push(tags[i].trim().replace(/ /g, "_"));
    }

    let url;
    if (tags.join("").match(/\d\d+/g)) {
        url = `https://danbooru.donmai.us/posts/${tags.join("").match(/\d+/g)}`
    } else {
        let img = await danbooru.search(tagArray, {limit: 1, random: true})
        url = await danbooru.postView(img[0].id)
    }

    let result = await axios.get(`${url}.json`)
    let img = result.data;
    danbooruEmbed
    .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
    .setURL(url)
    .setTitle(`**Danbooru Image** ${discord.getEmoji("gabLewd")}`)
    .setDescription(
        `${discord.getEmoji("star")}_Character:_ **${img.tag_string_character ? discord.toProperCase(img.tag_string_character.replace(/ /g, "\n").replace(/_/g, " ")) : "Original"}**\n` +
        `${discord.getEmoji("star")}_Artist:_ **${discord.toProperCase(img.tag_string_artist.replace(/_/g, " "))}**\n` +
        `${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
        `${discord.getEmoji("star")}_Uploader:_ **${img.uploader_name}**\n` +
        `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(img.created_at)}**\n` +
        `${discord.getEmoji("star")}_Tags:_ ${discord.checkChar(img.tag_string_general, 2048, " ")}\n` 
    )
    .setImage(img.file_url)
    message.channel.send(danbooruEmbed);
}