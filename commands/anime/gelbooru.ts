import Booru from "booru";
import {Message} from "discord.js";

exports.run = async (client: any, message: Message, args: string[]) => {
    const gelbooru = Booru("gelbooru", process.env.GELBOORU_API_KEY);
    const gelbooruEmbed = client.createEmbed();
    let axios = require("axios");

    let tags; 
    if (!args[1]) {
        tags = ["rating:safe"];
    } else if (args[1].toLowerCase() === "r18") {
        tags = client.combineArgs(args, 2).split(",")
        tags.push("-rating:safe")
    } else {
        tags = client.combineArgs(args, 1).split(",")
        tags.push("rating:safe")
    }

    if (!tags.join(" ")) {
        gelbooruEmbed
        .setAuthor("danbooru", "https://i.imgur.com/88HP9ik.png")
        .setTitle(`**Danbooru Search** ${client.getEmoji("gabLewd")}`)
        .setDescription("No results were found. Underscores are not required, " +
        "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
        "on the gelbooru website.\n" + "[Gelbooru Website](https://gelbooru.com//)")
        message.channel.send(gelbooruEmbed)
        return;
    }

    let tagArray: any = [];
    for (let i in tags) {
        tagArray.push(tags[i].trim().replace(/ /g, "_"));
    }

    let url;
    if (tags.join("").match(/\d+/g)) {
        url = `https://gelbooru.com/index.php?page=post&s=view&id=${tags.join("").match(/\d+/g)}`
    } else {
        let img = await gelbooru.search(tagArray, {limit: 1, random: true})
        url = await gelbooru.postView(img[0].id)
    }

    let id = url.match(/\d+/g).join("");
    let result = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&id=${id}${process.env.GELBOORU_API_KEY}`)
    let img = result.data[0];
    gelbooruEmbed
    .setAuthor("gelbooru", "https://pbs.twimg.com/profile_images/1118350008003301381/3gG6lQMl.png")
    .setURL(url)
    .setTitle(`**Gelbooru Image** ${client.getEmoji("gabLewd")}`)
    .setDescription(
        `${client.getEmoji("star")}_Source:_ ${img.source}\n` +
        `${client.getEmoji("star")}_Uploader:_ **${img.owner}**\n` +
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(img.created_at)}**\n` +
        `${client.getEmoji("star")}_Tags:_ ${client.checkChar(img.tags, 1900, " ")}\n` 
    )
    .setImage(`https://img2.gelbooru.com/samples/${img.directory}/sample_${img.hash}.jpg`)
    message.channel.send(gelbooruEmbed);
}