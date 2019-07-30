module.exports = async (client: any, message: any) => {
    
    const PixivApi = require('pixiv-api-client');
    const pixiv = new PixivApi();
    const pixivImg = require('pixiv-img');
    const translate = require('@vitalets/google-translate-api');
    //let blacklist = require("../blacklist.json");
    
    const {Attachment} = require("discord.js");
    const imagemin = require("imagemin");
    const imageminGifsicle = require("imagemin-gifsicle");
    const download = require('image-downloader');
    let compress_images = require('compress-images'), imgInput, imgOutput;
    //const fs = require("fs");

    //Create Reaction Embed
    client.createReactionEmbed = (embeds: any, collapse?: boolean, startPage?: number) => {
        let page = 0;
        if (startPage) page = startPage;
        for (let i = 0; i < embeds.length; i++) {
            embeds[i].setFooter(`Page ${i + 1}/${embeds.length}`);
        }
        let reactions: any = [client.getEmoji("right"), client.getEmoji("left"), client.getEmoji("tripleRight"), client.getEmoji("tripleLeft")];
        let reactionsCollapse: any = [client.getEmoji("collapse"), client.getEmoji("expand")]
        message.channel.send(embeds[page]).then(async (msg: any) => {
            for (const reaction of reactions) await msg.react(reaction);
                  
            const forwardCheck = (reaction, user) => reaction.emoji === client.getEmoji("right") && user.bot === false;
            const backwardCheck = (reaction, user) => reaction.emoji === client.getEmoji("left") && user.bot === false;
            const tripleForwardCheck = (reaction, user) => reaction.emoji === client.getEmoji("tripleRight") && user.bot === false;
            const tripleBackwardCheck = (reaction, user) => reaction.emoji === client.getEmoji("tripleLeft") && user.bot === false;
            
            const forward = msg.createReactionCollector(forwardCheck);
            const backward = msg.createReactionCollector(backwardCheck);
            const tripleForward = msg.createReactionCollector(tripleForwardCheck);
            const tripleBackward = msg.createReactionCollector(tripleBackwardCheck);

            if (collapse) {
                let description: any = [];
                let thumbnail: any = [];
                for (let i in embeds) {
                    description.push(embeds[i].description);
                    thumbnail.push(embeds[i].thumbnail);
                }
                for (const reaction of reactionsCollapse) await msg.react(reaction);
                const collapseCheck = (reaction, user) => reaction.emoji === client.getEmoji("collapse") && user.bot === false;
                const expandCheck = (reaction, user) => reaction.emoji === client.getEmoji("expand") && user.bot === false;
                const collapse = msg.createReactionCollector(collapseCheck);
                const expand = msg.createReactionCollector(expandCheck);

                collapse.on("collect", r => {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription("");
                            embeds[i].setThumbnail("");
                        }
                        msg.edit(embeds[page]);
                        r.remove(r.users.find((u: any) => u.id !== client.user.id));     
                });

                expand.on("collect", r => {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i]);
                        embeds[i].setThumbnail(thumbnail[i].url);
                    }
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== client.user.id));    
                });
            }

            backward.on("collect", r => {
                if (page === 0) {
                    page = embeds.length - 1; }
                else {
                    page--; }
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== client.user.id)); 
            });

            forward.on("collect", r => {
                if (page === embeds.length - 1) {
                    page = 0; }
                else { 
                    page++; }
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== client.user.id));
            });

            tripleBackward.on("collect", r => {
                if (page === 0) {
                    page = (embeds.length - 1) - Math.floor(embeds.length/5); }
                else {
                    page -= Math.floor(embeds.length/5); }
                    if (page < 0) page *= -1;
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== client.user.id));
            });

            tripleForward.on("collect", r => {
                if (page === embeds.length - 1) {
                    page = 0 + Math.floor(embeds.length/5); }
                else {
                    page += Math.floor(embeds.length/5); }
                    if (page > embeds.length - 1) page -= embeds.length - 1;
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== client.user.id));    
            });
        });
    }

    //Compress Gif
    client.compressGif = async (input) => {
        let file = await imagemin(input, 
        {destination: "../assets/gifs",
        plugins: [imageminGifsicle({interlaced: true, optimizationLevel: 3, colors: 256,})]
        });
        return file;
    }

    //Compress Images
    client.compressImages = (src, dest) => {
        return new Promise(resolve => {
            imgInput = src;
            imgOutput = dest;
                compress_images(imgInput, imgOutput, {compress_force: true, statistic: false, autoupdate: true}, false,
                {jpg: {engine: 'mozjpeg', command: ['-quality', '10']}},
                {png: {engine: 'pngquant', command: ['--quality=20-50']}},
                {svg: {engine: 'svgo', command: '--multipass'}},
                {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function (error, completed) {
                    if(completed === true) {
                        resolve();
                    }          
                });
        });
    }

    //Pixiv Login
    client.pixivLogin = async () => {
        try {
            await pixiv.refreshAccessToken(process.env.PIXIV_REFRESH_TOKEN);
        } catch (err) {
            await pixiv.login(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD, true);
            let refresh = await pixiv.refreshAccessToken();
            console.log("Refresh token expired. New one:");
            console.log(refresh.refresh_token);
        }
        let token = await pixiv.refreshAccessToken();
        return token.refresh_token;
    }

    //Create Pixiv Embed
    client.createPixivEmbed = async (refreshToken: string, image: any) => {
        await pixiv.refreshAccessToken(refreshToken);
        const pixivEmbed = client.createEmbed();
        if (!image) client.pixivErrorEmbed;
        let comments = await pixiv.illustComments(image.id);
        let commentArray: string[] = [];
            for (let i = 0; i <= 5; i++) {
                if (!comments.comments[i]) break;
                commentArray.push(comments.comments[i].comment);
            }
        let url = await pixivImg(image.image_urls.medium);
        let authorUrl = await pixivImg(image.user.profile_image_urls.medium);
        let imageAttachment = new Attachment(url);
        let authorAttachment = new Attachment(authorUrl);
        let cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "");
        pixivEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
        .setTitle(`**Pixiv Image** ${client.getEmoji("chinoSmug")}`)
        .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .setDescription(
        `${client.getEmoji("star")}_Title:_ **${image.title}**\n` + 
        `${client.getEmoji("star")}_Artist:_ **${image.user.name}**\n` + 
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(image.create_date)}**\n` + 
        `${client.getEmoji("star")}_Views:_ **${image.total_view}**\n` + 
        `${client.getEmoji("star")}_Bookmarks:_ **${image.total_bookmarks}**\n` + 
        `${client.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` + 
        `${client.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n` 
        )
        .attachFiles([authorAttachment, imageAttachment])
        .setThumbnail(`attachment://${authorAttachment.file}`)
        .setImage(`attachment://${imageAttachment.file}`);
        return pixivEmbed;
    }

    //Pixiv Error Embed
    client.pixivErrorEmbed = () => {
        let pixivEmbed = client.createEmbed();
        pixivEmbed
        .setTitle(`**Pixiv Image** ${client.getEmoji("chinoSmug")}`)
        .setDescription("No results were found. Try searching for the japanese tag on the Pixiv website, " +
        "as some tags can't be translated to english!" + '\n[Pixiv Website](https://www.pixiv.net/)')
        return message.channel.send(pixivEmbed);
    }
    //Process Pixiv Tag
    client.pixivTag = async (tag: string) => {
        let newTag = await translate(tag, {to: 'ja'});
        return newTag.text;
    }

    //Pixiv Image
    client.getPixivImage = async (refresh: string, tag: string, r18?: boolean, en?: boolean, ugoira?: boolean, noEmbed?: boolean) => {
        let refreshToken = refresh;
        await pixiv.refreshAccessToken(refreshToken);
        let newTag;
        if (en) {
            newTag = tag;
        } else {
            newTag = await client.pixivTag(tag);
        }
        let json;
        if (r18) {
            await pixiv.login(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD);
            if (ugoira) {
                json = await pixiv.searchIllust(`うごイラ R-18 ${newTag}`);
            } else {
                json = await pixiv.searchIllust(`R-18 ${newTag}`);
            }
        } else {
            await pixiv.login(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD);
            if (ugoira) {
                json = await pixiv.searchIllust(`うごイラ ${newTag}`);
            } else {
                json = await pixiv.searchIllust(newTag);
            }
        }
        await [].sort.call(json.illusts, ((a: any, b: any) => (a.total_bookmarks - b.total_bookmarks)*-1));
        let index = Math.floor(Math.random() * (10));
        let image = json.illusts[index]; 
        if (noEmbed) return image;

        let pixivEmbed = await client.createPixivEmbed(refreshToken, image);
        return message.channel.send(pixivEmbed);
    }

    //Pixiv Image ID
    client.getPixivImageID = async (refresh: string, tags: any) => {
        let refreshToken = refresh;
        await pixiv.refreshAccessToken(refreshToken);
        let image = await pixiv.illustDetail(tags.toString());
        if (!image) client.pixivErrorEmbed;
        let pixivEmbed = await client.createPixivEmbed(refreshToken, image.illust);
        return message.channel.send(pixivEmbed);
    }

    //Pixiv Popular Image
    client.getPopularPixivImage = async (refresh: string) => {
        let refreshToken = refresh;
        await pixiv.refreshAccessToken(refreshToken);
        const json = await pixiv.illustRanking();
        await [].sort.call(json.illusts, ((a: any, b: any) => (a.total_bookmarks - b.total_bookmarks)*-1));
        let index = Math.floor(Math.random() * (10));
        let image = json.illusts[index]; 
    
        let pixivEmbed = await client.createPixivEmbed(refreshToken, image);
        return message.channel.send(pixivEmbed);
    }

    //Pixiv Popular R18 Image
    client.getPopularPixivR18Image = async (refresh: string) => {
        let refreshToken = refresh;
        await pixiv.refreshAccessToken(refreshToken);
        const json = await pixiv.illustRanking({mode: "day_male_r18"});
        await [].sort.call(json.illusts, ((a: any, b: any) => (a.total_bookmarks - b.total_bookmarks)*-1));
        let index = Math.floor(Math.random() * (10));
        let image = json.illusts[index]; 
    
        let pixivEmbed = await client.createPixivEmbed(refreshToken, image);
        return message.channel.send(pixivEmbed);
    }

    //Download Pages
    client.downloadPages = async (array, dest) => {
        await Promise.all(array.map(async (url, i) => {
            const options = {
                url,
                dest: `${dest}page${i}.jpg`
            };
            
            try {
                const {filename} = await download.image(options);
                console.log(filename);
            } catch(e) {
                console.log(e);
            }
        }));
    }

    //nhentai Doujin
    client.getNhentaiDoujin = async (doujin: any, tag: any) => {
        let checkArtists = doujin.details.artists ? client.checkChar(doujin.details.artists.join(" "), 50, ")") : "None";
        let checkCharacters = doujin.details.characters ? client.checkChar(doujin.details.characters.join(" "), 50, ")") : "None";
        let checkTags = doujin.details.tags ? client.checkChar(doujin.details.tags.join(" "), 50, ")") : "None";
        let checkParodies = doujin.details.parodies ? client.checkChar(doujin.details.parodies.join(" "), 50, ")") : "None";
        let checkGroups = doujin.details.groups ? client.checkChar(doujin.details.groups.join(" "), 50, ")") : "None";
        let checkLanguages = doujin.details.languages ? client.checkChar(doujin.details.languages.join(" "), 50, ")") : "None";
        let checkCategories = doujin.details.categories ? client.checkChar(doujin.details.categories.join(" "), 50, ")") : "None";
        let doujinPages: any = [];
        /*fs.mkdirSync(`../assets/pages/${tag}/`);
        fs.mkdirSync(`../assets/pagesCompressed/${tag}/`);
        let msg1 = await message.channel.send(`**Downloading images** ${client.getEmoji("gabCircle")}`);
        await client.downloadPages(doujin.pages, `../assets/pages/${tag}/`);
        msg1.delete(1000);
        let msg2 = await message.channel.send(`**Compressing images** ${client.getEmoji("gabCircle")}`);
        await client.compressImages(`../assets/pages/${tag}/*.jpg`, `../assets/pagesCompressed/${tag}/`);
        msg2.delete(1000);*/
        for (let i = 0; i < doujin.pages.length; i++) {
            let nhentaiEmbed = client.createEmbed();
            nhentaiEmbed
            .setAuthor("nhentai", "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg")
            .setTitle(`**${doujin.title}** ${client.getEmoji("madokaLewd")}`)
            .setURL(doujin.link)
            .setDescription(
            `${client.getEmoji("star")}_Japanese Title:_ **${doujin.nativeTitle}**\n` +
            `${client.getEmoji("star")}_ID:_ **${tag}**\n` +
            `${client.getEmoji("star")}_Artists:_ ${checkArtists}\n` +
            `${client.getEmoji("star")}_Characters:_ ${checkCharacters}\n` +
            `${client.getEmoji("star")}_Tags:_ ${checkTags} ${checkParodies}` +
            `${checkGroups} ${checkLanguages} ${checkCategories}\n` 
            )
            //.attachFiles([`../assets/pagesCompressed/${tag}/page${i}.jpg`])
            //.setImage(`attachment://page${i}.jpg`)
            .setThumbnail(doujin.thumbnails[0])
            .setImage(doujin.pages[i])
            await doujinPages.push(nhentaiEmbed);
        }
        await client.createReactionEmbed(doujinPages, true);
    }

    //Fetch Channel Attachments
    client.fetchChannelAttachments = async (channel: any) => {
        let beforeID = channel.lastMessageID;
        let attachmentArray: any[] = [];
        while (beforeID !== undefined || null) {
            setTimeout(async () => {
                let messages = await channel.fetchMessages({limit: 100, before: beforeID});
                beforeID = messages.lastKey();
                let filteredMessages = await messages.filter((msg:any) => msg.attachments.firstKey() !== undefined || null);
                let filteredArray = await filteredMessages.attachments.map((attachment: any) => attachment.url);
                for (let i = 0; i < filteredArray.length; i++) {
                    attachmentArray.push(filteredArray[i]);
                }
            }, 120000);
        }
        return attachmentArray; 
    }
}