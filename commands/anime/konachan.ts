import Booru from "booru";
import {Message} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => {
    const konachan = Booru("konachan.com", process.env.KONACHAN_API_KEY);
    const konachanEmbed = discord.createEmbed();
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
        konachanEmbed
    .setAuthor("konachan", "https://lh3.googleusercontent.com/U_veaCEvWC-ebOBbwhUhTJtNdDKyAhKsJXmDFeZ2xV2jaoIPNbRhzK7nGlKpQtusbHE")
        .setTitle(`**Konachan Search** ${discord.getEmoji("gabLewd")}`)
        .setDescription("No results were found. Underscores are not required, " +
        "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
        "on the konachan website.\n" + "[Konachan Website](https://konachan.com//)")
        message.channel.send(konachanEmbed)
        return;
    }

    let tagArray: any = [];
    for (let i in tags) {
        tagArray.push(tags[i].trim().replace(/ /g, "_"));
    }

    let url;
    if (tags.join("").match(/\d+/g)) {
        url = `https://konachan.net/post/show/${tags.join("").match(/\d+/g)}/`
    } else {
        let img = await konachan.search(tagArray, {limit: 1, random: true})
        url = await konachan.postView(img[0].id)
    }

    let id = url.match(/\d\d+/g).join("");
    let result = await axios.get(`https://konachan.com/post.json?tags=id:${id}`)
    let img = result.data[0];
    konachanEmbed
    .setAuthor("konachan", "https://lh3.googleusercontent.com/U_veaCEvWC-ebOBbwhUhTJtNdDKyAhKsJXmDFeZ2xV2jaoIPNbRhzK7nGlKpQtusbHE")
    .setURL(url)
    .setTitle(`**Konachan Image** ${discord.getEmoji("gabLewd")}`)
    .setDescription(
        `${discord.getEmoji("star")}_Source:_ ${img.source}\n` +
        `${discord.getEmoji("star")}_Uploader:_ **${img.author}**\n` +
        `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(img.created_at*1000)}**\n` +
        `${discord.getEmoji("star")}_Tags:_ ${discord.checkChar(img.tags, 1900, " ")}\n` 
    )
    .setImage(img.sample_url)
    message.channel.send(konachanEmbed);
}