import Booru from "booru";

exports.run = async (client: any, message: any, args: string[]) => {
    const gelbooru = Booru("gelbooru", process.env.GELBOORU_API_KEY);
    const gelbooruEmbed = client.createEmbed();

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

    let img = await gelbooru.search(tagArray, {limit: 1, random: true})
    let url = await gelbooru.postView(img[0].id)
    gelbooruEmbed
    .setAuthor("gelbooru", "https://pbs.twimg.com/profile_images/1118350008003301381/3gG6lQMl.png")
    .setURL(url)
    .setTitle(`**Gelbooru Search** ${client.getEmoji("gabLewd")}`)
    .setDescription(
        `${client.getEmoji("star")}_Tags:_ ${client.checkChar(img[0].tags.join(" "), 2048, " ")}`
    )
    .setImage(img[0].fileUrl)
    message.channel.send(gelbooruEmbed);
}