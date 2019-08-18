exports.run = async (discord: any, message: any, args: string[]) => {
    const nhentai = require('nhentai-js');
    const blacklist = require("../../../blacklist.json");

    discord.nhentaiRandom = async (filter?: boolean) => {
        let random = "0";
        while (!await nhentai.exists(random)) {
            random = Math.floor(Math.random() * 1000000).toString();
        }
        let doujin = await nhentai.getDoujin(random);
        if (filter) {
            for (let i in doujin.details.tags) {
                for (let j in blacklist.nhentai) {
                    if (doujin.details.tags[i] === blacklist.nhentai[j]) {
                        await discord.nhentaiRandom(true);
                    }
                }
            }
        }
        return doujin;
    }

    if (!args[1]) {
        let doujin = await discord.nhentaiRandom(false);
        discord.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g));
        return;
    } else {
        
        if (args[1].toLowerCase() === "random") {
            let doujin = await discord.nhentaiRandom(true);
            discord.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g));
            return;
        }

        let tag = discord.combineArgs(args, 1);
        if (tag.match(/\d+/g) !== null) {
            let doujin = await nhentai.getDoujin(tag.match(/\d+/g).toString());
            discord.getNhentaiDoujin(doujin, tag.match(/\d+/g).toString())
        } else {
            let result = await nhentai.search(tag)
            let index = Math.floor(Math.random() * 10);
            let book = result.results[index]
            let doujin = await nhentai.getDoujin(book.bookId);
            discord.getNhentaiDoujin(doujin, book.bookId)
        }
    }
}