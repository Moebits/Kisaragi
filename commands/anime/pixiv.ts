exports.run = async (client: any, message: any, args: string[]) => {
    const tags = client.combineArgs(args, 1);
    let refreshToken = client.pixivLogin();

    if (tags.match(/\d+/g) !== null) {
        client.getPixivImageID(tags.match(/\d+/g))
        return;
    }

    if (args[1].toLowerCase() === "r18") {
        if (args[2].toLowerCase() === "en") {
            const tags = client.combineArgs(args, 2);
            client.getPixivImage(tags, true, true);
            return;
        } else {
            const tags = client.combineArgs(args, 2);
            client.getPixivImage(refreshToken, tags, true);
            return;
        }
    }

    if (args[1].toLowerCase() === "en") {
        const tags = client.combineArgs(args, 2);
        client.getPixivImage(refreshToken, tags, false, true);
        return;
    }

    if (args[1].toLowerCase() === "popular") {
        if (args[2].toLowerCase() === "r18") {
            client.getPopularR18PixivImage(refreshToken);
            return;
        }
        client.getPopularPixivImage(refreshToken);
        return;

    }
    
   
    client.getPixivImage(tags);
}