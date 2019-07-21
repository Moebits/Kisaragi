module.exports = async (client: any, message: any) => {

    const https = require("https");
    const Danbooru = require("danbooru");
    //const danbooruKey = process.env.DANBOORU_API_KEY;
    const danbooru = new Danbooru();
    const PixivApi = require('pixiv-api-client');
    const pixiv = new PixivApi();
    const pixivImg = require('pixiv-img');
    const translate = require('@vitalets/google-translate-api');
    
    const {Attachment} = require("discord.js");
    const imagemin = require("imagemin");
    const imageminGifsicle = require("imagemin-gifsicle");

    //Compress Gif
    client.compressGif = async (input) => {
        let file = await imagemin(input, 
        {destination: "../assets/gifs",
        plugins: [imageminGifsicle({interlaced: true, optimizationLevel: 3, colors: 256, optimize: 3, lossy: 80})]
        });
        return file;
    }

    //Danbooru image
    client.getSafeDanbooruImage = async (name: string) => {
        const searchTerm = name.replace(/ /g,"_");
        console.log(searchTerm);
        const posts = await danbooru.posts({tags: `${searchTerm} rating:safe order:rank`, limit: 100});
        const index = Math.floor(Math.random() * posts.length);
        console.log(posts)
        const post = posts[index];
        const url = danbooru.url(post.file_url);
        return https.get(url.href);
    }

    //Create Pixiv Embed
    client.createPixivEmbed = async (image: any, refreshToken: string) => {
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
    client.getPixivImage = async (tag: string, r18?: boolean, en?: boolean, ugoira?: boolean, noEmbed?: boolean) => {
        let newTag;
        if (en) {
            newTag = tag;
        } else {
            newTag = await client.pixivTag(tag);
        }
        let json;
        if (r18) {
            await pixiv.login(process.env.PIXIVR18_NAME, process.env.PIXIVR18_PASSWORD);
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
        let refreshToken = await pixiv.refreshAccessToken();
        await [].sort.call(json.illusts, ((a: any, b: any) => (a.total_bookmarks - b.total_bookmarks)*-1));
        let index = Math.floor(Math.random() * (10));
        let image = json.illusts[index]; 
        if (noEmbed) return image;

        let pixivEmbed = await client.createPixivEmbed(image, refreshToken.refresh_token);
        return message.channel.send(pixivEmbed);
    }

    //Pixiv Popular Image
    client.getPopularPixivImage = async () => {
        await pixiv.login(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD);
        const json = await pixiv.illustRanking();
        await [].sort.call(json.illusts, ((a: any, b: any) => (a.total_bookmarks - b.total_bookmarks)*-1));
        let index = Math.floor(Math.random() * (10));
        let image = json.illusts[index]; 
    
        let pixivEmbed = await client.createPixivEmbed(image);
        return message.channel.send(pixivEmbed);
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