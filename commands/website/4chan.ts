exports.run = async (discord: any, message: any, args: string[]) => {
    let chan = require("4chanapi.js")
    let axios = require("axios");

    if (args[1] === "images") {
        let board = args[2];
        let query = discord.combineArgs(args, 3);
        let threads = await chan.threadsWithTopics(board, query.split(","))
        let random = Math.floor(Math.random() * threads.length);
        if (!threads[random]) {
            discord.chanError();
            return;
        }
        let results = await chan.threadMediaLinks(threads[random].url);
        let rawUrl = `https://boards.4channel.org/${board}/thread/${threads[random].url.match(/\d+/g)}`;
        let url = rawUrl.replace(/4,/g, "");
        let imageArray: any = [];
        for (let i in results) {
            let chanEmbed = discord.createEmbed();
            chanEmbed
            .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
            .setTitle(`**4chan Search** ${discord.getEmoji("vigneDead")}`)
            .setURL(url)
            .setImage(results[i])
            imageArray.push(chanEmbed);
        }
        if (imageArray.length === 1) {
            message.channel.send(imageArray[0]);
        } else {
            discord.createReactionEmbed(imageArray);
        }
        return;
    }
    
    let board = args[1];
    let query = discord.combineArgs(args, 2);

    discord.formatComment = (comment: string, post: string) => {
        let clean1 = comment.replace(/&#039;/g, "'").replace(/<br>/g, "\n");
        let clean2 = clean1.replace(/(?<=<a).*?(?=<\/a>)/g, `[>>${post.slice(-9)}](${post})`);
        let clean3 = clean2.replace(/<a/g, "").replace(/<\/a>/g, "");
        let clean4 = clean3.replace(/<s>/g, "||").replace(/<\/s>/g, "||");
        let clean5 = clean4.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        let clean6 = clean5.replace(/<span class="quote">/g, "").replace(/<\/span>/g, "\n");
        let clean7 = discord.checkChar(clean6, "1800", ".");
        return clean7;
    }

    discord.chanError = () => {
        let chanEmbed = discord.createEmbed();
        chanEmbed
        .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
        .setTitle(`**4chan Search** ${discord.getEmoji("vigneDead")}`)
        .setDescription("No results were found. Try searching for a different tag.")
        message.channel.send(chanEmbed);
    }

    let threads = await chan.threadsWithTopics(board, query.split(","))
    let random = Math.floor(Math.random() * threads.length);
    if (!threads[random]) {
        discord.chanError();
        return;
    }
    let json = await axios.get(threads[random].url);
    let posts = json.data.posts;
    let rawUrl = `https://boards.4channel.org/${board}/thread/${threads[random].url.match(/\d+/g)}`;
    let url = rawUrl.replace(/4,/g, "");
    let chanArray: any = [];
    for (let i in posts) {
        let chanEmbed = discord.createEmbed();
        chanEmbed
        .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
        .setTitle(`${posts[0].sub ? posts[0].sub : threads[random].semantic_url} ${discord.getEmoji("vigneDead")}`)
        .setURL(url)
        .setImage(posts[i].tim ? `https://i.4cdn.org/${board}/${posts[i].tim}${posts[i].ext}` : url)
        .setDescription(
            `${discord.getEmoji("star")}_Post:_ **${url}#p${posts[i].no}**\n` +
            `${discord.getEmoji("star")}_Unique IPs:_ **${posts[0].unique_ips}**\n` +
            `${discord.getEmoji("star")}_Author:_ **${posts[i].name} ${posts[i].now} No. ${posts[i].no}**\n` +
            `${discord.getEmoji("star")}_Image Info:_ ${posts[i].tim ? `File: ${posts[i].filename}${posts[i].ext} (${Math.floor(posts[i].fsize/1024)} KB, ${posts[i].w}x${posts[i].h})`: "None"}\n` +
            `${discord.getEmoji("star")}_Comment:_ ${posts[i].com ? discord.formatComment(posts[i].com, `${url}#p${posts[i].no}`) : "None"}\n`
        )
        chanArray.push(chanEmbed);
    }
    if (chanArray.length === 1) {
        message.channel.send(chanArray[0]);
    } else {
        discord.createReactionEmbed(chanArray);
    }
}