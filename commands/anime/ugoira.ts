import Ugoira from 'node-ugoira';

exports.run = async (client: any, message: any, args: string[]) => {
    const PixivApi = require('pixiv-api-client');
    const pixiv = new PixivApi();
    let input;
    if (args[1].toLowerCase() === "r18" || args[1].toLowerCase() === "en") {
        if (args[2] === "en") {
            input = client.combineArgs(args, 3);
        } else {
            input = client.combineArgs(args, 2);
        }
    } else {
        input = client.combineArgs(args, 1);
    }
    const fs = require('fs');
    let pixivID;

    if (input.match(/\d+/g) !== null) {
        pixivID = input.match(/\d+/g).join("");
    } else {
        if (args[1].toLowerCase() === "r18") {
            if (args[2].toLowerCase() === "en") {
                let image = await client.getPixivImage(input, true, true, true, true);
                    try {
                        pixivID = image.id;
                    } catch (err) {
                        if (err) client.pixivErrorEmbed();
                    }
            } else {
                let image = await client.getPixivImage(input, true, false, true, true);
                    try {
                        pixivID = image.id;
                    } catch (err) {
                        if (err) client.pixivErrorEmbed();
                    }
            }
        } else if (args[1].toLowerCase() === "en") {
            let image = await client.getPixivImage(input, false, true, true, true);
                try {
                    pixivID = image.id;
                } catch (err) {
                    if (err) client.pixivErrorEmbed();
                }
        } else {
            let image = await client.getPixivImage(input, false, false, true, true);
                try {
                    pixivID = image.id;
                } catch (err) {
                    if (err) client.pixivErrorEmbed();
                }
        }
    }
    await pixiv.login(process.env.PIXIVR18_NAME, process.env.PIXIVR18_PASSWORD);
    let details = await pixiv.illustDetail(pixivID)
    console.log(details)
    let refreshToken = await pixiv.refreshAccessToken();
    const ugoira = new Ugoira(pixivID);
    const out = await ugoira.initUgoira(refreshToken.refresh_token);

    let getPixels = require('get-pixels')
    let GifEncoder = require('gif-encoder');
    let gif = new GifEncoder(details.illust.width, details.illust.height);
    let file = fs.createWriteStream(`ugoira/${pixivID}/${pixivID}.gif`, (err) => console.log(err));
    let pics = fs.readdirSync(out.extractedPath, (err) => console.log(err));

    //let frames: any = []

    /*switch (pics.length) {
        case pics.length > 40: 
            for (var i = 0; i < pics.length; i = i+2) {
                frames.push(pics[i]);
            }; 
            break;
        case pics.length > 80: 
            for (var i = 0; i < pics.length; i = i+4) {
                frames.push(pics[i]);
            };
            break;
        case pics.length > 160:
                for (var i = 0; i < pics.length; i = i+8) {
                    frames.push(pics[i]);
                };
                break;
        default:
            for (var i = 0; i < pics.length; i++) {
                frames.push(pics[i]);
            };
            break;
    }*/
    
    gif.pipe(file);
    gif.setQuality(20);
    gif.setDelay(0);
    gif.setRepeat(0);
    gif.writeHeader();
    let counter = 0;
    
    let addToGif = (images) => {
        console.log(`ugoira/${pixivID}/${images[counter]}`)
        getPixels(`ugoira/${pixivID}/${images[counter]}`, function(err, pixels) {
            gif.addFrame(pixels.data);
            gif.read();
                if (counter >= images.length - 1) {
                    gif.finish();
                } else {
                        counter++;
                        addToGif(images);
                    }
        })
    }
    
    message.channel.send(`**Converting Ugoira to Gif. This might take awhile** ${client.getEmoji("gabCircle")}`)
    .then(async(msg: any) => {
        await addToGif(pics);
        msg.delete(10000);
    });
    
    gif.on("end", async () => {
        
        message.channel.send(`**Compressing Gif** ${client.getEmoji("gabCircle")}`)
        .then(async (msg: any) => {
            let compressed = await client.compressGif([`ugoira/${pixivID}/${pixivID}.gif`]);
            console.log(compressed)
            msg.delete(3000);
        
            const pixivImg = require('pixiv-img');
            let ugoiraEmbed = client.createEmbed();
            const {Attachment} = require("discord.js");
            let outGif = new Attachment(`../assets/gifs/${pixivID}.gif`)
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
            .setTitle(`**Pixiv Ugoira** ${client.getEmoji("kannaSip")}`)
            .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixivID}`)
            .setDescription(
                `${client.getEmoji("star")}_Title:_ **${details.illust.title}**\n` + 
                `${client.getEmoji("star")}_Artist:_ **${details.illust.user.name}**\n` + 
                `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(details.illust.create_date)}**\n` + 
                `${client.getEmoji("star")}_Views:_ **${details.illust.total_view}**\n` + 
                `${client.getEmoji("star")}_Bookmarks:_ **${details.illust.total_bookmarks}**\n` + 
                `${client.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` + 
                `${client.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n` 
                )
            .attachFiles([outGif.file, authorAttachment])
            .setThumbnail(`attachment://${authorAttachment.file}`)
            .setImage(`attachment://${pixivID}.gif`)
            message.channel.send(ugoiraEmbed);
            console.log(ugoiraEmbed)
        });
    })
}