exports.run = async (discord: any, message: any, args: string[]) => {

    let accessToken = (process.env.PINTEREST_ACCESS_TOKEN);
    const GoogleImages = require('google-images');
    const images = new GoogleImages(process.env.PINTEREST_SEARCH_ID, process.env.GOOGLE_API_KEY);
    const axios = require("axios");

    discord.pinterestError = () => {
        let pinterestEmbed = discord.createEmbed();
        pinterestEmbed
        .setAuthor("pinterest", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png")
        .setTitle(`**Pinterest Search** ${discord.getEmoji("aquaUp")}`)
        .setDescription("No results were found. Try searching on the pinterest website: " +
        "[Pinterest Website](https://www.pinterest.com/)")
        message.channel.send(pinterestEmbed);
    }
    
    let pinArray: any = [];
    discord.pinterestPin = (response: any) => {
        let pinterestEmbed = discord.createEmbed();
        pinterestEmbed
        .setAuthor("pinterest", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png")
        .setTitle(`**Pinterest Search** ${discord.getEmoji("aquaUp")}`)
        .setURL(response.url)
        .setImage(response.image.original.url)
        .setDescription(
            `${discord.getEmoji("star")}_Creator:_ **${response.creator.url}**\n` +
            `${discord.getEmoji("star")}_Board:_ **${response.board.url}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(response.created_at)}**\n` +
            `${discord.getEmoji("star")}_Saves:_ **${response.counts.saves}**\n` +
            `${discord.getEmoji("star")}_Comments:_ **${response.counts.comments}**\n` +
            `${discord.getEmoji("star")}_Source:_ **${response.link ? response.link : "None"}**\n` +
            `${discord.getEmoji("star")}_Note:_ ${response.note ? response.note : "None"}\n` 
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
            discord.pinterestPin(response[i]);
        }
        if (!pinArray.join("")) {
            discord.pinterestError(); 
            return; 
        }
        if (pinArray.length === 1) {
            message.channel.send(pinArray[0]);
        } else { 
            discord.createReactionEmbed(pinArray);
        }
        return;
    }

    if (args[1] === "search") {
        let query = discord.combineArgs(args, 2);
        let json = await axios.get(`https://api.pinterest.com/v1/me/search/pins/?access_token=${accessToken}&query=${query.replace(/ /g, "-")}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
        let response = json.data;
        for (let i in response) {
            discord.pinterestPin(response[i]);
        }
        if (!pinArray.join("")) {
            discord.pinterestError(); 
            return; 
        }
        if (pinArray.length === 1) {
            message.channel.send(pinArray[0]);
        } else { 
            discord.createReactionEmbed(pinArray);
        }
        return;
    }

    let query = discord.combineArgs(args, 1);
    let imageResult = await images.search(query);
    let random = 0;
    let pin;
    for (let i = 0; i < imageResult.length; i++) {
        if (pin) break;
        random = Math.floor(Math.random() * imageResult.length)
        pin = (imageResult[random].parentPage.match(/\d{18}/g))
    }
    if (!pin) { 
        discord.pinterestError();
        return;
    }
    let json = await axios.get(`https://api.pinterest.com/v1/pins/${pin}/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
    let response = json.data.data;
    let board = response.board.url.slice(25);
    let response2 = await axios.get(`https://api.pinterest.com/v1/boards/${board}/pins/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
    let random2 = Math.floor(Math.random() * response2.data.length)
    discord.pinterestPin(response2.data[random2]);
    if (!pinArray.join("")) {
        discord.pinterestError(); 
        return; 
    }
    message.channel.send(pinArray[0]);
}