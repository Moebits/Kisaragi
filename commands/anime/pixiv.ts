exports.run = async (client: any, message: any, args: string[]) => {

    if (args[1].toLowerCase() === "r18") {
        const tags = client.combineArgs(args, 2);
        client.getR18PixivImage(tags);
        return;
    }

    if (args[1].toLowerCase() === "popular") {
        client.getPopularPixivImage();
        return;

    }
    
    const tags = client.combineArgs(args, 1);
    client.getPixivImage(tags);
}