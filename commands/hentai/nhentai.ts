exports.run = async (client: any, message: any, args: string[]) => {
    const nhentai = require('nhentai-js');
    if (args[1].toLowerCase() === "random") {
        let random = "0";
        while (!await nhentai.exists(random)) {
            random = Math.floor(Math.random() * 1000000).toString();
        }
        let doujin = await nhentai.getDoujin(random);
        client.getNhentaiDoujin(doujin, random);
        return;
    }
    let tag = client.combineArgs(args, 1);
    if (tag.match(/\d+/g) !== null) {
        let doujin = await nhentai.getDoujin(tag.match(/\d+/g).toString());
        client.getNhentaiDoujin(doujin, tag.match(/\d+/g).toString())
    } else {
        let result = await nhentai.search(tag)
        let index = Math.floor(Math.random() * 10);
        let book = result.results[index]
        let doujin = await nhentai.getDoujin(book.bookId);
        client.getNhentaiDoujin(doujin, book.bookId)
    }
}