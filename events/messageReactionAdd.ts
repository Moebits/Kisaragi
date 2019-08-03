import {RichEmbed} from "discord.js";
const active = new Set();

module.exports = async (client: any, reaction: any, user: any) => {
    await require("../exports/images.js")(client, reaction.message);
    if (reaction.message.author.id === client.user.id) {
        if (active.has(reaction.message.id)) return;
        let ignored = await client.selectColumn("ignore", "message");
        let newArray = ignored.flat();
        let cached = false;
        for (let i in newArray) {
            if (newArray[i] === reaction.message.id.toString()) {
                cached = true;
            }
        }
        if (cached) {
            let messageID = await client.fetchColumn("collectors", "message", "message", reaction.message.id);
            if (messageID) {
                let embeds = await client.fetchColumn("collectors", "embeds", "message", reaction.message.id);
                let collapse = await client.fetchColumn("collectors", "collapse", "message", reaction.message.id);
                let page = await client.fetchColumn("collectors", "page", "message", reaction.message.id);
                let newEmbeds: any = [];
                for (let i in embeds[0]) {
                    newEmbeds.push(new RichEmbed(JSON.parse(embeds[0][i])));
                }
                active.add(reaction.message.id);
                await client.editReactionCollector(reaction.message, reaction._emoji.name, newEmbeds, collapse[0], page[0])
            }
        } else {
            return;
        }
    }
}