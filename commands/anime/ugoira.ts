import Ugoira from 'node-ugoira';

exports.run = async (discord: any, message: any, args: string[]) => {
    const PixivApi = require('pixiv-api-client');
    const fs = require('fs');
    const pixiv = new PixivApi();
    let refreshToken = await discord.pixivLogin();
    let input;
    if (args[1].toLowerCase() === "r18" || args[1].toLowerCase() === "en") {
        if (args[2] === "en") {
            input = discord.combineArgs(args, 3);
        } else {
            input = discord.combineArgs(args, 2);
        }
    } else {
        input = discord.combineArgs(args, 1);
    }
    let msg1 = await message.channel.send(`**Fetching Ugoira** ${discord.getEmoji("gabCircle")}`)
    let pixivID;
    if (input.match(/\d+/g) !== null) {
        pixivID = input.match(/\d+/g).join("");
    } else {
        if (args[1].toLowerCase() === "r18") {
            if (args[2].toLowerCase() === "en") {
                let image = await discord.getPixivImage(refreshToken, input, true, true, true, true);
                    try {
                        pixivID = image.id;
                    } catch (err) {
                        if (err) discord.pixivErrorEmbed();
                    }
            } else {
                let image = await discord.getPixivImage(refreshToken, input, true, false, true, true);
                    try {
                        pixivID = image.id;
                    } catch (err) {
                        if (err) discord.pixivErrorEmbed();
                    }
            }
        } else if (args[1].toLowerCase() === "en") {
            let image = await discord.getPixivImage(refreshToken, input, false, true, true, true);
                try {
                    pixivID = image.id;
                } catch (err) {
                    if (err) discord.pixivErrorEmbed();
                }
        } else {
            let image = await discord.getPixivImage(refreshToken, input, false, false, true, true);
                try {
                    pixivID = image.id;
                } catch (err) {
                    if (err) discord.pixivErrorEmbed();
                }
        }
    }
    
    await pixiv.refreshAccessToken(refreshToken);
    let details = await pixiv.illustDetail(pixivID)
    let ugoiraInfo = await pixiv.ugoiraMetaData(pixivID);
    let fileNames: any = []; 
    let frameDelays: any = [];
    let frameNames: any = [];
    for (let i in ugoiraInfo.ugoira_metadata.frames) {
        frameDelays.push(ugoiraInfo.ugoira_metadata.frames[i].delay);
        fileNames.push(ugoiraInfo.ugoira_metadata.frames[i].file);
    }
    for (let i in fileNames) {
        frameNames.push(fileNames[i].slice(0, -4));
    }
    
    const ugoira = new Ugoira(pixivID);
    await ugoira.initUgoira(refreshToken);
    
    let file = fs.createWriteStream(`ugoira/${pixivID}/${pixivID}.gif`, (err) => console.log(err));

    msg1.delete(1000);
    let msg2 = await message.channel.send(`**Converting Ugoira to Gif. This might take awhile** ${discord.getEmoji("gabCircle")}`)
    await discord.encodeGif(fileNames, `ugoira/${pixivID}/`, file);
    msg2.delete(1000);

    let msg3 = await message.channel.send(`**Compressing Gif** ${discord.getEmoji("gabCircle")}`)
    await discord.compressGif([`ugoira/${pixivID}/${pixivID}.gif`]);
    msg3.delete(1000);

        const pixivImg = require('pixiv-img');
        let ugoiraEmbed = discord.createEmbed();
        const {Attachment} = require("discord.js");
        let outGif = new Attachment(`../assets/gifs/${pixivID}.gif`);
        let comments = await pixiv.illustComments(pixivID);
        let cleanText = details.illust.caption.replace(/<\/?[^>]+(>|$)/g, "");
        let authorUrl = await pixivImg(details.illust.user.profile_image_urls.medium);
        let authorAttachment = new Attachment(authorUrl);
            let commentArray: string[] = [];
            for (let i = 0; i <= 5; i++) {
                if (!comments.comments[i]) break;
                commentArray.push(comments.comments[i].comment);
            }
        ugoiraEmbed
        .setTitle(`**Pixiv Ugoira** ${discord.getEmoji("kannaSip")}`)
        .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixivID}`)
        .setDescription(
            `${discord.getEmoji("star")}_Title:_ **${details.illust.title}**\n` + 
            `${discord.getEmoji("star")}_Artist:_ **${details.illust.user.name}**\n` + 
            `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(details.illust.create_date)}**\n` + 
            `${discord.getEmoji("star")}_Views:_ **${details.illust.total_view}**\n` + 
            `${discord.getEmoji("star")}_Bookmarks:_ **${details.illust.total_bookmarks}**\n` + 
            `${discord.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` + 
            `${discord.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n` 
            )
        .attachFiles([outGif.file, authorAttachment])
        .setThumbnail(`attachment://${authorAttachment.file}`)
        .setImage(`attachment://${pixivID}.gif`)
        message.channel.send(ugoiraEmbed);
}