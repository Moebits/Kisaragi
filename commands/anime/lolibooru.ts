import Booru from "booru";
import {Message} from "discord.js";

exports.run = async (client: any, message: Message, args: string[]) => {
    const lolibooru = Booru("lolibooru");
    const lolibooruEmbed = client.createEmbed();
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
        lolibooruEmbed
        .setAuthor("lolibooru", "https://i.imgur.com/vayyvC4.png")
        .setTitle(`**Lolibooru Search** ${client.getEmoji("gabLewd")}`)
        .setDescription("No results were found. Underscores are not required, " +
        "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
        "on the lolibooru website.\n" + "[lolibooru Website](https://lolibooru.moe//)")
        message.channel.send(lolibooruEmbed)
        return;
    }

    let tagArray: any = [];
    for (let i in tags) {
        tagArray.push(tags[i].trim().replace(/ /g, "_"));
    }

    let url;
    if (tags.join("").match(/\d\d+/g)) {
        url = `https://lolibooru.net/post/show/${tags.join("").match(/\d+/g)}/`
    } else {
        let img = await lolibooru.search(tagArray, {limit: 1, random: true})
        console.log(img)
        url = await lolibooru.postView(img[0].id)
    }

    let id = url.match(/\d+/g).join("");
    
    let result = await axios.get(`https://lolibooru.moe/post/index.json?tags=id:${id}`)
    let img = result.data[0];
    lolibooruEmbed
    .setAuthor("lolibooru", "https://i.imgur.com/vayyvC4.png")
    .setURL(url)
    .setTitle(`**Lolibooru Image** ${client.getEmoji("gabLewd")}`)
    .setDescription(
        `${client.getEmoji("star")}_Source:_ ${img.source}\n` +
        `${client.getEmoji("star")}_Uploader:_ **${img.author}**\n` +
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(img.created_at*1000)}**\n` +
        `${client.getEmoji("star")}_Tags:_ ${client.checkChar(img.tags, 1900, " ")}\n` 
    )
    .setImage(img.sample_url.replace(/ /g, ""))
    message.channel.send(lolibooruEmbed);
}