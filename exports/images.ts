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
    const fs = require("fs");
    
    const Canvas = require("canvas");
    let getPixels = require('get-pixels')
    let GifEncoder = require('gif-encoder');
    let gifFrames = require('gif-frames');
    const sizeOf = require('image-size');
    let imageDataURI = require("image-data-uri");

    //Compress Gif
    client.compressGif = async (input) => {
        let file = await imagemin(input, 
        {destination: "../assets/gifs",
        plugins: [imageminGifsicle({interlaced: true, optimizationLevel: 3, colors: 256,})]
        });
        return file;
    }

    //Encode Gif
    client.encodeGif = async (fileNames, path, file) => {
        let images: any = [];
        if (fileNames.length > 500) {
            for (let i = 0; i < fileNames.length; i+=15) {
                images.push(fileNames[i]);
            }
        } else if (fileNames.length > 300) {
            for (let i = 0; i < fileNames.length; i+=10) {
                images.push(fileNames[i]);
            }
        } else if (fileNames.length > 150) {
            for (let i = 0; i < fileNames.length; i+=5) {
                images.push(fileNames[i]);
            }
        } else if (fileNames.length > 80) {
            for (let i = 0; i < fileNames.length; i+=3) {
                images.push(fileNames[i]);
            }
        } else if (fileNames.length > 40) {
            for (let i = 0; i < fileNames.length; i+=2) {
                images.push(fileNames[i]);
            }
        } else {
            for (let i = 0; i < fileNames.length; i++) {
                images.push(fileNames[i]);
            }
        }
        return new Promise(resolve => {

        let dimensions = sizeOf(`${path}${images[0]}`);
        let gif = new GifEncoder(dimensions.width, dimensions.height);
        gif.pipe(file);
        gif.setQuality(20);
        gif.setDelay(0);
        gif.setRepeat(0);
        gif.writeHeader();
        let counter = 0;

        const addToGif = (images) => {
                getPixels(`${path}${images[counter]}`, function(err, pixels) {
                    gif.addFrame(pixels.data);
                    gif.read();
                        if (counter >= images.length - 1) {
                            gif.finish();
                        } else {
                                counter++;
                                addToGif(images);
                            }
                });
            }
        
            addToGif(images);
            gif.on("end", async () => {
                resolve();
            });
        });
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
        for (let i in image.illust.tags) {
            if (image.illust.tags[i].name === "うごイラ") {
                console.log("here!");
                const path = require("../commands/anime/ugoira.js");
                await client.linkRun(path, message, ["ugoira", tags.toString()]);
                return;
            }
        }
        if (!image) client.pixivErrorEmbed;
        let pixivEmbed = await client.createPixivEmbed(refreshToken, image.illust);
        return message.channel.send(pixivEmbed);
    }

    //Pixiv Random Image
    client.getRandomPixivImage = async (refresh: string) => {
        let refreshToken = refresh;
        await pixiv.refreshAccessToken(refreshToken);
        let image;
        let random = 0;
        while (!image) {
            random = Math.floor(Math.random() * 100000000);
            image = await pixiv.illustDetail(random.toString());
        }
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

    let colorStops = [
        "#FF8AD8",
        "#FF8ABB",
        "#F9FF8A",
        "#8AFFB3",
        "#8AE4FF",
        "#FF8AD8"
    ];

    client.createCanvas = async (member: any, rawImage: any, text: any, color: any, uri?: boolean, iterator?: number) => {
        let image = "";
        if (rawImage.constructor === Array) {
            image = rawImage.join("");
        } else {
            image = rawImage;
        }

        console.log(image)
        
        let newText = text.join("").replace(/user/g, `@${member.user.tag}`).replace(/guild/g, member.guild.name)
        .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount)

        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            var cars = text.split("\n");

            for (var ii = 0; ii < cars.length; ii++) {

                var line = "";
                var words = cars[ii].split(" ");

                for (var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + " ";
                    var metrics = context.measureText(testLine);
                    var testWidth = metrics.width;

                    if (testWidth > maxWidth) {
                        context.strokeText(line, x, y);
                        context.fillText(line, x, y);
                        line = words[n] + " ";
                        y += lineHeight;
                    }
                    else {
                        line = testLine;
                    }
                }
                
                context.strokeText(line, x, y);
                context.fillText(line, x, y);
                y += lineHeight;
            }
        }

        function applyText(canvas, text) {
            const ctx = canvas.getContext('2d');
            let fontSize = 70;
            do {
                ctx.font = `${fontSize -= 1}px 07nikumarufont`;
            } while (ctx.measureText(text).width > (canvas.width*2.2) - 300);
            return ctx.font;
        };
        
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        let background: any;
        let random  = Math.floor(Math.random() * 1000000)
        if (image.includes("gif")) {
            if (!fs.existsSync(`../assets/images/${random}/`)) {  
                fs.mkdirSync(`../assets/images/${random}/`)  
            }
            
            let files: string[] = [];
            let attachmentArray: any = [];
            let frames = await gifFrames({url: image, frames: "all", cumulative: true});
            
            for (let i in frames) {
                let readStream = frames[i].getImage()
                let writeStream = fs.createWriteStream(`../assets/images/${random}/image${frames[i].frameIndex}.jpg`);
                await client.awaitPipe(readStream, writeStream)
                files.push(`../assets/images/${random}/image${frames[i].frameIndex}.jpg`); 
            }

            await client.timeout(500);
            let rIterator = 0;
            let msg2 = await message.channel.send(`**Encoding Gif. This might take awhile** ${client.getEmoji("gabCircle")}`)
            for (let i = 0; i < 6; i++) {
                if (rIterator === colorStops.length - 1) {
                    rIterator = 0;
                }
                let dataURI = await client.createCanvas(member, files[i], text, color, true, rIterator);
                await imageDataURI.outputFile(dataURI, `../assets/images/${random}/image${i}`);
                attachmentArray.push(`image${i}.jpeg`);
                rIterator++;
            }
            
            let file = fs.createWriteStream(`../assets/images/${random}/animated.gif`, (err) => console.log(err));
            await client.encodeGif(attachmentArray, `../assets/images/${random}/`, file);
            msg2.delete();
            let attachment = new Attachment(`../assets/images/${random}/animated.gif`);
            return attachment;
                
        } else {
            background = await Canvas.loadImage(image);

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.font = applyText(canvas, newText);
            ctx.strokeStyle= "black";
            ctx.lineWidth = 4;
            if (color.join("") === "rainbow") {
                let rainbowIterator;
                if (iterator) {
                    rainbowIterator = iterator;
                } else {
                    rainbowIterator = 0;
                }
                let gradient = ctx.createLinearGradient(0, 0, canvas.width + 200, 0);
                for (let i = 0; i < colorStops.length; i++) {
                    let currColor = colorStops[rainbowIterator + i];
                    let position = (1/colorStops.length)*i;
                    if (currColor === colorStops[colorStops.length]) {
                        currColor = colorStops[0];
                        rainbowIterator = 0;
                    }
                    gradient.addColorStop(position, currColor) 
                }
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = color.join("");
            }
            wrapText(ctx, newText, canvas.width / 2.8, canvas.height / 4, 450, 55);

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
            ctx.drawImage(avatar, 25, 25, 200, 200);

            if (uri) {
                return canvas.toDataURL("image/jpeg");
            }

            const attachment = new Attachment(canvas.toBuffer(), `welcome.jpg`);
            return attachment;
        }
    }
}