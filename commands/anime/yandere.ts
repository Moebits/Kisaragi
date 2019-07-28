import Booru from "booru";

exports.run = async (client: any, message: any, args: string[]) => {
    const yandere = Booru("yande.re", process.env.yandere_API_KEY);
    const yandereEmbed = client.createEmbed();

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
        yandereEmbed
    .setAuthor("yandere", "https://i.imgur.com/5DiQTnW.pngE")
        .setTitle(`**Yandere Search** ${client.getEmoji("gabLewd")}`)
        .setDescription("No results were found. Underscores are not required, " +
        "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
        "on the yandere website.\n" + "[yandere Website](https://yande.re//)")
        message.channel.send(yandereEmbed)
        return;
    }

    let tagArray: any = [];
    for (let i in tags) {
        tagArray.push(tags[i].trim().replace(/ /g, "_"));
    }

    let img = await yandere.search(tagArray, {limit: 1, random: true})
    let url = await yandere.postView(img[0].id)
    yandereEmbed
    .setAuthor("yandere", "https://i.imgur.com/5DiQTnW.png")
    .setURL(url)
    .setTitle(`**Yandere Search** ${client.getEmoji("gabLewd")}`)
    .setDescription(
        `${client.getEmoji("star")}_Tags:_ ${client.checkChar(img[0].tags.join(" "), 2048, " ")}`
    )
    .setImage(img[0].fileUrl)
    message.channel.send(yandereEmbed);
}