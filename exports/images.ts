module.exports = async (client: any, message: any) => {

    const https = require("https");
    const Danbooru = require("danbooru");
    //const danbooruKey = process.env.DANBOORU_API_KEY;
    const danbooru = new Danbooru();

    const PixivAppApi = require('pixiv-app-api');
    const pixivImg = require('pixiv-img');
    const translate = require('@vitalets/google-translate-api');
    
    const {Attachment} = require("discord.js");

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

    //Pixiv Image
    client.getPixivImage = async (tag: string) => {
        const pixiv = new PixivAppApi(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD);
        const pixivEmbed = client.createEmbed();
        let newTag = await translate(tag, {to: 'ja'});
        const json = await pixiv.searchIllust(newTag.text);
        const index = Math.floor(Math.random() * json.illusts.length);
        let image = json.illusts[index];
        if (!image) {
            pixivEmbed
            .setTitle(`**Pixiv Image** ${client.getEmoji("chinoSmug")}`)
            .setDescription("No results were found. Try searching for the japanese tag on the Pixiv website, " +
            "as some tags can't be translated to english!" + '\n[Pixiv Website](https://www.pixiv.net/)')
            return message.channel.send(pixivEmbed)
        }
        let comments = await pixiv.illustComments(image.id);
        let commentArray = [];
        for (let i = 0; i <= 5; i++) {
            if (!comments.comments[i]) break;
            commentArray.push(comments.comments[i].comment);
        }
        const url = await pixivImg(image.imageUrls.large);
        const authorUrl = await pixivImg(image.user.profileImageUrls.medium);
        const imageAttachment = new Attachment(url);
        const authorAttachment = new Attachment(authorUrl);
        let cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "");
        pixivEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
        .setTitle(`**Pixiv Image** ${client.getEmoji("chinoSmug")}`)
        .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .setDescription(
        `${client.getEmoji("star")}_Title:_ **${image.title}**\n` + 
        `${client.getEmoji("star")}_Artist:_ **${image.user.name}**\n` + 
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(image.createDate)}**\n` + 
        `${client.getEmoji("star")}_Views:_ **${image.totalView}**\n` + 
        `${client.getEmoji("star")}_Bookmarks:_ **${image.totalBookmarks}**\n` + 
        `${client.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` + 
        `${client.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n` 
        )
        .attachFiles([authorAttachment, imageAttachment])
        .setThumbnail(`attachment://${authorAttachment.file}`)
        .setImage(`attachment://${imageAttachment.file}`);
        message.channel.send(pixivEmbed);
    }

    //Pixiv R18 Image
    client.getR18PixivImage = async (tag: string) => {
        const pixiv = new PixivAppApi(process.env.PIXIVR18_NAME, process.env.PIXIVR18_PASSWORD);
        const pixivEmbed = client.createEmbed();
        let newTag = await translate(tag, {to: 'ja'});
        const json = await pixiv.searchIllust(`R-18 ${newTag.text}`);
        const index = Math.floor(Math.random() * json.illusts.length);
        let image = json.illusts[index];
        if (!image) {
            pixivEmbed
            .setTitle(`**Pixiv R-18 Image** ${client.getEmoji("chinoSmug")}`)
            .setDescription("No results were found. Try searching for the japanese tag on the Pixiv website, " +
            "as some tags can't be translated to english!" + '\n[Pixiv Website](https://www.pixiv.net/)')
            return message.channel.send(pixivEmbed)
        }
        let comments = await pixiv.illustComments(image.id);
        let commentArray = [];
        for (let i = 0; i <= 5; i++) {
            if (!comments.comments[i]) break;
            commentArray.push(comments.comments[i].comment);
        }
        const url = await pixivImg(image.imageUrls.large);
        const authorUrl = await pixivImg(image.user.profileImageUrls.medium);
        const imageAttachment = new Attachment(url);
        const authorAttachment = new Attachment(authorUrl);
        let cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "");
        pixivEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
        .setTitle(`**Pixiv Image** ${client.getEmoji("chinoSmug")}`)
        .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .setDescription(
        `${client.getEmoji("star")}_Title:_ **${image.title}**\n` + 
        `${client.getEmoji("star")}_Artist:_ **${image.user.name}**\n` + 
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(image.createDate)}**\n` + 
        `${client.getEmoji("star")}_Views:_ **${image.totalView}**\n` + 
        `${client.getEmoji("star")}_Bookmarks:_ **${image.totalBookmarks}**\n` + 
        `${client.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` + 
        `${client.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n` 
        )
        .attachFiles([authorAttachment, imageAttachment])
        .setThumbnail(`attachment://${authorAttachment.file}`)
        .setImage(`attachment://${imageAttachment.file}`);
        message.channel.send(pixivEmbed);
    }

    //Pixiv Popular Image
    client.getPopularPixivImage = async () => {
        const pixiv = new PixivAppApi(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD);
        const pixivEmbed = client.createEmbed();
        const json = await pixiv.illustRanking();
        const index = Math.floor(Math.random() * json.illusts.length);
        let image = json.illusts[index];
        let comments = await pixiv.illustComments(image.id);
        let commentArray = [];
        for (let i = 0; i <= 5; i++) {
            if (!comments.comments[i]) break;
            commentArray.push(comments.comments[i].comment);
        }
        const url = await pixivImg(image.imageUrls.large);
        const authorUrl = await pixivImg(image.user.profileImageUrls.medium);
        const imageAttachment = new Attachment(url);
        const authorAttachment = new Attachment(authorUrl);
        let cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "");
        pixivEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
        .setTitle(`**Pixiv Image** ${client.getEmoji("chinoSmug")}`)
        .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .setDescription(
        `${client.getEmoji("star")}_Title:_ **${image.title}**\n` + 
        `${client.getEmoji("star")}_Artist:_ **${image.user.name}**\n` + 
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(image.createDate)}**\n` + 
        `${client.getEmoji("star")}_Views:_ **${image.totalView}**\n` + 
        `${client.getEmoji("star")}_Bookmarks:_ **${image.totalBookmarks}**\n` + 
        `${client.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` + 
        `${client.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n` 
        )
        .attachFiles([authorAttachment, imageAttachment])
        .setThumbnail(`attachment://${authorAttachment.file}`)
        .setImage(`attachment://${imageAttachment.file}`);
        message.channel.send(pixivEmbed);
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