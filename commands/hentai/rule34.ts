import Booru from "booru";

exports.run = async (client: any, message: any, args: string[]) => {
    const rule34 = Booru("rule34");
    const rule34Embed = client.createEmbed();

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
        rule34Embed
        .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
        .setTitle(`**Rule34 Search** ${client.getEmoji("gabLewd")}`)
        .setDescription("No results were found. Underscores are not required, " +
        "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
        "on the rule34 website.\n" + "[rule34 Website](https://rule34.xxx//)")
        message.channel.send(rule34Embed)
        return;
    }

    let tagArray: any = [];
    for (let i in tags) {
        tagArray.push(tags[i].trim().replace(/ /g, "_"));
    }

    let img = await rule34.search(tagArray, {limit: 1, random: true})
    let url = await rule34.postView(img[0].id)
    rule34Embed
    .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
    .setURL(url)
    .setTitle(`**Rule34 Search** ${client.getEmoji("gabLewd")}`)
    .setDescription(
        `${client.getEmoji("star")}_Tags:_ ${client.checkChar(img[0].tags.join(" "), 2048, " ")}`
    )
    .setImage(img[0].fileUrl)
    message.channel.send(rule34Embed);
}