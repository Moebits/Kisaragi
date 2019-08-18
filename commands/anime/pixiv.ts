import {Message} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => {
    const tags = discord.combineArgs(args, 1);
    let refreshToken = await discord.pixivLogin();

    if (!args[1]) {
        discord.getRandomPixivImage(refreshToken);
        return;
    }

    if (tags.match(/\d+/g) !== null) {
        discord.getPixivImageID(refreshToken, tags.match(/\d+/g))
        return;
    }

    if (args[1].toLowerCase() === "r18") {
        if (args[2].toLowerCase() === "en") {
            const tags = discord.combineArgs(args, 2);
            discord.getPixivImage(refreshToken, tags, true, true);
            return;
        } else {
            const tags = discord.combineArgs(args, 2);
            discord.getPixivImage(refreshToken, tags, true);
            return;
        }
    }

    if (args[1].toLowerCase() === "en") {
        const tags = discord.combineArgs(args, 2);
        discord.getPixivImage(refreshToken, tags, false, true);
        return;
    }

    if (args[1].toLowerCase() === "popular") {
        if (args[2].toLowerCase() === "r18") {
            discord.getPopularR18PixivImage(refreshToken);
            return;
        }
        discord.getPopularPixivImage(refreshToken);
        return;

    }
    
   
    discord.getPixivImage(refreshToken, tags);
}