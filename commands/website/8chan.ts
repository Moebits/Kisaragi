import {RichEmbed} from "discord.js";

exports.run = async (client: any, message: any, args: string[]) => {
    let axios = require("axios");
    let board = args[1];
    let result = await axios.get(`https://8ch.net/${board}/0.json`)
    let random = Math.floor(Math.random() * result.data.threads.length);
    let thread = result.data.threads[random];

    client.cleanComment = (comment: string) => {
        let clean1 = comment.replace(/<\/?[^>]+(>|$)/g, "");
        let clean2 = clean1.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
        return clean2;
    }

    let chanArray: RichEmbed[] = [];
    for (let i in thread.posts) {
        let chanEmbed: RichEmbed = client.createEmbed();
        let url = `https://8ch.net/${board}/res/${thread.posts[0].no}.html`;
        let image = thread.posts[i].filename ? `https://media.8ch.net/file_store/${thread.posts[i].tim}${thread.posts[i].ext}` : "https://8ch.net/index.html";
        let imageInfo = thread.posts[i].filename ? `File: ${thread.posts[i].filename}${thread.posts[i].ext} (${Math.floor(thread.posts[i].fsize / 1024)} KB, ${thread.posts[i].w}x${thread.posts[i].h})` : "None";
        chanEmbed
        .setAuthor("8chan", "https://pbs.twimg.com/profile_images/899238730128539648/J6g3Ws7o_400x400.jpg")
        .setTitle(`**${thread.posts[0].sub}** ${client.getEmoji("raphi")}`)
        .setURL(url)
        .setImage(image)
        .setDescription(
            `${client.getEmoji("star")}_Post:_ ${url}#${thread.posts[i].no}\n` +
            `${client.getEmoji("star")}_Author:_ ${thread.posts[i].name} No. ${thread.posts[i].no}\n` +
            `${client.getEmoji("star")}_Image Info:_ ${imageInfo}\n` +
            `${client.getEmoji("star")}_Comment:_ ${client.cleanComment(thread.posts[i].com)}\n`
        )
        chanArray.push(chanEmbed);
    }
    client.createReactionEmbed(chanArray)
}