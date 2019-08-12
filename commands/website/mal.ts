exports.run = async (client: any, message: any, args: string[]) => {
    const Jikan = require('jikan-node');
    const mal = new Jikan();

    if (args[1] === "character") {
        let query = client.combineArgs(args, 2);
        let result = await mal.search("character", query.trim());
        let malArray: any = [];
        for (let i = 0; i < result.results.length; i++) {
            let char = result.results[i];
            let detailed = await mal.findCharacter(char.mal_id);
            let info = char.anime.join("") ? char.anime.map((n) => n.name) : char.manga.map((n) => n.name);
            let malEmbed = client.createEmbed();
            malEmbed
            .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
            .setTitle(`**My Anime List Search** ${client.getEmoji("raphi")}`)
            .setURL(char.url)
            .setImage(char.image_url)
            .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
            .setDescription(
                `${client.getEmoji("star")}_Character:_ **${char.name}**\n` +
                `${client.getEmoji("star")}_Kanji:_ **${detailed.name_kanji ? detailed.name_kanji : "None"}**\n` +
                `${client.getEmoji("star")}_Alternate Names:_ **${char.alternate_names ? char.alternate_names.join(", ") : "None"}**\n` +
                `${client.getEmoji("star")}_Series:_ ${info.join(", ")}\n` +
                `${client.getEmoji("star")}_Favorites:_ **${detailed.member_favorites}**\n` +
                `${client.getEmoji("star")}_Description:_ ${detailed.about}\n`
            )
            malArray.push(malEmbed);
        }
        client.createReactionEmbed(malArray);
        return;
    }

    if (args[1] === "user") {
        let result = await mal.findUser(args[2]);
        let malEmbed = client.createEmbed();
        let anime = result.favorites.anime.map((a) => a.name);
        let characters = result.favorites.characters.map((c) => c.name);
        let cleanText = result.about.replace(/<\/?[^>]+(>|$)/g, "");
        malEmbed
        .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setTitle(`**My Anime List Search** ${client.getEmoji("raphi")}`)
        .setURL(result.url)
        .setImage(result.image_url)
        .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setDescription(
            `${client.getEmoji("star")}_User:_ **${result.username}**\n` +
            `${client.getEmoji("star")}_Last Online:_ **${client.formatDate(result.last_online)}**\n` +
            `${client.getEmoji("star")}_Join Date:_ **${client.formatDate(result.joined)}**\n` +
            `${client.getEmoji("star")}_Birthday:_ **${client.formatDate(result.birthday)}**\n` +
            `${client.getEmoji("star")}_Location:_ **${result.location}**\n` +
            `${client.getEmoji("star")}_Days Watched:_ **${result.anime_stats.days_watched}**\n` +
            `${client.getEmoji("star")}_Episodes Watched:_ **${result.anime_stats.episodes_watched}**\n` +
            `${client.getEmoji("star")}_Entries:_ **${result.anime_stats.total_entries}**\n` +
            `${client.getEmoji("star")}_Favorite Anime:_ ${client.checkChar(anime.join(", "), 100, " ")}\n` +
            `${client.getEmoji("star")}_Favorite Characters:_ ${client.checkChar(characters.join(", "), 100, " ")}\n` +
            `${client.getEmoji("star")}_Description:_ ${client.checkChar(cleanText, 1500, " ")}\n`
        )
        message.channel.send(malEmbed);
        return;

    }

    let result;
    let query = client.combineArgs(args, 1);
    if (!query) {
        let raw = await mal.findTop("anime");
        result = raw.top;
    } else {
        let raw = await mal.search("anime", query.trim());
        result = raw.results;
    }

    let malArray: any = [];
    for (let i = 0; i < result.length; i++) {
        let malEmbed = client.createEmbed();
        let anime = result[i];
        let detailed = await mal.findAnime(anime.mal_id);
        malEmbed
        .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setTitle(`**My Anime List Search** ${client.getEmoji("raphi")}`)
        .setURL(anime.url)
        .setImage(anime.image_url)
        .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setDescription(
            `${client.getEmoji("star")}_Anime:_ **${anime.title}**\n` +
            `${client.getEmoji("star")}_Episodes:_ **${anime.episodes}**\n` +
            `${client.getEmoji("star")}_Start Date:_ **${client.formatDate(anime.start_date)}**\n` +
            `${client.getEmoji("star")}_End Date:_ **${client.formatDate(anime.end_date)}**\n` +
            `${client.getEmoji("star")}_Members:_ **${anime.members}**\n` +
            `${client.getEmoji("star")}_Score:_ **${anime.score}**\n` +
            `${client.getEmoji("star")}_Rank:_ **${detailed.rank}**\n` +
            `${client.getEmoji("star")}_Popularity:_ **${detailed.popularity}**\n` +
            `${client.getEmoji("star")}_Description:_ ${client.checkChar(detailed.synopsis, 1700, ".")}\n`
        )
        malArray.push(malEmbed);
    }
    client.createReactionEmbed(malArray);
}