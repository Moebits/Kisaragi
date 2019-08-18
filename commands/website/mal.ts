exports.run = async (discord: any, message: any, args: string[]) => {
    const Jikan = require('jikan-node');
    const mal = new Jikan();

    if (args[1] === "character") {
        let query = discord.combineArgs(args, 2);
        let result = await mal.search("character", query.trim());
        let malArray: any = [];
        for (let i = 0; i < result.results.length; i++) {
            let char = result.results[i];
            let detailed = await mal.findCharacter(char.mal_id);
            let info = char.anime.join("") ? char.anime.map((n) => n.name) : char.manga.map((n) => n.name);
            let malEmbed = discord.createEmbed();
            malEmbed
            .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
            .setTitle(`**My Anime List Search** ${discord.getEmoji("raphi")}`)
            .setURL(char.url)
            .setImage(char.image_url)
            .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
            .setDescription(
                `${discord.getEmoji("star")}_Character:_ **${char.name}**\n` +
                `${discord.getEmoji("star")}_Kanji:_ **${detailed.name_kanji ? detailed.name_kanji : "None"}**\n` +
                `${discord.getEmoji("star")}_Alternate Names:_ **${char.alternate_names ? char.alternate_names.join(", ") : "None"}**\n` +
                `${discord.getEmoji("star")}_Series:_ ${info.join(", ")}\n` +
                `${discord.getEmoji("star")}_Favorites:_ **${detailed.member_favorites}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${detailed.about}\n`
            )
            malArray.push(malEmbed);
        }
        discord.createReactionEmbed(malArray);
        return;
    }

    if (args[1] === "user") {
        let result = await mal.findUser(args[2]);
        let malEmbed = discord.createEmbed();
        let anime = result.favorites.anime.map((a) => a.name);
        let characters = result.favorites.characters.map((c) => c.name);
        let cleanText = result.about.replace(/<\/?[^>]+(>|$)/g, "");
        malEmbed
        .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setTitle(`**My Anime List Search** ${discord.getEmoji("raphi")}`)
        .setURL(result.url)
        .setImage(result.image_url)
        .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setDescription(
            `${discord.getEmoji("star")}_User:_ **${result.username}**\n` +
            `${discord.getEmoji("star")}_Last Online:_ **${discord.formatDate(result.last_online)}**\n` +
            `${discord.getEmoji("star")}_Join Date:_ **${discord.formatDate(result.joined)}**\n` +
            `${discord.getEmoji("star")}_Birthday:_ **${discord.formatDate(result.birthday)}**\n` +
            `${discord.getEmoji("star")}_Location:_ **${result.location}**\n` +
            `${discord.getEmoji("star")}_Days Watched:_ **${result.anime_stats.days_watched}**\n` +
            `${discord.getEmoji("star")}_Episodes Watched:_ **${result.anime_stats.episodes_watched}**\n` +
            `${discord.getEmoji("star")}_Entries:_ **${result.anime_stats.total_entries}**\n` +
            `${discord.getEmoji("star")}_Favorite Anime:_ ${discord.checkChar(anime.join(", "), 100, " ")}\n` +
            `${discord.getEmoji("star")}_Favorite Characters:_ ${discord.checkChar(characters.join(", "), 100, " ")}\n` +
            `${discord.getEmoji("star")}_Description:_ ${discord.checkChar(cleanText, 1500, " ")}\n`
        )
        message.channel.send(malEmbed);
        return;

    }

    let result;
    let query = discord.combineArgs(args, 1);
    if (!query) {
        let raw = await mal.findTop("anime");
        result = raw.top;
    } else {
        let raw = await mal.search("anime", query.trim());
        result = raw.results;
    }

    let malArray: any = [];
    for (let i = 0; i < result.length; i++) {
        let malEmbed = discord.createEmbed();
        let anime = result[i];
        let detailed = await mal.findAnime(anime.mal_id);
        malEmbed
        .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setTitle(`**My Anime List Search** ${discord.getEmoji("raphi")}`)
        .setURL(anime.url)
        .setImage(anime.image_url)
        .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setDescription(
            `${discord.getEmoji("star")}_Anime:_ **${anime.title}**\n` +
            `${discord.getEmoji("star")}_Episodes:_ **${anime.episodes}**\n` +
            `${discord.getEmoji("star")}_Start Date:_ **${discord.formatDate(anime.start_date)}**\n` +
            `${discord.getEmoji("star")}_End Date:_ **${discord.formatDate(anime.end_date)}**\n` +
            `${discord.getEmoji("star")}_Members:_ **${anime.members}**\n` +
            `${discord.getEmoji("star")}_Score:_ **${anime.score}**\n` +
            `${discord.getEmoji("star")}_Rank:_ **${detailed.rank}**\n` +
            `${discord.getEmoji("star")}_Popularity:_ **${detailed.popularity}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${discord.checkChar(detailed.synopsis, 1700, ".")}\n`
        )
        malArray.push(malEmbed);
    }
    discord.createReactionEmbed(malArray);
}