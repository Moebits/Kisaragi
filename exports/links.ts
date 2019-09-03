const linkCool = new Set();

module.exports = async (discord: any, message: any) => {

    await require("./images.js")(discord, message);

    discord.linkRun = async (path: any, msg: any, args: string[]) => {
        if (linkCool.has(msg.guild.id)) {
            let reply = await msg.reply("This command is under a 30 second cooldown!");
            reply.delete(3000);
            return;
        }
        linkCool.add(msg.guild.id);
        setTimeout(() => linkCool.delete(msg.guild.id), 30000);
        let loading = await msg.channel.send(`**Loading** ${discord.getEmoji("gabCircle")}`);
        await path.run(discord, msg, args).catch((err) => msg.channel.send(discord.cmdError(err)));
        loading.delete(1000);
    }

    discord.postLink = async (msg: any) => {
        if (msg.content.startsWith("https://www.youtube.com/channel/") || msg.content.startsWith("https://www.youtube.com/c/")) {
            const path = require("../commands/website/youtube.js");
            await discord.linkRun(path, msg, ["youtube", "channel", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://www.youtube.com/watch") || msg.content.startsWith("https://youtu.be/")) {
            const path = require("../commands/website/youtube.js");
            await discord.linkRun(path, msg, ["youtube", "video", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://www.youtube.com/playlist")) {
            const path = require("../commands/website/youtube.js");
            await discord.linkRun(path, msg, ["youtube", "playlist", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=")) {
            const path = require("../commands/anime/pixiv.js");
            await discord.linkRun(path, msg, ["pixiv", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://danbooru.donmai.us/posts/")) {
            const path = require("../commands/anime/danbooru.js");
            await discord.linkRun(path, msg, ["danbooru", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://gelbooru.com/index.php?page=post&s=view&id=")) {
            const path = require("../commands/anime/gelbooru.js");
            await discord.linkRun(path, msg, ["gelbooru", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://konachan.net/post/show/")) {
            const path = require("../commands/anime/konachan.js");
            await discord.linkRun(path, msg, ["konachan", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://lolibooru.moe/post/show/")) {
            const path = require("../commands/anime/lolibooru.js");
            await discord.linkRun(path, msg, ["lolibooru", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://yande.re/post/show/")) {
            const path = require("../commands/anime/yandere.js");
            await discord.linkRun(path, msg, ["yandere", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://rule34.xxx/index.php?page=post&s=view&id=")) {
            const path = require("../commands/hentai/rule34.js");
            await discord.linkRun(path, msg, ["rule34", msg.content]);
            return;
        }
        if (msg.content.startsWith("https://nhentai.net/g/")) {
            const path = require("../commands/hentai/nhentai.js");
            await discord.linkRun(path, msg, ["nhentai", msg.content]);
            return;
        }
    }
}