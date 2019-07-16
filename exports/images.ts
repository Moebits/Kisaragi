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
        pixivEmbed
        .setTitle(`**Pixiv Image** ${client.getEmoji("chinoSmug")}`)
        .addField("**Title**", image.title)
        .addField("**Artist**", image.user.name)
        .addField("**Link**", `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .addField("**Create Date**", client.formatDate(image.createDate))
        .addField("**Views**", image.totalView)
        .addField("**Bookmarks**", image.totalBookmarks)
        .addField("**Description**", image.caption ? image.caption : "None")
        .addField("**Comments**", commentArray.join() ? commentArray.join() : "None")
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
        pixivEmbed
        .setTitle(`**Pixiv R-18 Image** ${client.getEmoji("chinoSmug")}`)
        .addField("**Title**", image.title)
        .addField("**Artist**", image.user.name)
        .addField("**Link**", `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .addField("**Create Date**", client.formatDate(image.createDate))
        .addField("**Views**", image.totalView)
        .addField("**Bookmarks**", image.totalBookmarks)
        .addField("**Description**", image.caption ? image.caption : "None")
        .addField("**Comments**", commentArray.join() ? commentArray.join() : "None")
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
        pixivEmbed
        .setTitle(`**Pixiv Image** ${client.getEmoji("chinoSmug")}`)
        .addField("**Title**", image.title)
        .addField("**Artist**", image.user.name)
        .addField("**Link**", `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .addField("**Create Date**", client.formatDate(image.createDate))
        .addField("**Views**", image.totalView)
        .addField("**Bookmarks**", image.totalBookmarks)
        .addField("**Description**", image.caption ? image.caption : "None")
        .addField("**Comments**", commentArray.join() ? commentArray.join() : "None")
        .attachFiles([authorAttachment, imageAttachment])
        .setThumbnail(`attachment://${authorAttachment.file}`)
        .setImage(`attachment://${imageAttachment.file}`);
        message.channel.send(pixivEmbed);
    }

}