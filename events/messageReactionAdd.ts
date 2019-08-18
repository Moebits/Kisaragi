import {RichEmbed} from "discord.js";
const active = new Set();

module.exports = async (discord: any, reaction: any, user: any) => {
    await require("../exports/collectors.js")(discord, reaction.message);
    if (reaction.message.author.id === discord.user.id) {
        if (active.has(reaction.message.id)) return;
        let newArray = await discord.selectColumn("ignore", "message");
        let cached = false;
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i][0] === reaction.message.id.toString()) {
                cached = true;
            }
        }
        if (cached) {
            let messageID = await discord.fetchColumn("collectors", "message", "message", reaction.message.id);
            if (messageID) {
                let embeds = await discord.fetchColumn("collectors", "embeds", "message", reaction.message.id);
                let collapse = await discord.fetchColumn("collectors", "collapse", "message", reaction.message.id);
                let page = await discord.fetchColumn("collectors", "page", "message", reaction.message.id);
                let newEmbeds: any = [];
                for (let i in embeds[0]) {
                    newEmbeds.push(new RichEmbed(JSON.parse(embeds[0][i])));
                }
                active.add(reaction.message.id);
                await discord.editReactionCollector(reaction.message, reaction._emoji.name, newEmbeds, collapse[0], page[0])
            }
        } else {
            return;
        }
    }
}