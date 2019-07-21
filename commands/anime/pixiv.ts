exports.run = async (client: any, message: any, args: string[]) => {

    if (args[1].toLowerCase() === "r18") {
        if (args[2].toLowerCase() === "en") {
            const tags = client.combineArgs(args, 2);
            client.getPixivImage(tags, true, true);
            return;
        } else {
            const tags = client.combineArgs(args, 2);
            client.getPixivImage(tags, true);
            return;
        }
    }

    if (args[1].toLowerCase() === "en") {
        const tags = client.combineArgs(args, 2);
        client.getPixivImage(tags, false, true);
        return;
    }

    if (args[1].toLowerCase() === "popular") {
        client.getPopularPixivImage();
        return;

    }
    
    const tags = client.combineArgs(args, 1);
    client.getPixivImage(tags);
}