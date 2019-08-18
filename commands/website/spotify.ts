exports.run = async (discord: any, message: any, args: string[]) => {
    let Spotify = require('node-spotify-api');
    let ms = require("pretty-ms");
 
    let spotify = new Spotify({
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET
    });

    if (args[1] === "artist") {
        let query = discord.combineArgs(args, 2);
        let response = await spotify.search({type: "artist", query: query.trim()});
        let artist = response.artists.items[0];
        let spotifyEmbed = discord.createEmbed();
        spotifyEmbed
        .setAuthor("spotify", "https://www.freepnglogos.com/uploads/spotify-logo-png/image-gallery-spotify-logo-21.png")
        .setTitle(`**Spotify Artist** ${discord.getEmoji("aquaUp")}`)
        .setURL(artist.external_urls.spotify)
        .setImage(artist.images[0].url)
        .setDescription(
            `${discord.getEmoji("star")}_Artist:_ **${artist.name}**\n` +
            `${discord.getEmoji("star")}_Genres:_ **${artist.genres.join(", ")}**\n` +
            `${discord.getEmoji("star")}_Followers:_ **${artist.followers.total}**\n` +
            `${discord.getEmoji("star")}_Popularity:_ **${artist.popularity}**\n`
        )
        message.channel.send(spotifyEmbed);
        return;
    }

    let query = discord.combineArgs(args, 1);
    let response = await spotify.search({type: "track", query: query.trim()});
    let spotifyArray: any = [];
    for (let i = 0; i < response.tracks.items.length; i++) {
        let track = response.tracks.items[i];
        let artists = track.artists.map((a: any) => a.name);
        let artistResponse = await spotify.search({type: "artist", query: artists[0]});
        let image = artistResponse.artists.items[0].images[0].url;
        let spotifyEmbed = discord.createEmbed();
        spotifyEmbed
        .setAuthor("spotify", "https://www.freepnglogos.com/uploads/spotify-logo-png/image-gallery-spotify-logo-21.png")
        .setTitle(`**Spotify Search** ${discord.getEmoji("aquaUp")}`)
        .setImage(track.album.images[0].url)
        .setThumbnail(image)
        .setURL(track.external_urls.spotify)
        .setDescription(
            `${discord.getEmoji("star")}_Track:_ **${track.name}**\n` +
            `${discord.getEmoji("star")}_Artists:_ **${artists.join(", ")}**\n` +
            `${discord.getEmoji("star")}_Album:_ **${track.album.name}**\n` +
            `${discord.getEmoji("star")}_Tracks:_ **${track.album.total_tracks}**\n` +
            `${discord.getEmoji("star")}_Release Date:_ **${discord.formatDate(track.album.release_date)}**\n` +
            `${discord.getEmoji("star")}_Duration:_ **${ms(track.duration_ms, {secondsDecimalDigits: 0})}**\n` +
            `${discord.getEmoji("star")}_Popularity:_ **${track.popularity}**\n`
        )
        spotifyArray.push(spotifyEmbed);
    }
    discord.createReactionEmbed(spotifyArray);
}