exports.run = async (client: any, message: any, args: string[]) => {
    const nhentai = require('nhentai-js');
    const blacklist = require("../../../blacklist.json");

    client.nhentaiRandom = async (filter?: boolean) => {
        let random = "0";
        while (!await nhentai.exists(random)) {
            random = Math.floor(Math.random() * 1000000).toString();
        }
        let doujin = await nhentai.getDoujin(random);
        if (filter) {
            for (let i in doujin.details.tags) {
                for (let j in blacklist.nhentai) {
                    if (doujin.details.tags[i] === blacklist.nhentai[j]) {
                        await client.nhentaiRandom(true);
                    }
                }
            }
        }
        return doujin;
    }

    if (!args[1]) {
        let doujin = await client.nhentaiRandom(false);
        console.log(doujin)
        client.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g));
        return;
    }
    if (args[1].toLowerCase() === "random") {
        let doujin = await client.nhentaiRandom(true);
        client.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g));
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