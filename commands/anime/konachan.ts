import Booru from "booru";

exports.run = async (client: any, message: any, args: string[]) => {
    const konachan = Booru("konachan.com", process.env.KONACHAN_API_KEY);
    const konachanEmbed = client.createEmbed();

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
        konachanEmbed
    .setAuthor("konachan", "https://lh3.googleusercontent.com/U_veaCEvWC-ebOBbwhUhTJtNdDKyAhKsJXmDFeZ2xV2jaoIPNbRhzK7nGlKpQtusbHE")
        .setTitle(`**Konachan Search** ${client.getEmoji("gabLewd")}`)
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

    let img = await konachan.search(tagArray, {limit: 1, random: true})
    let url = await konachan.postView(img[0].id)
    konachanEmbed
    .setAuthor("konachan", "https://lh3.googleusercontent.com/U_veaCEvWC-ebOBbwhUhTJtNdDKyAhKsJXmDFeZ2xV2jaoIPNbRhzK7nGlKpQtusbHE")
    .setURL(url)
    .setTitle(`**Konachan Search** ${client.getEmoji("gabLewd")}`)
    .setDescription(
        `${client.getEmoji("star")}_Tags:_ ${client.checkChar(img[0].tags.join(" "), 2048, " ")}`
    )
    .setImage(img[0].fileUrl)
    message.channel.send(konachanEmbed);
}