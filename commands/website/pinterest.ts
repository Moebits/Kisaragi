exports.run = async (client: any, message: any, args: string[]) => {

    let accessToken = (process.env.PINTEREST_ACCESS_TOKEN);
    const axios = require("axios");

    client.pinterestError = () => {
        let pinterestEmbed = client.createEmbed();
        pinterestEmbed
        .setAuthor("pinterest", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png")
        .setTitle(`**Pinterest Search** ${client.getEmoji("aquaUp")}`)
        .setDescription("No results were found. Try searching on the pinterest website: " +
        "[Pinterest Website](https://www.pinterest.com/)")
        message.channel.send(pinterestEmbed);
    }
    
    let pinArray: any = [];
    client.pinterestPin = (response: any) => {
        let pinterestEmbed = client.createEmbed();
        pinterestEmbed
        .setAuthor("pinterest", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png")
        .setTitle(`**Pinterest Search** ${client.getEmoji("aquaUp")}`)
        .setURL(response.url)
        .setImage(response.image.original.url)
        .setDescription(
            `${client.getEmoji("star")}_Creator:_ **${response.creator.url}**\n` +
            `${client.getEmoji("star")}_Board:_ **${response.board.url}**\n` +
            `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(response.created_at)}**\n` +
            `${client.getEmoji("star")}_Saves:_ **${response.counts.saves}**\n` +
            `${client.getEmoji("star")}_Comments:_ **${response.counts.comments}**\n` +
            `${client.getEmoji("star")}_Source:_ **${response.link ? response.link : "None"}**\n` +
            `${client.getEmoji("star")}_Note:_ ${response.note ? response.note : "None"}\n` 
        )
        pinArray.push(pinterestEmbed);
    }

    if (args[1] === "board") {
        let user = args[2];
        let board = args[3];
        if (!user || !board) return;
        let json = await axios.get(`https://api.pinterest.com/v1/boards/${user}/${board}/pins/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
        let response = json.data;
        for (let i in response) {
            client.pinterestPin(response[i]);
        }
        if (!pinArray.join("")) {
            client.pinterestError(); 
            return; 
        }
        if (pinArray.length === 1) {
            message.channel.send(pinArray[0]);
        } else { 
            client.createReactionEmbed(pinArray);
        }
        return;
    }

    if (args[1] === "search") {
        let query = client.combineArgs(args, 2);
        let json = await axios.get(`https://api.pinterest.com/v1/me/search/pins/?access_token=${accessToken}&query=${query.replace(/ /g, "-")}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
        let response = json.data;
        for (let i in response) {
            client.pinterestPin(response[i]);
        }
        if (!pinArray.join("")) {
            client.pinterestError(); 
            return; 
        }
        if (pinArray.length === 1) {
            message.channel.send(pinArray[0]);
        } else { 
            client.createReactionEmbed(pinArray);
        }
        return;
    }
}