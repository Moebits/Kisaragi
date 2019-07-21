exports.run = async (client: any, message: any, args: string[]) => {
    const nhentai = require('nhentai-js');
    let tag = client.combineArgs(args, 1);
    if (tag.match(/\d+/g) !== null) {
        let doujin = await nhentai.getDoujin(tag.match(/\d+/g).toString());
        console.log(doujin)
        let checkArtists = doujin.details.artists ? client.checkChar(doujin.details.artists.join(" "), 10, ")") : "None";
        let checkCharacters = doujin.details.characters ? client.checkChar(doujin.details.characters.join(" "), 20, ")") : "None";
        let checkTags = doujin.details.tags ? client.checkChar(doujin.details.tags.join(" "), 20, ")") : "None";
        let checkParodies = doujin.details.parodies ? client.checkChar(doujin.details.parodies.join(" "), 10, ")") : "None";
        let checkGroups = doujin.details.groups ? client.checkChar(doujin.details.groups.join(" "), 50, ")") : "None";
        let checkLanguages = doujin.details.languages ? client.checkChar(doujin.details.languages.join(" "), 10, ")") : "None";
        let checkCategories = doujin.details.categories ? client.checkChar(doujin.details.categories.join(" "), 10, ")") : "None";
        let doujinPages: any = [];
        for (let i = 0; i < doujin.pages.length; i++) {
            let nhentaiEmbed = client.createEmbed();
            nhentaiEmbed
            .setAuthor("nhentai", "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg")
            .setTitle(`**Hentai Doujinshi** ${client.getEmoji("madokaLewd")}`)
            .setURL(doujin.link)
            .setDescription(
            `${client.getEmoji("star")}_English Title:_ **${doujin.title}**\n` +
            `${client.getEmoji("star")}_Japanese Title:_ **${doujin.nativeTitle}**\n` +
            `${client.getEmoji("star")}_ID:_ **${tag}**\n` +
            `${client.getEmoji("star")}_Artists:_ ${checkArtists}\n` +
            `${client.getEmoji("star")}_Characters:_ ${checkCharacters}\n` +
            `${client.getEmoji("star")}_Tags:_ ${checkTags} ${checkParodies}` +
            `${checkGroups} ${checkLanguages} ${checkCategories}\n` 
            )
            .setThumbnail(doujin.thumbnails[i])
            .setImage(doujin.pages[i]);
            doujinPages.push(nhentaiEmbed);
        }
        client.createReactionEmbed(doujinPages);
    } else {
        let result = await nhentai.search(tag)
        let index = Math.floor(Math.random() * 10);
        let book = result.results[index]
        let doujin = await nhentai.getDoujin(book.bookId);
        let checkArtists = doujin.details.artists ? client.checkChar(doujin.details.artists.join(" "), 10, ")") : "None";
        let checkCharacters = doujin.details.characters ? client.checkChar(doujin.details.characters.join(" "), 20, ")") : "None";
        let checkTags = doujin.details.tags ? client.checkChar(doujin.details.tags.join(" "), 20, ")") : "None";
        let checkParodies = doujin.details.parodies ? client.checkChar(doujin.details.parodies.join(" "), 10, ")") : "None";
        let checkGroups = doujin.details.groups ? client.checkChar(doujin.details.groups.join(" "), 50, ")") : "None";
        let checkLanguages = doujin.details.languages ? client.checkChar(doujin.details.languages.join(" "), 10, ")") : "None";
        let checkCategories = doujin.details.categories ? client.checkChar(doujin.details.categories.join(" "), 10, ")") : "None";
        let doujinPages: any = [];
        for (let i = 0; i < doujin.pages.length; i++) {
            let nhentaiEmbed = client.createEmbed();
            nhentaiEmbed
            .setAuthor("nhentai", "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg")
            .setTitle(`**Hentai Doujinshi** ${client.getEmoji("madokaLewd")}`)
            .setURL(doujin.link)
            .setDescription(
            `${client.getEmoji("star")}_English Title:_ **${doujin.title}**\n` +
            `${client.getEmoji("star")}_Japanese Title:_ **${doujin.nativeTitle}**\n` +
            `${client.getEmoji("star")}_ID:_ **${book.bookId}**\n` +
            `${client.getEmoji("star")}_Artists:_ ${checkArtists}\n` +
            `${client.getEmoji("star")}_Characters:_ ${checkCharacters}\n` +
            `${client.getEmoji("star")}_Tags:_ ${checkTags} ${checkParodies}` +
            `${checkGroups} ${checkLanguages} ${checkCategories}\n` 
            )
            .setThumbnail(doujin.thumbnails[i])
            .setImage(doujin.pages[i]);
            doujinPages.push(nhentaiEmbed);
        }
        client.createReactionEmbed(doujinPages);
        
    }
}